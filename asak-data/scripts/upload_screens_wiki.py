#!/usr/bin/env python3
"""Upload screens-wiki.md to DevCopilot Wiki API (workspace 2). Upsert by title."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

WIKI_MD = Path(__file__).resolve().parents[2] / "docs" / "screens" / "screens-wiki.md"
DEFAULT_TITLE = "ASAK 화면설계 (SCR-001~019)"

# reuse upload_wiki upsert
sys.path.insert(0, str(Path(__file__).resolve().parent))
from upload_wiki import upsert_wiki  # noqa: E402


def main() -> None:
  p = argparse.ArgumentParser(description="Upload ASAK screen design doc to DevCopilot Wiki")
  p.add_argument("--title", default=DEFAULT_TITLE)
  p.add_argument("--file", type=Path, default=WIKI_MD)
  p.add_argument("--dry-run", action="store_true")
  args = p.parse_args()
  if not args.file.exists():
    print(f"Missing {args.file}. Run export_screens.py first.", file=sys.stderr)
    sys.exit(1)
  content = args.file.read_text(encoding="utf-8")
  upsert_wiki(args.title, content, dry_run=args.dry_run)


if __name__ == "__main__":
  main()
