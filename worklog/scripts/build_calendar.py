#!/usr/bin/env python3
"""Scan worklog/daily/{person}/*.md and emit worklog/calendar/data.json for the calendar viewer."""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from worklog_paths import DAILY_DIR, ROOT, list_daily_persons, team_dir_name  # noqa: E402

OUTPUT = ROOT / "calendar" / "data.json"

MEMBER_COLORS = {
    "팀 공통": "#2d8a4e",
    "미지정": "#2d8a4e",
    "이하진": "#2563eb",
    "김나연": "#b45309",
    "박유진": "#7c3aed",
    "강민준": "#db2777",
}

DEFAULT_COLORS = ["#2d8a4e", "#2563eb", "#b45309", "#7c3aed", "#db2777", "#0d9488"]
DATE_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})\.md$")
TABLE_ROW_RE = re.compile(r"^\|(.+)\|$")
BLOCKER_MARKERS = ("블로커", "blocker", "🚫", "⚠")


def parse_title(text: str) -> str:
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return ""


def parse_summary_table(text: str) -> list[dict[str, str]]:
    lines = text.splitlines()
    in_table = False
    headers: list[str] = []
    rows: list[dict[str, str]] = []

    for line in lines:
        stripped = line.strip()
        if stripped == "## 오늘 요약":
            in_table = True
            headers = []
            continue
        if in_table and stripped.startswith("## "):
            break
        if not in_table:
            continue
        match = TABLE_ROW_RE.match(stripped)
        if not match:
            continue
        cells = [c.strip() for c in match.group(1).split("|")]
        if not headers:
            if all(set(c) <= {"-", ":"} for c in cells):
                continue
            headers = cells
            continue
        if all(set(c) <= {"-", ":"} for c in cells):
            continue
        if len(cells) != len(headers):
            continue
        rows.append(dict(zip(headers, cells)))
    return rows


def row_has_blocker(row: dict[str, str]) -> bool:
    joined = " ".join(row.values()).lower()
    if any(m.lower() in joined for m in BLOCKER_MARKERS):
        blocker_cell = row.get("블로커", row.get("blocker", ""))
        if blocker_cell and blocker_cell not in ("-", "없음", "—", ""):
            return True
        if "🚫" in joined or "⚠" in joined:
            return True
    blocker_cell = row.get("블로커", "")
    if blocker_cell and blocker_cell not in ("-", "없음", "—", ""):
        return True
    return False


def parse_blocker_section(text: str) -> bool:
    lines = text.splitlines()
    in_section = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("## 블로커"):
            in_section = True
            continue
        if in_section and stripped.startswith("## "):
            break
        if not in_section:
            continue
        if not stripped or stripped.startswith("<!--"):
            continue
        if stripped in ("- (없음)", "- 없음", "(없음)"):
            return False
        if stripped.startswith("- "):
            content = stripped[2:]
            if content in ("(없음)", "없음"):
                continue
            lowered = content.lower()
            if any(k in lowered for k in ("블로커", "blocker", "막힘", "blocking", "🚫", "⚠")):
                return True
    return False


def collect_members(rows: list[dict[str, str]], folder_person: str) -> list[str]:
    seen: list[str] = []
    for row in rows:
        name = row.get("담당자", row.get("member", "")).strip()
        if name and name not in seen:
            seen.append(name)
    if not seen and folder_person != team_dir_name():
        seen.append(folder_person)
    return seen


def assign_colors(members: list[str]) -> dict[str, str]:
    colors: dict[str, str] = {}
    fallback_idx = 0
    for name in members:
        if name in MEMBER_COLORS:
            colors[name] = MEMBER_COLORS[name]
        else:
            colors[name] = DEFAULT_COLORS[fallback_idx % len(DEFAULT_COLORS)]
            fallback_idx += 1
    return colors


def build_day_entry(path: Path, text: str, folder_person: str) -> dict:
    rows = parse_summary_table(text)
    members = collect_members(rows, folder_person)
    has_blocker = parse_blocker_section(text) or any(row_has_blocker(r) for r in rows)
    summaries = [r.get("작업", "").strip() for r in rows if r.get("작업", "").strip()]
    summary = " · ".join(summaries[:3])
    if len(summaries) > 3:
        summary += f" 외 {len(summaries) - 3}건"

    return {
        "date": path.stem,
        "person": folder_person,
        "title": parse_title(text) or f"{path.stem} 일일 워크로그",
        "summary": summary,
        "members": members,
        "rows": rows,
        "row_count": len(rows),
        "has_blocker": has_blocker,
        "file": f"daily/{folder_person}/{path.name}",
    }


def main() -> None:
    days: dict[str, dict] = {}
    all_members: list[str] = []

    if DAILY_DIR.is_dir():
        persons = list_daily_persons()
        for folder_person in persons:
            person_dir = DAILY_DIR / folder_person
            if not person_dir.is_dir():
                continue
            for path in sorted(person_dir.glob("*.md")):
                if path.name.startswith("_"):
                    continue
                if not DATE_RE.match(path.name):
                    continue
                text = path.read_text(encoding="utf-8")
                entry = build_day_entry(path, text, folder_person)
                key = f"{entry['date']}:{folder_person}"
                days[key] = entry
                for m in entry["members"]:
                    if m not in all_members:
                        all_members.append(m)

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project": "ASAK",
        "team_size": 4,
        "weeks": 8,
        "daily_dir": "daily",
        "layout": "daily/{person}/YYYY-MM-DD.md",
        "members": all_members,
        "member_colors": assign_colors(all_members),
        "days": days,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT} ({len(days)} day/person file(s))")


if __name__ == "__main__":
    main()
