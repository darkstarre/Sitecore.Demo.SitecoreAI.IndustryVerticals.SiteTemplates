#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INDUSTRY_DIR="$ROOT_DIR/industry-verticals"
AUTHORING_SITES_DIR="$ROOT_DIR/authoring/items/industry-verticals/sites"
XM_BUILD_FILE="$ROOT_DIR/xmcloud.build.json"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/create-vertical-from-retail.sh <vertical-slug>

Example:
  ./scripts/create-vertical-from-retail.sh interstate

What it does:
  - Clones industry-verticals/retail to industry-verticals/<vertical-slug>
  - Updates prepare hook path in cloned package.json
  - Creates Sitecore content/media serialization module files
  - Adds rendering host + SCS module entries in xmcloud.build.json and root build.json

Notes:
  - Intended for lowercase-kebab-case slugs (e.g. "interstate", "acme-energy")
  - Does not commit or push
EOF
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

SLUG="$1"
if [[ ! "$SLUG" =~ ^[a-z0-9-]+$ ]]; then
  echo "Error: vertical slug must match ^[a-z0-9-]+$"
  exit 1
fi

if [[ "$SLUG" == "retail" ]]; then
  echo "Error: target slug cannot be 'retail'"
  exit 1
fi

SOURCE_DIR="$INDUSTRY_DIR/retail"
TARGET_DIR="$INDUSTRY_DIR/$SLUG"
TARGET_MODULE_DIR="$AUTHORING_SITES_DIR/$SLUG"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: source directory '$SOURCE_DIR' not found"
  exit 1
fi

if [[ -e "$TARGET_DIR" ]]; then
  echo "Error: target directory already exists: '$TARGET_DIR'"
  exit 1
fi

if [[ ! -f "$XM_BUILD_FILE" ]]; then
  echo "Error: '$XM_BUILD_FILE' not found"
  exit 1
fi

pascal_case() {
  local input="$1"
  local out=""
  local part
  IFS='-' read -r -a parts <<<"$input"
  for part in "${parts[@]}"; do
    if [[ -n "$part" ]]; then
      out+="$(printf '%s' "$part" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"
    fi
  done
  echo "$out"
}

NAMESPACE_BASE="$(pascal_case "$SLUG")"
if [[ -z "$NAMESPACE_BASE" ]]; then
  echo "Error: could not derive namespace from slug '$SLUG'"
  exit 1
fi

CONTENT_NAMESPACE="Project.${NAMESPACE_BASE}-Content"
MEDIA_NAMESPACE="Project.${NAMESPACE_BASE}-Media"
CONTENT_MODULE_FILE="$TARGET_MODULE_DIR/${SLUG}-content.module.json"
MEDIA_MODULE_FILE="$TARGET_MODULE_DIR/${SLUG}-media.module.json"

echo "1/5 Cloning retail starter..."
cp -R "$SOURCE_DIR" "$TARGET_DIR"

echo "2/5 Updating cloned package prepare hook..."
TARGET_PACKAGE_JSON="$TARGET_DIR/package.json"
if [[ -f "$TARGET_PACKAGE_JSON" ]]; then
  node - "$TARGET_PACKAGE_JSON" "$SLUG" <<'NODE'
const fs = require('fs');
const path = process.argv[2];
const slug = process.argv[3];
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
if (pkg.scripts && typeof pkg.scripts.prepare === 'string') {
  pkg.scripts.prepare = pkg.scripts.prepare.replace(
    'industry-verticals/retail/.husky',
    `industry-verticals/${slug}/.husky`
  );
}
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
NODE
fi

echo "3/5 Creating serialization module files..."
mkdir -p "$TARGET_MODULE_DIR"

