#!/usr/bin/env python3
"""Temporary: save MCP fetch batch to notion_raw/."""
import json
import re
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)

def pid(data):
    m = re.search(r"/p/([a-f0-9]+)", data.get("url", ""))
    return m.group(1) if m else None

batch = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
for item in batch:
    p = pid(item)
    out = {"title": item["title"], "url": item["url"], "text": item["text"]}
    (RAW / f"{p}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"saved {len(batch)} files")
