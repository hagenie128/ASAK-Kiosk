#!/usr/bin/env python3
"""Export MCP fetch list to fetch_batches/batch_N.json for apply_fetch_batches.py."""
from __future__ import annotations

import json
import sys
from pathlib import Path

BATCH_DIR = Path(__file__).parent / "fetch_batches"
BATCH_DIR.mkdir(exist_ok=True)


def main():
    src = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    data = json.loads(src.read_text(encoding="utf-8"))
    items = data if isinstance(data, list) else list(data.values())
    dest.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {len(items)} items -> {dest}")


if __name__ == "__main__":
    main()
