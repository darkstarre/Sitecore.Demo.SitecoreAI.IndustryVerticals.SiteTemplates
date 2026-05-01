#!/usr/bin/env python3
"""One-off: remap GUIDs and paths for Rust-Oleum authoring clone from Forma Lux."""
from __future__ import annotations

import re
import uuid
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
TARGET_DIRS = [
    REPO / "authoring/items/industry-verticals/sites/rustoleum",
    REPO / "authoring/items/industry-verticals/common/items/sites-rustoleum",
    REPO / "authoring/items/industry-verticals/common/items/projectMediaFolders/industry-verticals/rustoleum.yml",
]

ROOT_ID_PATTERN = re.compile(r"^---\s*\r?\nID:\s*\"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\"", re.MULTILINE)
GUID_RE = re.compile(
    r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
)


def compact_guid(g: str) -> str:
    return g.replace("-", "").lower()


def collect_root_ids(paths: list[Path]) -> dict[str, str]:
    ids: set[str] = set()
    for p in paths:
        if p.is_file() and p.suffix.lower() in (".yml", ".yaml"):
            text = p.read_text(encoding="utf-8-sig")
            m = ROOT_ID_PATTERN.match(text)
            if m:
                ids.add(m.group(1).lower())
    return {i: str(uuid.uuid4()).lower() for i in ids}


def replace_guids(text: str, guid_map: dict[str, str]) -> str:
    lower_map = {k.lower(): v.lower() for k, v in guid_map.items()}

    def dash_repl(m: re.Match[str]) -> str:
        key = m.group(0).lower()
        return lower_map.get(key, m.group(0))

    text = GUID_RE.sub(dash_repl, text)
    for old, new in guid_map.items():
        ou, ol = "{" + old.upper() + "}", "{" + new.upper() + "}"
        if ou in text:
            text = text.replace(ou, ol)
        oll = "{" + old.lower() + "}"
        nll = "{" + new.lower() + "}"
        if oll in text:
            text = text.replace(oll, nll)
        co, cn = compact_guid(old), compact_guid(new)
        if co != cn and co in text:
            text = text.replace(co, cn)
        cou = co.upper()
        cnu = cn.upper()
        if cou != cnu and cou in text:
            text = text.replace(cou, cnu)
    return text


def path_and_brand_replace(text: str) -> str:
    repl = [
        ("/sitecore/content/industry-verticals/forma-lux", "/sitecore/content/industry-verticals/rustoleum"),
        ("/sitecore/media library/Project/industry-verticals/forma-lux", "/sitecore/media library/Project/industry-verticals/rustoleum"),
        ("en=forma-lux", "en=rustoleum"),
        ('Value: "forma-lux"', 'Value: "rustoleum"'),
        ("Value: forma-lux", "Value: rustoleum"),
        ("Forma Lux", "Rust-Oleum"),
        ("forma-lux", "rustoleum"),
    ]
    for a, b in repl:
        text = text.replace(a, b)
    return text


def patch_site_grouping_rendering_host(text: str) -> str:
    """Ensure RenderingHost matches xmcloud host key after generic nextjsstarter replace."""
    text = re.sub(
        r'(Hint: RenderingHost\s*\n\s*Value:\s*)[^\n]+',
        r"\1rustoleum",
        text,
    )
    return text


def main() -> None:
    yml_files: list[Path] = []
    for d in TARGET_DIRS:
        if d.is_file():
            yml_files.append(d)
        elif d.is_dir():
            yml_files.extend(sorted(d.rglob("*.yml")))
            yml_files.extend(sorted(d.rglob("*.yaml")))

    guid_map = collect_root_ids(yml_files)
    print(f"Remapping {len(guid_map)} item root IDs")

    for p in yml_files:
        raw = p.read_text(encoding="utf-8-sig")
        raw = path_and_brand_replace(raw)
        if "Site Grouping" in str(p) and p.name == "rustoleum.yml":
            raw = patch_site_grouping_rendering_host(raw)
        raw = replace_guids(raw, guid_map)
        p.write_text(raw, encoding="utf-8")

    print("Done.")


if __name__ == "__main__":
    main()
