#!/usr/bin/env python3
"""Save JSONL lines of notion-fetch MCP results."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from fetch_progress import progress, save_one


def main():
    path = Path(sys.argv[1])
    n = 0
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        save_one(json.loads(line))
        n += 1
    done, total = progress()
    print(f"saved {n} lines: fetched {done}/{total}")


if __name__ == "__main__":
    main()
