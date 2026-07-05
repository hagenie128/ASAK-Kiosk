#!/usr/bin/env python3
"""Save final 13 missing notion-fetch results (run once)."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from fetch_progress import progress, save_one

BATCH = Path(__file__).parent / "fetch_batches" / "final13.json"


def main():
    if not BATCH.exists():
        print(f"Missing {BATCH}", file=sys.stderr)
        sys.exit(1)
    items = json.loads(BATCH.read_text(encoding="utf-8"))
    for item in items:
        save_one(item)
    done, total = progress()
    print(f"fetched {done}/{total}")


if __name__ == "__main__":
    main()
