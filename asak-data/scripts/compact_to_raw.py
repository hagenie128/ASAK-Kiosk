#!/usr/bin/env python3
"""Save compact page props to notion_raw/ as full fetch format."""
from __future__ import annotations

import json
from pathlib import Path

COMPACT = Path(__file__).parent / "compact_pages.json"
RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def main():
    if not COMPACT.exists():
        print("No compact_pages.json")
        return
    pages = json.loads(COMPACT.read_text(encoding="utf-8"))
    for p in pages:
        pid = p["page_id"]
        url = p.get("url") or f"https://app.notion.com/p/{pid}"
        text = (
            f'Here is the result of "view" for the Page with URL {url}.\n'
            f'<page url="{url}">\n<properties>\n'
            f"{json.dumps(p['props'], ensure_ascii=False)}\n"
            f"</properties>\n</page>"
        )
        out = {"title": p.get("title", ""), "url": url, "text": text}
        (RAW / f"{pid}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"saved {pid}")
    print(f"total {len(pages)}")


if __name__ == "__main__":
    main()
