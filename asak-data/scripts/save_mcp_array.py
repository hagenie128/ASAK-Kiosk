#!/usr/bin/env python3
"""Save notion-fetch MCP response dicts passed as JSON file (array)."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from fetch_progress import progress, save_one

items = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
for item in items:
    save_one(item)
done, total = progress()
print(f"saved {len(items)}: fetched {done}/{total}")
