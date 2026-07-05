#!/usr/bin/env python3
"""Save Notion page fetch results into notion_raw/ for build_notion_data.py."""
from __future__ import annotations

import json
import sys
from pathlib import Path

RAW_DIR = Path(__file__).parent / "notion_raw"
IDS_FILE = Path(__file__).parent / "notion_page_ids.json"


def save_fetch(page_id: str, payload: dict) -> None:
    RAW_DIR.mkdir(exist_ok=True)
    out = RAW_DIR / f"{page_id}.json"
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def main():
    if len(sys.argv) < 2:
        print("Usage: fetch_notion_pages.py <page_id> <json_file> ...")
        print("  or: fetch_notion_pages.py --all-wbs")
        sys.exit(1)
    if sys.argv[1] == "--all-wbs":
        ids = json.loads(IDS_FILE.read_text(encoding="utf-8"))["wbs"]
        print("\n".join(dict.fromkeys(ids)))
        return
    for arg in sys.argv[1:]:
        p = Path(arg)
        data = json.loads(p.read_text(encoding="utf-8"))
        pid = p.stem
        save_fetch(pid, data)
        print(f"saved {pid}")
