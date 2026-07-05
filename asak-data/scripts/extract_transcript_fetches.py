#!/usr/bin/env python3
"""Extract notion-fetch MCP results from agent transcript JSONL into notion_raw/."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def try_parse_fetch(s: str) -> dict | None:
    s = s.strip()
    if not s.startswith("{"):
        return None
    try:
        d = json.loads(s)
    except json.JSONDecodeError:
        return None
    if isinstance(d, dict) and "url" in d and "text" in d and "title" in d:
        if "app.notion.com/p/" in d.get("url", ""):
            return d
    return None


def save(d: dict) -> str:
    pid = d["url"].rstrip("/").split("/")[-1].split("?")[0]
    out = {"title": d["title"], "url": d["url"], "text": d["text"]}
    (RAW / f"{pid}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    return pid


def extract_from_line(line: str) -> list[dict]:
    found: list[dict] = []
    # Direct JSON object in tool result
    d = try_parse_fetch(line)
    if d:
        found.append(d)
        return found
    # Embedded in JSONL message
    try:
        obj = json.loads(line)
    except json.JSONDecodeError:
        return found
    text = json.dumps(obj, ensure_ascii=False)
    # Find fetch-like JSON blobs with url+text+title
    for m in re.finditer(
        r'\{"metadata":\{"type":"page"\},"title":.*?"text":".*?"\}',
        text,
        re.DOTALL,
    ):
        d2 = try_parse_fetch(m.group(0))
        if d2:
            found.append(d2)
    return found


def main():
    paths = sys.argv[1:] or [
        str(
            Path.home()
            / ".cursor/projects/c-greens/agent-transcripts/cb3c9d00-7066-4ba2-b69f-7a5b6604501a/cb3c9d00-7066-4ba2-b69f-7a5b6604501a.jsonl"
        )
    ]
    saved: set[str] = set()
    for p in paths:
        path = Path(p)
        if not path.exists():
            print(f"skip missing {path}")
            continue
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            for d in extract_from_line(line):
                pid = save(d)
                if pid not in saved:
                    saved.add(pid)
                    print(f"saved {pid}")
    print(f"total unique: {len(saved)}")


if __name__ == "__main__":
    main()
