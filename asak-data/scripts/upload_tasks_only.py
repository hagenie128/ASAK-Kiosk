#!/usr/bin/env python3
"""Upload tasks only (after requirements/tables/apis done)."""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from devcopilot_upload import upload_tasks

data = json.loads(Path(__file__).parent.joinpath("notion_data.json").read_text(encoding="utf-8"))
upload_tasks(data)
