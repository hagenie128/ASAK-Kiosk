#!/usr/bin/env python3
"""Save notion-fetch MCP results from stdin JSON array to notion_raw/."""
from __future__ import annotations

import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def save_one(data: dict) -> str:
    url = data.get("url", "")
    pid = url.rstrip("/").split("/")[-1] if url else data.get("id", "unknown")
    out = {
        "title": data.get("title", ""),
        "url": url,
        "text": data.get("text", ""),
    }
    (RAW / f"{pid}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    return pid


def main():
    raw = sys.stdin.read()
    payload = json.loads(raw)
    items = payload if isinstance(payload, list) else payload.get("fetches", [payload])
    for item in items:
        print(f"saved {save_one(item)}")


if __name__ == "__main__":
    main()
