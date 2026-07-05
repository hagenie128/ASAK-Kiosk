#!/usr/bin/env python3
"""Fetch all Notion pages via sequential MCP-like saves from batch files in fetch_batches/."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from fetch_progress import all_ids, progress, save_one

BATCH_DIR = Path(__file__).parent / "fetch_batches"
RAW = Path(__file__).parent / "notion_raw"


def apply_batch_file(path: Path) -> int:
    batch = json.loads(path.read_text(encoding="utf-8"))
    items = batch if isinstance(batch, list) else batch.get("fetches", [])
    if isinstance(batch, dict) and not items:
        items = list(batch.values())
    n = 0
    for item in items:
        save_one(item)
        n += 1
    return n


def main():
    BATCH_DIR.mkdir(exist_ok=True)
    if len(sys.argv) > 1 and sys.argv[1] == "apply-all":
        total_saved = 0
        for f in sorted(BATCH_DIR.glob("*.json")):
            total_saved += apply_batch_file(f)
            done, total = progress()
            print(f"applied {f.name}: fetched {done}/{total}")
        return
    if len(sys.argv) > 1:
        n = apply_batch_file(Path(sys.argv[1]))
        done, total = progress()
        print(f"saved {n} from {sys.argv[1]}: fetched {done}/{total}")
        return
    done, total = progress()
    print(f"fetched {done}/{total}")


if __name__ == "__main__":
    main()
