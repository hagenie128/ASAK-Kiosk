#!/usr/bin/env python3
"""List all page IDs to fetch and report progress. MCP fetch done externally."""
from __future__ import annotations

import json
from pathlib import Path

IDS = Path(__file__).parent / "notion_page_ids.json"
RAW = Path(__file__).parent / "notion_raw"


def all_ids() -> list[str]:
    data = json.loads(IDS.read_text(encoding="utf-8"))
    seen: set[str] = set()
    out: list[str] = []
    for key in ("requirements", "wbs", "apis", "scenarios"):
        for pid in data.get(key, []):
            if pid not in seen:
                seen.add(pid)
                out.append(pid)
    return out


def main():
    RAW.mkdir(exist_ok=True)
    ids = all_ids()
    existing = {f.stem for f in RAW.glob("*.json")}
    missing = [i for i in ids if i not in existing]
    print(f"total={len(ids)} existing={len(existing)} missing={len(missing)}")
    if missing:
        print("MISSING:")
        for pid in missing:
            print(pid)


if __name__ == "__main__":
    main()
