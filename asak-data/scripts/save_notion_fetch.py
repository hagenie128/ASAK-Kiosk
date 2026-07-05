#!/usr/bin/env python3
"""Save one notion-fetch MCP result to notion_raw/{page_id}.json"""
import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)

def main():
    if len(sys.argv) < 2:
        print("Usage: save_notion_fetch.py <page_id> <json_file>")
        sys.exit(1)
    pid = sys.argv[1]
    src = Path(sys.argv[2])
    data = json.loads(src.read_text(encoding="utf-8"))
    out = RAW / f"{pid}.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"saved {out.name}")

if __name__ == "__main__":
    main()
