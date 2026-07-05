#!/usr/bin/env python3
"""Decode base64-encoded MCP fetch JSON lines and save to notion_raw/."""
from __future__ import annotations

import base64
import json
import re
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def save(data: dict) -> str:
    url = data.get("url", "")
    pid = url.rstrip("/").split("/")[-1].split("?")[0]
    out_path = RAW / f"{pid}.json"
    if out_path.exists() and out_path.stat().st_size > 200:
        return f"skip {pid}"
    out = {"title": data.get("title", ""), "url": url, "text": data.get("text", "")}
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    return f"saved {pid}"


def main():
    path = Path(sys.argv[1])
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "|" in line:
            _, b64 = line.split("|", 1)
        else:
            b64 = line
        data = json.loads(base64.b64decode(b64))
        print(save(data))


if __name__ == "__main__":
    main()
