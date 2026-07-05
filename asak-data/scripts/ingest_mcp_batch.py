#!/usr/bin/env python3
"""Write MCP fetch batch JSONL from embedded page list; then save to notion_raw."""
import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
STAGING = Path(__file__).parent / "fetch_staging"
STAGING.mkdir(exist_ok=True)
RAW.mkdir(exist_ok=True)


def save_pages(pages: list[dict]) -> int:
    n = 0
    for d in pages:
        url = d.get("url", "")
        if not url:
            continue
        pid = url.rstrip("/").split("/")[-1].split("?")[0]
        out_path = RAW / f"{pid}.json"
        if out_path.exists() and out_path.stat().st_size > 200:
            continue
        out = {"title": d.get("title", ""), "url": url, "text": d.get("text", "")}
        out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"saved {pid}")
        n += 1
    return n


def append_jsonl(pages: list[dict], name: str) -> None:
    p = STAGING / name
    with p.open("a", encoding="utf-8") as f:
        for d in pages:
            f.write(json.dumps(d, ensure_ascii=False) + "\n")


def main():
    if len(sys.argv) < 2:
        print("Usage: ingest_mcp_batch.py <batch.json>")
        sys.exit(1)
    batch = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    items = batch if isinstance(batch, list) else list(batch.values())
    append_jsonl(items, "all.jsonl")
    print(f"ingested {save_pages(items)} new pages")


if __name__ == "__main__":
    main()
