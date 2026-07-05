#!/usr/bin/env python3
"""Orchestrate: list missing IDs, apply saved batches, report progress."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from apply_agent_batch import main as apply_main
from fetch_progress import all_ids, progress

BATCH_DIR = Path(__file__).parent / "fetch_batches"
RAW = Path(__file__).parent / "notion_raw"


def missing() -> list[str]:
    return [
        i
        for i in all_ids()
        if not (RAW / f"{i}.json").exists() or (RAW / f"{i}.json").stat().st_size <= 200
    ]


def apply_all_batches() -> None:
    BATCH_DIR.mkdir(exist_ok=True)
    for f in sorted(BATCH_DIR.glob("*.json")):
        sys.argv = ["apply_agent_batch.py", str(f)]
        apply_main()


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "missing":
        print(json.dumps(missing()))
        return
    if len(sys.argv) > 1 and sys.argv[1] == "apply":
        apply_all_batches()
        done, total = progress()
        print(f"fetched {done}/{total}")
        return
    done, total = progress()
    print(f"fetched {done}/{total}, missing={len(missing())}")


if __name__ == "__main__":
    main()
