#!/usr/bin/env python3
"""Rebuild scenario notion_raw files from scenario_props.json (MCP-extracted)."""
from __future__ import annotations

import json
import re
from pathlib import Path

from fetch_progress import save_one

SCRIPT = Path(__file__).parent
PROPS_FILE = SCRIPT / "scenario_props.json"


def build_text(url: str, props: dict, mermaid: str) -> str:
    base = (
        f'Here is the result of "view" for the Page with URL {url}.\n'
        f'<page url="{url}">\n<properties>\n'
        f"{json.dumps(props, ensure_ascii=False)}\n"
        f"</properties>\n"
    )
    if mermaid:
        base += f"<content>\n```mermaid\n{mermaid}\n```\n</content>\n"
    base += "</page>"
    return base


def main():
    entries = json.loads(PROPS_FILE.read_text(encoding="utf-8"))
    for e in entries:
        url = e["url"]
        text = build_text(url, e["props"], e.get("mermaid", ""))
        save_one({"title": e["title"], "url": url, "text": text})
        sc = e["props"].get("시나리오 ID", "?")
        pid = url.rstrip("/").split("/")[-1]
        print(f"saved {pid} {sc}")


if __name__ == "__main__":
    main()
