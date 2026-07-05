#!/usr/bin/env python3
"""Save MCP notion-fetch JSON lines to notion_raw/{page_id}.json"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"


def page_id_from_fetch(data: dict) -> str:
    url = data.get("url", "")
    m = re.search(r"/p/([a-f0-9]+)", url)
    if m:
        return m.group(1)
    meta = data.get("metadata", {})
    if "id" in data:
        return data["id"]
    raise ValueError(f"cannot extract page id from {url!r}")


def main():
    RAW.mkdir(exist_ok=True)
    if len(sys.argv) < 2:
        print("Usage: save_mcp_batch.py <batch.json>")
        sys.exit(1)
    batch = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    if isinstance(batch, dict) and "fetches" in batch:
        items = batch["fetches"]
    elif isinstance(batch, list):
        items = batch
    else:
        items = [batch]
    for data in items:
        pid = page_id_from_fetch(data)
        (RAW / f"{pid}.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"saved {pid}")


if __name__ == "__main__":
    main()
