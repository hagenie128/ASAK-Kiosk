#!/usr/bin/env python3
"""Fetch all Notion pages from notion_page_ids.json and save to notion_raw/."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

IDS_FILE = Path(__file__).parent / "notion_page_ids.json"
RAW_DIR = Path(__file__).parent / "notion_raw"


def all_page_ids() -> list[str]:
    d = json.loads(IDS_FILE.read_text(encoding="utf-8"))
    seen: set[str] = set()
    out: list[str] = []
    for key in ("requirements", "wbs", "apis", "scenarios"):
        for pid in d.get(key, []):
            if pid not in seen:
                seen.add(pid)
                out.append(pid)
    return out


def missing_ids() -> list[str]:
    RAW_DIR.mkdir(exist_ok=True)
    have = {p.stem for p in RAW_DIR.glob("*.json")}
    return [pid for pid in all_page_ids() if pid not in have]


if __name__ == "__main__":
    miss = missing_ids()
    print(f"total={len(all_page_ids())} missing={len(miss)}")
    for pid in miss:
        print(pid)
