"""Write notion-update-page payloads for design guide uploads."""
import json
from pathlib import Path

DIR = Path(__file__).resolve().parent / "_notion_upload"
UPDATES = [
    ("39451ef0-4f0b-8110-9d07-c01293d73c6d", "SCR_TABLET_PORTRAIT_FRAMES.md"),
    ("39451ef0-4f0b-814a-9447-f6fbf171b3b7", "BRAND_DESIGN_OPTIONS.md"),
    ("39451ef0-4f0b-81c1-b71a-ccd381097699", "TABLET_PORTRAIT_FIGMA_SETUP.md"),
    ("39451ef0-4f0b-8184-9dc7-d81f8106b5ad", "FIGMA_GUIDE.md"),
    ("39451ef0-4f0b-81bc-83a1-f291eeb1ce31", "SCREENS_UPLOAD_GUIDE.md"),
    ("39451ef0-4f0b-810d-81f6-eea53c4d0682", "NOTION_DB_COLOR_GUIDE.md"),
]

for page_id, fname in UPDATES:
    content = (DIR / fname).read_text(encoding="utf-8")
    payload = {
        "page_id": page_id,
        "command": "replace_content",
        "new_str": content,
        "allow_async": True,
    }
    out = DIR / f"payload_{fname.replace('.md', '.json')}"
    out.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {out.name} ({len(content)} chars)")
