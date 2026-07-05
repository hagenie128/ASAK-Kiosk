#!/usr/bin/env python3
"""Save notion-fetch results from a JSON file (array or {fetches:[]}) to notion_raw/."""
from __future__ import annotations

import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
RAW.mkdir(exist_ok=True)


def pid_from_url(url: str) -> str:
    return url.rstrip("/").split("/")[-1].split("?")[0]


def save_one(data: dict) -> str:
    if "code" in data and data.get("code") == "object_not_found":
        return f"SKIP_NOT_FOUND {data.get('body', '')[:80]}"
    url = data.get("url", "")
    if not url:
        return "SKIP_NO_URL"
    pid = pid_from_url(url)
    out = {"title": data.get("title", ""), "url": url, "text": data.get("text", "")}
    (RAW / f"{pid}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    return pid


def main():
    path = Path(sys.argv[1])
    batch = json.loads(path.read_text(encoding="utf-8"))
    items = batch if isinstance(batch, list) else batch.get("fetches", [batch])
    for item in items:
        print(f"saved {save_one(item)}")


if __name__ == "__main__":
    main()
