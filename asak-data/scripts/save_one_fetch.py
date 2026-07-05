#!/usr/bin/env python3
"""Save a single notion-fetch MCP result from JSON string arg."""
import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def save(page_id: str, payload: dict) -> None:
    out_path = RAW / f"{page_id}.json"
    if out_path.exists() and out_path.stat().st_size > 200:
        print(f"skip {page_id}")
        return
    out = {"title": payload.get("title", ""), "url": payload.get("url", ""), "text": payload.get("text", "")}
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"saved {page_id}")


def main():
    page_id = sys.argv[1]
    payload = json.loads(sys.argv[2])
    save(page_id, payload)


if __name__ == "__main__":
    main()
