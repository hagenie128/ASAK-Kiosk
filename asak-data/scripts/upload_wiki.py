#!/usr/bin/env python3
"""Upload markdown files to DevCopilot Wiki API (workspace 2). Upsert by title."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import requests

BASE = "https://devproject-hub-backend.onrender.com"
WS = 2
HEADERS = {"Content-Type": "application/json", "x-user-username": "hagenie128"}
REPO_ROOT = Path(__file__).resolve().parents[2]
WIKI_UI_BASE = "https://devcopilot.ai.kr/workspace/2/wiki"


def api(method: str, path: str, **kwargs) -> requests.Response:
    return requests.request(method, f"{BASE}{path}", headers=HEADERS, timeout=120, **kwargs)


def list_wikis() -> list[dict]:
    r = api("GET", f"/api/workspaces/{WS}/wikis")
    if r.status_code != 200:
        print(f"FAIL list wikis: {r.status_code} {r.text}", file=sys.stderr)
        sys.exit(1)
    return r.json()


def upsert_wiki(title: str, content: str, dry_run: bool = False) -> dict:
    body = {"title": title, "content": content}
    if dry_run:
        preview = {"dry_run": True, "title": title, "content_preview": content[:200]}
        print(json.dumps(preview, ensure_ascii=False, indent=2))
        return preview

    existing = {w.get("title"): w for w in list_wikis()}
    if title in existing:
        wid = existing[title]["id"]
        r = api("PUT", f"/api/workspaces/{WS}/wikis/{wid}", json=body)
        action = "updated"
    else:
        r = api("POST", f"/api/workspaces/{WS}/wikis", json=body)
        action = "created"
    if r.status_code not in (200, 201):
        print(f"FAIL {action}: {r.status_code} {r.text}", file=sys.stderr)
        sys.exit(1)
    data = r.json()
    wid = data.get("id")
    url = f"{WIKI_UI_BASE}/{wid}"
    print(f"Wiki {action} id={wid} title={data.get('title')} url={url}")
    return {**data, "url": url, "action": action}


def main() -> None:
    p = argparse.ArgumentParser(description="Upload markdown to DevCopilot Wiki (upsert)")
    p.add_argument("--title", required=True, help="Wiki page title")
    p.add_argument("--file", type=Path, required=True, help="Markdown file path")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()
    path = args.file if args.file.is_absolute() else REPO_ROOT / args.file
    if not path.exists():
        print(f"Missing {path}", file=sys.stderr)
        sys.exit(1)
    content = path.read_text(encoding="utf-8")
    upsert_wiki(args.title, content, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