cat >"$CONTENT_MODULE_FILE" <<EOF
{
  "\$schema": "../.sitecore/schemas/ModuleFile.schema.json",
  "namespace": "$CONTENT_NAMESPACE",
  "references": ["Project.IndustryVerticals"],
  "items": {
    "includes": [
      {
        "name": "${SLUG}-home",
        "path": "/sitecore/content/industry-verticals/$SLUG/home",
        "scope": "DescendantsOnly",
        "allowedPushOperations": "CreateAndUpdate"
      },
      {
        "name": "${SLUG}-content-media",
        "path": "/sitecore/content/industry-verticals/$SLUG/Media",
        "scope": "DescendantsOnly",
        "allowedPushOperations": "CreateAndUpdate"
      },
      {
        "name": "${SLUG}-data",
        "path": "/sitecore/content/industry-verticals/$SLUG/Data",
        "scope": "DescendantsOnly",
        "allowedPushOperations": "CreateAndUpdate"
      },
      {
        "name": "${SLUG}-dictionary",
        "path": "/sitecore/content/industry-verticals/$SLUG/Dictionary",
        "scope": "DescendantsOnly",
        "allowedPushOperations": "CreateAndUpdate"
      },
      {
        "name": "${SLUG}-presentation",
        "path": "/sitecore/content/industry-verticals/$SLUG/Presentation",
        "scope": "DescendantsOnly",
        "allowedPushOperations": "CreateAndUpdate"
      }
    ]
  }
}
EOF

cat >"$MEDIA_MODULE_FILE" <<EOF
{
  "\$schema": "../.sitecore/schemas/ModuleFile.schema.json",
  "namespace": "$MEDIA_NAMESPACE",
  "references": ["Project.IndustryVerticals"],
  "items": {
    "includes": [
      {
        "name": "${SLUG}-media",
        "path": "/sitecore/Media Library/Project/industry-verticals/$SLUG",
        "scope": "DescendantsOnly",
        "allowedPushOperations": "CreateUpdateAndDelete"
      }
    ]
  }
}
EOF

echo "4/5 Updating xmcloud.build.json and build.json..."
node - "$XM_BUILD_FILE" "$SLUG" "$CONTENT_NAMESPACE" "$MEDIA_NAMESPACE" <<'NODE'
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
const slug = process.argv[3];
const contentNamespace = process.argv[4];
const mediaNamespace = process.argv[5];

const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

if (!json.renderingHosts) {
  throw new Error('renderingHosts section is missing in xmcloud.build.json');
}

if (!json.renderingHosts[slug]) {
  const templateHost = json.renderingHosts.retail || json.renderingHosts.nextjsstarter;
  if (!templateHost) {
    throw new Error('Could not find rendering host template ("retail" or "nextjsstarter").');
  }

  json.renderingHosts[slug] = {
    ...templateHost,
    path: `./industry-verticals/${slug}`,
  };
}

const modules =
  json?.postActions?.actions?.scsModules?.modules;
if (!Array.isArray(modules)) {
  throw new Error('postActions.actions.scsModules.modules is missing or invalid.');
}

if (!modules.includes(mediaNamespace)) {
  modules.push(mediaNamespace);
}
if (!modules.includes(contentNamespace)) {
  modules.push(contentNamespace);
}

const serialized = JSON.stringify(json, null, 2) + '\n';
fs.writeFileSync(filePath, serialized);
fs.writeFileSync(path.join(path.dirname(filePath), 'build.json'), serialized);
NODE

echo "5/5 Done."
echo ""
echo "Created vertical: $SLUG"
echo " - app folder:       industry-verticals/$SLUG"
echo " - content module:   authoring/items/industry-verticals/sites/$SLUG/${SLUG}-content.module.json"
echo " - media module:     authoring/items/industry-verticals/sites/$SLUG/${SLUG}-media.module.json"
echo " - rendering host:   xmcloud.build.json + build.json -> renderingHosts.$SLUG"
echo ""
echo "Next:"
echo "  1) Set $SLUG env vars (.env.local and XM Cloud host envs)"
echo "  2) Deploy and create/clone Sitecore site item tree"
echo "  3) Verify page design + header partial design + nav datasource wiring"
