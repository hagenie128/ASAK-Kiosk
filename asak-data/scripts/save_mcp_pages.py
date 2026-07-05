#!/usr/bin/env python3
"""Save notion-fetch MCP results from JSON file to notion_raw/."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from fetch_progress import save_one

def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("mcp_batch.json")
    data = json.loads(path.read_text(encoding="utf-8"))
    items = data if isinstance(data, list) else list(data.values())
    for item in items:
        save_one(item)
    print(f"saved {len(items)} pages")

if __name__ == "__main__":
    main()
