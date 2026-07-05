#!/usr/bin/env python3
"""Save one MCP fetch result from JSON file path."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from fetch_progress import progress, save_one

data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
save_one(data)
done, total = progress()
print(f"saved {Path(sys.argv[1]).stem}: fetched {done}/{total}")
