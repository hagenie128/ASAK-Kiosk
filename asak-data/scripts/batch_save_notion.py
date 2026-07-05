#!/usr/bin/env python3
"""Save notion-fetch MCP results to notion_raw/{page_id}.json"""
import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def save(page_id: str, payload: dict) -> None:
    out = {"title": payload.get("title", ""), "url": payload.get("url", ""), "text": payload.get("text", "")}
    (RAW / f"{page_id}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")


def main():
    # Usage: batch_save_notion.py <page_id> <json_path> [<page_id> <json_path> ...]
    args = sys.argv[1:]
    if len(args) % 2 != 0:
        print("Usage: batch_save_notion.py <page_id> <json_path> ...", file=sys.stderr)
        sys.exit(1)
    for i in range(0, len(args), 2):
        pid, path = args[i], Path(args[i + 1])
        data = json.loads(path.read_text(encoding="utf-8"))
        save(pid, data)
        print(f"saved {pid}")


if __name__ == "__main__":
    main()
