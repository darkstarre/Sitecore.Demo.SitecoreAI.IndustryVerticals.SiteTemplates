#!/usr/bin/env python3
"""
One-off: remap GUIDs in cloned nova-medical → ucm authoring trees so items do not
collide with nova-medical in the same CM database.
"""
from __future__ import annotations

import re
import sys
import uuid
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

UCM_SITE = REPO / "authoring/items/industry-verticals/sites/ucm"
UCM_COMMON = REPO / "authoring/items/industry-verticals/common/items/sites-ucm"
UCM_MEDIA_STUB = (
    REPO
    / "authoring/items/industry-verticals/common/items/projectMediaFolders/industry-verticals/ucm.yml"
)

GUID_RE = re.compile(
    r'^ID:\s*"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})"',
    re.MULTILINE,
)


def collect_yml_files() -> list[Path]:
    files: list[Path] = []
    for root in (UCM_SITE, UCM_COMMON):
        files.extend(sorted(root.rglob("*.yml")))
    if UCM_MEDIA_STUB.is_file():
        files.append(UCM_MEDIA_STUB)
    return files


def build_id_mapping(files: list[Path]) -> dict[str, str]:
    old_ids: list[str] = []
    for f in files:
        m = GUID_RE.search(f.read_text(encoding="utf-8"))
        if m:
            old_ids.append(m.group(1).lower())
    return {old: str(uuid.uuid4()).lower() for old in old_ids}


def replace_guid_in_text(text: str, old: str, new: str) -> str:
    ol, nl = old.lower(), new.lower()
    ou, nu = old.upper(), new.upper()
    text = text.replace("{" + ou + "}", "{" + nu + "}")
    text = text.replace("{" + ol + "}", "{" + nl + "}")
    text = text.replace(ol, nl)
    text = text.replace(ou, nu)
    text = text.replace(ol.replace("-", ""), nl.replace("-", ""))
    text = text.replace(ou.replace("-", ""), nu.replace("-", ""))
    return text


def remap_all_guids(text: str, mapping: dict[str, str]) -> str:
    for old, new in mapping.items():
        text = replace_guid_in_text(text, old, new)
    return text


def replace_paths(text: str) -> str:
    text = text.replace(
        "/sitecore/content/industry-verticals/nova-medical",
        "/sitecore/content/industry-verticals/ucm",
    )
    text = text.replace(
        "/sitecore/media library/Project/industry-verticals/nova-medical",
        "/sitecore/media library/Project/industry-verticals/ucm",
    )
    text = text.replace(
        "/sitecore/Media Library/Project/industry-verticals/nova-medical",
        "/sitecore/Media Library/Project/industry-verticals/ucm",
    )
    return text


def patch_site_grouping(text: str) -> str:
    text = re.sub(
        r'(Hint: SiteName\s*\n\s*Value:\s*)["\']?nova-medical["\']?',
        r'\1"ucm"',
        text,
    )
    text = re.sub(
        r"(Hint: RenderingHost\s*\n\s*Value:\s*)healthcare",
        r"\1ucm",
        text,
    )
    text = re.sub(
        r"(Hint: POS\s*\n\s*Value:\s*)en=healthcare_1",
        r"\1en=ucm_1",
        text,
    )
    return text


def main() -> int:
    files = collect_yml_files()
    if not files:
        print("No YAML files found under UCM authoring paths.", file=sys.stderr)
        return 1
    mapping = build_id_mapping(files)
    for f in files:
        raw = f.read_text(encoding="utf-8")
        raw = remap_all_guids(raw, mapping)
        raw = replace_paths(raw)
        if "Site Grouping" in str(f) and f.name.endswith(".yml"):
            raw = patch_site_grouping(raw)
        f.write_text(raw, encoding="utf-8")
    print(f"Remapped {len(mapping)} item IDs in {len(files)} files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
