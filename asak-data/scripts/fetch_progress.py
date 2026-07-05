#!/usr/bin/env python3
"""Track and save notion-fetch results."""
from __future__ import annotations

import json
import sys
from pathlib import Path

RAW = Path(__file__).parent / "notion_raw"
IDS_FILE = Path(__file__).parent / "notion_page_ids.json"


def all_ids() -> list[str]:
    data = json.loads(IDS_FILE.read_text(encoding="utf-8"))
    seen: set[str] = set()
    out: list[str] = []
    for key in ("requirements", "wbs", "apis", "scenarios"):
        for pid in data.get(key, []):
            if pid not in seen:
                seen.add(pid)
                out.append(pid)
    return out


def save_one(data: dict) -> str:
    RAW.mkdir(exist_ok=True)
    url = data.get("url", "")
    pid = url.rstrip("/").split("/")[-1].split("?")[0]
    out = {"title": data.get("title", ""), "url": url, "text": data.get("text", "")}
    (RAW / f"{pid}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    return pid


def progress() -> tuple[int, int]:
    total = len(all_ids())
    done = sum(1 for pid in all_ids() if (RAW / f"{pid}.json").exists() and (RAW / f"{pid}.json").stat().st_size > 200)
    return done, total


def main():
    if sys.argv[1] == "missing":
        missing = [i for i in all_ids() if not (RAW / f"{i}.json").exists() or (RAW / f"{i}.json").stat().st_size <= 200]
        print(json.dumps(missing))
    elif sys.argv[1] == "save":
        batch = json.loads(sys.stdin.read())
        items = batch if isinstance(batch, list) else list(batch.values())
        for item in items:
            save_one(item)
        done, total = progress()
        print(f"fetched {done}/{total}")
    elif sys.argv[1] == "status":
        done, total = progress()
        print(f"fetched {done}/{total}")


if __name__ == "__main__":
    main()
