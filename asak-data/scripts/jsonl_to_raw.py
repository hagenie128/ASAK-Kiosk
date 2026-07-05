#!/usr/bin/env python3
"""Append notion-fetch MCP results from JSONL stdin to notion_raw/."""
from __future__ import annotations

import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def save(d: dict) -> str:
    url = d.get("url", "")
    pid = url.rstrip("/").split("/")[-1].split("?")[0]
    out = {"title": d.get("title", ""), "url": url, "text": d.get("text", "")}
    (RAW / f"{pid}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    return pid


def main():
    n = 0
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        d = json.loads(line)
        if "url" in d:
            print(f"saved {save(d)}")
            n += 1
    print(f"total saved: {n}")


if __name__ == "__main__":
    main()
