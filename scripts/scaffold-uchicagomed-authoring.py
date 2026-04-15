#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
import uuid
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

SITE_ROOT = REPO / "authoring/items/industry-verticals/sites/uchicagomed"
COMMON_ROOT = REPO / "authoring/items/industry-verticals/common/items/sites-uchicagomed"
MEDIA_STUB = (
    REPO
    / "authoring/items/industry-verticals/common/items/projectMediaFolders/industry-verticals/uchicagomed.yml"
)

ID_RE = re.compile(
    r'^ID:\s*"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})"',
    re.MULTILINE,
)


def collect_files() -> list[Path]:
    files: list[Path] = []
    for root in (SITE_ROOT, COMMON_ROOT):
        files.extend(sorted(root.rglob("*.yml")))
    if MEDIA_STUB.is_file():
        files.append(MEDIA_STUB)
    return files


def build_mapping(files: list[Path]) -> dict[str, str]:
    mapping: dict[str, str] = {}
    for f in files:
        m = ID_RE.search(f.read_text(encoding="utf-8"))
        if m:
            old = m.group(1).lower()
            mapping[old] = str(uuid.uuid4()).lower()
    return mapping


def replace_guid(text: str, old: str, new: str) -> str:
    ol, nl = old.lower(), new.lower()
    ou, nu = old.upper(), new.upper()
    text = text.replace("{" + ou + "}", "{" + nu + "}")
    text = text.replace("{" + ol + "}", "{" + nl + "}")
    text = text.replace(ol, nl)
    text = text.replace(ou, nu)
    text = text.replace(ol.replace("-", ""), nl.replace("-", ""))
    text = text.replace(ou.replace("-", ""), nu.replace("-", ""))
    return text


def rewrite_paths(text: str) -> str:
    text = text.replace(
        "/sitecore/content/industry-verticals/nova-medical",
        "/sitecore/content/industry-verticals/uchicagomed",
    )
    text = text.replace(
        "/sitecore/media library/Project/industry-verticals/nova-medical",
        "/sitecore/media library/Project/industry-verticals/uchicagomed",
    )
    text = text.replace(
        "/sitecore/Media Library/Project/industry-verticals/nova-medical",
        "/sitecore/Media Library/Project/industry-verticals/uchicagomed",
    )
    text = text.replace("/Sitemaps/nova-medical", "/Sitemaps/uchicagomed")
    return text


def patch_site_grouping(text: str) -> str:
    text = text.replace(
        '/Settings/Site Grouping/nova-medical"',
        '/Settings/Site Grouping/uchicagomed"',
    )
    text = re.sub(
        r'(Hint: SiteName\s*\n\s*Value:\s*)["\']?nova-medical["\']?',
        r'\1"uchicagomed"',
        text,
    )
    text = re.sub(
        r"(Hint: RenderingHost\s*\n\s*Value:\s*)healthcare",
        r"\1uchicagomed",
        text,
    )
    text = re.sub(
        r"(Hint: POS\s*\n\s*Value:\s*)en=healthcare_1",
        r"\1en=uchicagomed_1",
        text,
    )
    text = re.sub(
        r"(Hint: Name\s*\n\s*Value:\s*)Healthcare",
        r"\1UChicagoMed",
        text,
    )
    return text


def main() -> int:
    files = collect_files()
    if not files:
        print("No files found to rewrite.", file=sys.stderr)
        return 1

    mapping = build_mapping(files)
    for f in files:
        text = f.read_text(encoding="utf-8")
        for old, new in mapping.items():
            text = replace_guid(text, old, new)
        text = rewrite_paths(text)
        if "Site Grouping" in str(f):
            text = patch_site_grouping(text)
        f.write_text(text, encoding="utf-8")

    print(f"Rewrote {len(files)} files, remapped {len(mapping)} IDs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
