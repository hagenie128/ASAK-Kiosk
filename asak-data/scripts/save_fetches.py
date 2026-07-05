#!/usr/bin/env python3
"""Save notion-fetch MCP dicts to notion_raw/. Usage: python save_fetches.py <file.json>"""
from __future__ import annotations

import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def save_one(d: dict) -> str:
    if d.get("code") == "object_not_found":
        return f"NOT_FOUND"
    url = d.get("url", "")
    if not url:
        return "NO_URL"
    pid = url.rstrip("/").split("/")[-1].split("?")[0]
    out = {"title": d.get("title", ""), "url": url, "text": d.get("text", "")}
    (RAW / f"{pid}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    return pid


def main():
    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    items = data if isinstance(data, list) else [data]
    for i, item in enumerate(items, 1):
        print(f"{i}: saved {save_one(item)}")


if __name__ == "__main__":
    main()
