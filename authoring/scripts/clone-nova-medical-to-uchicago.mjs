/**
 * One-shot: duplicate Nova Medical (healthcare) serialized content for the UChicago site.
 * - Remaps every item ID so UChicago is an independent site tree in CM.
 * - Rewrites content + media paths to industry-verticals/uchicago.
 * - Rewrites Site Grouping (SiteName, RenderingHost) for the uchicago rendering host.
 *
 * Run from repo root: node authoring/scripts/clone-nova-medical-to-uchicago.mjs
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTHORING = path.resolve(__dirname, '..');
const ITEMS = path.join(AUTHORING, 'items', 'industry-verticals');

const SOURCE_TREES = [
  {
    src: path.join(ITEMS, 'sites', 'nova-medical', 'items'),
    dest: path.join(ITEMS, 'sites', 'uchicago', 'items'),
    relBase: null,
  },
  {
    src: path.join(ITEMS, 'common', 'items', 'sites-nova-medical'),
    dest: path.join(ITEMS, 'common', 'items', 'sites-uchicago'),
    relBase: null,
  },
];

function walkYamlFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkYamlFiles(p, acc);
    else if (name.endsWith('.yml')) acc.push(p);
  }
  return acc;
}

function collectIds(files) {
  const ids = new Set();
  const idLine = /^ID:\s*"([0-9a-fA-F-]+)"/m;
  for (const f of files) {
    const m = fs.readFileSync(f, 'utf8').match(idLine);
    if (m) ids.add(m[1].toLowerCase());
  }
  return ids;
}

function buildIdMap(ids) {
  const map = new Map();
  for (const id of ids) {
    map.set(id, crypto.randomUUID());
  }
  return map;
}

function remapGuids(text, idMap) {
  let out = text;
  const entries = [...idMap.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [oldLc, newId] of entries) {
    const dashed = new RegExp(oldLc.replace(/-/g, '\\-'), 'gi');
    out = out.replace(dashed, newId);
    const compactOld = oldLc.replace(/-/g, '');
    if (compactOld.length === 32) {
      out = out.replace(new RegExp(compactOld, 'gi'), newId.replace(/-/g, ''));
    }
  }
  return out;
}

function rewritePathsAndSiteHints(text) {
  let out = text;
  const subs = [
    ['/sitecore/content/industry-verticals/nova-medical', '/sitecore/content/industry-verticals/uchicago'],
    ['/sitecore/media library/Project/industry-verticals/nova-medical', '/sitecore/media library/Project/industry-verticals/uchicago'],
    ['/sitecore/Media Library/Project/industry-verticals/nova-medical', '/sitecore/Media Library/Project/industry-verticals/uchicago'],
  ];
  for (const [a, b] of subs) {
    out = out.split(a).join(b);
  }
  out = out.replace(/Site Grouping\/nova-medical(\n)/g, 'Site Grouping/uchicago$1');
  out = out.replace('Path: "/sitecore/content/industry-verticals/uchicago/Settings/Site Grouping/nova-medical"', 'Path: "/sitecore/content/industry-verticals/uchicago/Settings/Site Grouping/uchicago"');
  out = out.replace(/Sitemaps\/nova-medical/g, 'Sitemaps/uchicago');
  // Point site + media items at serialized uchicago media library root (common/projectMediaFolders)
  out = out.replace(/\{B9FA3219-4E07-4D36-83C2-E7ECFD96FA9D\}/gi, '{F4F96E18-A352-4FF2-A4F4-36CE3BA27B84}');
  out = out.replace(/b9fa3219-4e07-4d36-83c2-e7ecfd96fa9d/gi, 'f4f96e18-a352-4ff2-a4f4-36ce3ba27b84');
  out = out.replace(/(Hint: SiteName\n  Value: )"nova-medical"/g, '$1"uchicago"');
  out = out.replace(/(Hint: RenderingHost\n  Value: )healthcare(\n)/g, '$1uchicago$2');
  out = out.replace(/(Hint: FilesystemPath\n  Value: )\/dist\/healthcare(\n)/g, '$1/dist/uchicago$2');
  out = out.replace(/(Hint: POS\n  Value: )en=healthcare_1(\n)/g, '$1en=uchicago_1$2');
  out = out.replace(/(Hint: Name\n  Value: )healthcare(\n)/g, '$1uchicago$2');
  out = out.replace(/(Hint: Name\n  Value: )Nova Medical(\n)/g, '$1UChicago$2');
  out = out.replace(/(Hint: Name\n  Value: )Healthcare(\n)/g, '$1UChicago$2');
  return out;
}

function ensureCleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  for (const tree of SOURCE_TREES) {
    ensureCleanDir(tree.dest);
  }

  const allFiles = [];
  for (const tree of SOURCE_TREES) {
    walkYamlFiles(tree.src, allFiles);
  }
  if (allFiles.length === 0) {
    console.error('No source YAML found. Expected nova-medical items + sites-nova-medical.');
    process.exit(1);
  }

  const idMap = buildIdMap(collectIds(allFiles));
  console.log(`Remapping ${idMap.size} item IDs…`);

  for (const tree of SOURCE_TREES) {
    const files = walkYamlFiles(tree.src);
    for (const srcFile of files) {
      const rel = path.relative(tree.src, srcFile);
      let destRel = rel;
      if (tree.src.includes('sites-nova-medical')) {
        if (rel === 'nova-medical.yml') {
          destRel = 'uchicago.yml';
        } else {
          destRel = rel.replace(/^nova-medical(\/|$)/, 'uchicago$1');
          destRel = destRel.replace(/Site Grouping\/nova-medical\.yml$/, 'Site Grouping/uchicago.yml');
        }
      }
      const destFile = path.join(tree.dest, destRel);
      fs.mkdirSync(path.dirname(destFile), { recursive: true });
      const raw = fs.readFileSync(srcFile, 'utf8');
      let next = rewritePathsAndSiteHints(raw);
      next = remapGuids(next, idMap);
      fs.writeFileSync(destFile, next, 'utf8');
    }
    console.log(`Wrote ${files.length} files → ${tree.dest}`);
  }

  console.log('Done. Add sites-uchicago rules to common.module.json if not present, then deploy.');
}

main();
