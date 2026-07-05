#!/usr/bin/env python3
"""Save embedded MCP fetch pages to notion_raw/."""
import json
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def save_page(page_id: str, title: str, url: str, text: str) -> None:
    out = RAW / f"{page_id}.json"
    if out.exists() and out.stat().st_size > 200:
        print(f"skip {page_id}")
        return
    out.write_text(json.dumps({"title": title, "url": url, "text": text}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"saved {page_id}")


def save_pages(pages: list[tuple[str, str, str, str]]) -> None:
    for page_id, title, url, text in pages:
        save_page(page_id, title, url, text)
