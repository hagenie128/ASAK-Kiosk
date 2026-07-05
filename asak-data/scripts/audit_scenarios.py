#!/usr/bin/env python3
import json
import re
from pathlib import Path

ids = json.loads(Path("notion_page_ids.json").read_text(encoding="utf-8"))["scenarios"]
raw = Path("notion_raw")
for pid in ids:
    f = raw / f"{pid}.json"
    if not f.exists():
        print("MISSING", pid)
        continue
    d = json.loads(f.read_text(encoding="utf-8"))
    t = d.get("text", "")
    m = re.search(r'"시나리오 ID"\s*:\s*"(SC-\d+)"', t)
    sc = m.group(1) if m else "?"
    full = "Here is the result" in t
    mmd = "```mermaid" in t
    print(f"{pid} SC={sc} full={full} mermaid={mmd} len={len(t)} title={d.get('title', '')[:40]}")
