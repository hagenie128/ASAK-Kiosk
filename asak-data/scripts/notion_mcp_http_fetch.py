#!/usr/bin/env python3
"""Fetch Notion pages via MCP HTTP and save to notion_raw/."""
from __future__ import annotations

import json
import re
import sys
import time
import uuid
from pathlib import Path

import requests

from fetch_progress import all_ids, progress, save_one

MCP_URL = "https://mcp.notion.com/mcp"
RAW = Path(__file__).parent / "notion_raw"


def mcp_call(session: requests.Session, tool: str, arguments: dict) -> dict:
    payload = {
        "jsonrpc": "2.0",
        "id": str(uuid.uuid4()),
        "method": "tools/call",
        "params": {"name": tool, "arguments": arguments},
    }
    r = session.post(MCP_URL, json=payload, timeout=120)
    r.raise_for_status()
    data = r.json()
    if "error" in data:
        raise RuntimeError(data["error"])
    result = data.get("result", {})
    content = result.get("content", [])
    if not content:
        return result
    text = content[0].get("text", "")
    if text.startswith("{"):
        return json.loads(text)
    return {"text": text}


def missing_ids() -> list[str]:
    return [
        i
        for i in all_ids()
        if not (RAW / f"{i}.json").exists() or (RAW / f"{i}.json").stat().st_size <= 200
    ]


def main():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json", "Accept": "application/json"})
    ids = missing_ids()
    total = len(all_ids())
    print(f"to_fetch={len(ids)} total={total}")
    for n, pid in enumerate(ids, 1):
        try:
            data = mcp_call(session, "notion-fetch", {"id": pid})
            save_one(data)
        except Exception as e:
            print(f"ERROR {pid}: {e}", file=sys.stderr)
            sys.exit(1)
        if n % 10 == 0 or n == len(ids):
            done, tot = progress()
            print(f"fetched {done}/{tot}")
        time.sleep(0.2)
    done, tot = progress()
    print(f"DONE fetched {done}/{tot}")


if __name__ == "__main__":
    main()
