#!/usr/bin/env python3
"""Append one MCP fetch result to staging batch file, then flush to notion_raw."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
STAGING = Path(__file__).parent / "fetch_staging"
STAGING.mkdir(exist_ok=True)
RAW.mkdir(exist_ok=True)


def pid_from(data: dict) -> str:
    m = re.search(r"/p/([a-f0-9]+)", data.get("url", ""))
    if m:
        return m.group(1)
    raise ValueError(f"no page id in {data.get('url')}")


def save_one(data: dict) -> str:
    pid = pid_from(data)
    out_path = RAW / f"{pid}.json"
    if out_path.exists() and out_path.stat().st_size > 200:
        return f"skip {pid}"
    out = {"title": data.get("title", ""), "url": data.get("url", ""), "text": data.get("text", "")}
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    return f"saved {pid}"


def main():
    if len(sys.argv) < 2:
        print("Usage: append_fetch_result.py <mcp_result.json> [<mcp_result.json> ...]")
        sys.exit(1)
    for arg in sys.argv[1:]:
        data = json.loads(Path(arg).read_text(encoding="utf-8"))
        print(save_one(data))


if __name__ == "__main__":
    main()
