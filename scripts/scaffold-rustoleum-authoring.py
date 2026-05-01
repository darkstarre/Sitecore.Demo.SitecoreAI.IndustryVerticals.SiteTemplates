#!/usr/bin/env python3
"""Remap GUIDs and essential-living → rustoleum paths under sites/rustoleum, sites-rustoleum, and rustoleum media stub (same idea as scaffold-uchicagomed-authoring.py)."""
from __future__ import annotations

import re
import sys
import uuid
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

SITE_ROOT = REPO / "authoring/items/industry-verticals/sites/rustoleum"
COMMON_ROOT = REPO / "authoring/items/industry-verticals/common/items/sites-rustoleum"
MEDIA_STUB = (
    REPO
    / "authoring/items/industry-verticals/common/items/projectMediaFolders/industry-verticals/rustoleum.yml"
)

PRIMARY_ID_RE = re.compile(
    r'^ID:\s*"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})"',
    re.MULTILINE,
)
UUID_TOKEN_RE = re.compile(
    r'(\{?)([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(\}?)',
)

PATH_SUBSTITUTIONS: list[tuple[str, str]] = [
    (
        "/sitecore/content/industry-verticals/essential-living",
        "/sitecore/content/industry-verticals/rustoleum",
    ),
    (
        "/sitecore/media library/Project/industry-verticals/essential-living",
        "/sitecore/media library/Project/industry-verticals/rustoleum",
    ),
    (
        "/sitecore/Media Library/Project/industry-verticals/essential-living",
        "/sitecore/Media Library/Project/industry-verticals/rustoleum",
    ),
]


def collect_files() -> list[Path]:
    files: list[Path] = []
    for root in (SITE_ROOT, COMMON_ROOT):
        if root.is_dir():
            files.extend(sorted(root.rglob("*.yml")))
    if MEDIA_STUB.is_file():
        files.append(MEDIA_STUB)
    return sorted(set(files))


def extract_primary_id(raw: str) -> str | None:
    text = raw.lstrip("\ufeff")
    if not text.lstrip().startswith("---"):
        return None
    m = PRIMARY_ID_RE.search(text)
    return m.group(1).lower() if m else None


def build_id_map(files: list[Path]) -> dict[str, uuid.UUID]:
    id_map: dict[str, uuid.UUID] = {}
    for path in files:
        try:
            raw = path.read_text(encoding="utf-8-sig")
        except OSError:
            continue
        pid = extract_primary_id(raw)
        if pid and pid not in id_map:
            id_map[pid] = uuid.uuid4()
    return id_map


def replace_mapped_uuids(text: str, id_map: dict[str, uuid.UUID]) -> str:
    def repl(m: re.Match[str]) -> str:
        open_b, uid_raw, close_b = m.group(1), m.group(2), m.group(3)
        key = uid_raw.lower()
        if key not in id_map:
            return m.group(0)
        new = str(id_map[key])
        if open_b == "{" or close_b == "}":
            return "{" + new + "}"
        return new

    return UUID_TOKEN_RE.sub(repl, text)


def apply_path_and_brand_replacements(text: str, *, is_sites_folder: bool) -> str:
    for old, new in PATH_SUBSTITUTIONS:
        text = text.replace(old, new)
    text = text.replace("en=essential-living", "en=rustoleum")
    text = text.replace('"essential-living"', '"rustoleum"')
    text = text.replace("/dist/essential-living", "/dist/rustoleum")
    text = text.replace("Value: Essential Living", "Value: Rustoleum")
    if is_sites_folder:
        text = text.replace(
            "Hint: RenderingHost\n  Value: retail",
            "Hint: RenderingHost\n  Value: rustoleum",
        )
    return text


def main() -> int:
    files = collect_files()
    if not files:
        print(
            "scaffold-rustoleum-authoring: no YAML under sites/rustoleum, sites-rustoleum, "
            "or rustoleum.yml media stub. Copy authoring from essential-living first "
            "(see module docstring).",
            file=sys.stderr,
        )
        return 1

    id_map = build_id_map(files)
    print(f"scaffold-rustoleum-authoring: remapped {len(id_map)} primary item IDs")

    for path in files:
        raw = path.read_text(encoding="utf-8-sig")
        is_sites = "sites-rustoleum" in path.parts
        updated = replace_mapped_uuids(raw, id_map)
        updated = apply_path_and_brand_replacements(updated, is_sites_folder=is_sites)
        if updated != raw:
            path.write_text(updated, encoding="utf-8", newline="\n")

    print(f"scaffold-rustoleum-authoring: processed {len(files)} files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
