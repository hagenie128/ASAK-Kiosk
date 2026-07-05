#!/usr/bin/env python3
"""Fetch all Notion pages via MCP results file and save to notion_raw/."""
from __future__ import annotations

import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
IDS_FILE = Path(__file__).parent / "notion_page_ids.json"
EXTRA_REQS = [
    "c2a51ef04f0b822ea24f817f741f2c20",
    "aa551ef04f0b8204a9ef0112c1fef4cc",
    "3de51ef04f0b8291ae3c81b46f2afebe",
    "39151ef04f0b81dc9b7ae0a6c3f9df3f",
    "39151ef04f0b810f8628d3ed1363a8b5",
    "39151ef04f0b8124a71bfda33c8245a0",
    "39151ef04f0b819782c1e4a464e67d7c",
    "39151ef04f0b8106b467db46fb56902a",
    "4e051ef04f0b83e19daf01c73117bd67",
    "39151ef04f0b81cbaa9dca0455297507",
    "39151ef04f0b8110a525cf81ff1bc71c",
    "39151ef04f0b81e0bdbff92f1af5098d",
    "39151ef04f0b818e9eb5d9333534e7bd",
]


def all_ids() -> list[str]:
    data = json.loads(IDS_FILE.read_text(encoding="utf-8"))
    ids: list[str] = []
    for cat in ("requirements", "wbs", "apis", "scenarios"):
        ids.extend(data.get(cat, []))
    ids.extend(EXTRA_REQS)
    return list(dict.fromkeys(ids))


def save_payload(page_id: str, payload: dict) -> bool:
    RAW.mkdir(exist_ok=True)
    out_path = RAW / f"{page_id}.json"
    if out_path.exists() and out_path.stat().st_size > 200:
        return False
    out = {"title": payload.get("title", ""), "url": payload.get("url", ""), "text": payload.get("text", "")}
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf8")
    return True


def main():
    if len(sys.argv) < 2:
        missing = [i for i in all_ids() if not (RAW / f"{i}.json").exists()]
        print(json.dumps(missing))
        return
    results_path = Path(sys.argv[1])
    batch = json.loads(results_path.read_text(encoding="utf-8"))
    saved = 0
    for pid, payload in batch.items():
        if save_payload(pid, payload):
            saved += 1
            print(f"saved {pid}")
        else:
            print(f"skip {pid}")
    print(f"batch_saved={saved}")


if __name__ == "__main__":
    main()
