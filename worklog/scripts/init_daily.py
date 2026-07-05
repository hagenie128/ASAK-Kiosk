#!/usr/bin/env python3
"""Create today's daily markdown from template if missing.

Usage:
  python worklog/scripts/init_daily.py
  python worklog/scripts/init_daily.py --date 2026-07-05
  python worklog/scripts/init_daily.py --template auto
"""

from __future__ import annotations

import argparse
import re
import shutil
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DAILY_DIR = ROOT / "daily"
TEMPLATES_DIR = ROOT / "templates"
DEFAULT_TEMPLATE = TEMPLATES_DIR / "template-daily-manual.md"
AUTO_TEMPLATE = TEMPLATES_DIR / "template-daily-auto.md"
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def resolve_date(value: str) -> str:
    if value.lower() in ("today", "오늘"):
        return date.today().isoformat()
    if not DATE_RE.match(value):
        raise ValueError(f"Invalid date: {value!r} (expected YYYY-MM-DD or 'today')")
    return value


def pick_template(name: str) -> Path:
    if name == "auto":
        if AUTO_TEMPLATE.is_file():
            return AUTO_TEMPLATE
        return DEFAULT_TEMPLATE
    if name in ("manual", "template-daily-manual"):
        return DEFAULT_TEMPLATE
    path = Path(name)
    if path.is_file():
        return path
    candidate = DAILY_DIR / name
    if candidate.is_file():
        return candidate
    raise FileNotFoundError(f"Template not found: {name}")


def render_template(template_path: Path, day: str) -> str:
    text = template_path.read_text(encoding="utf-8")
    return (
        text.replace("YYYY-MM-DD", day)
        .replace("{{DATE}}", day)
        .replace("{{YEAR}}", day[:4])
        .replace("{{MONTH}}", day[5:7])
        .replace("{{DAY}}", day[8:10])
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Initialize daily worklog markdown")
    parser.add_argument("--date", default="today", help="YYYY-MM-DD or 'today'")
    parser.add_argument(
        "--template",
        default="auto",
        help="auto | manual | template-daily-manual.md | path to template",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite existing file")
    args = parser.parse_args()

    day = resolve_date(args.date)
    target = DAILY_DIR / f"{day}.md"
    if target.is_file() and not args.force:
        print(f"Exists: {target}")
        return 0

    template = pick_template(args.template)
    DAILY_DIR.mkdir(parents=True, exist_ok=True)

    if template == DEFAULT_TEMPLATE and "{{DATE}}" not in template.read_text(encoding="utf-8"):
        shutil.copy2(template, target)
        content = target.read_text(encoding="utf-8")
        content = content.replace("YYYY-MM-DD", day)
        target.write_text(content, encoding="utf-8")
    else:
        target.write_text(render_template(template, day), encoding="utf-8")

    print(f"Created: {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
