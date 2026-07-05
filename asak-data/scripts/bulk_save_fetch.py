#!/usr/bin/env python3
"""Bulk-save notion-fetch batch results into notion_raw/."""
import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def main():
    batch_path = Path(sys.argv[1])
    batch = json.loads(batch_path.read_text(encoding="utf-8"))
    for pid, data in batch.items():
        out_path = RAW / f"{pid}.json"
        if out_path.exists():
            print(f"skip {pid}")
            continue
        out = {"title": data.get("title", ""), "url": data.get("url", ""), "text": data.get("text", "")}
        out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"saved {pid}")


if __name__ == "__main__":
    main()
