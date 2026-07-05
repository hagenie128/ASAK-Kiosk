#!/usr/bin/env python3
"""Fetch missing Notion pages via repeated MCP calls from agent batch files.

Agent writes fetch_batches/batch_NNN.json (array of notion-fetch results),
then runs: python apply_agent_batch.py batch_NNN.json
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from fetch_progress import progress, save_one


def main():
    path = Path(sys.argv[1])
    items = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(items, dict):
        items = items.get("fetches", list(items.values()))
    for item in items:
        save_one(item)
    done, total = progress()
    print(f"fetched {done}/{total}")


if __name__ == "__main__":
    main()
