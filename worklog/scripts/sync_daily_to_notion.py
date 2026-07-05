#!/usr/bin/env python3
"""Sync worklog/daily/{person}/YYYY-MM-DD.md rows to Notion Daily 워크로그 DB.

Supports:
  - Notion REST API when NOTION_TOKEN is set (recommended for CI/local sync)
  - --dry-run / --json for preview or manual MCP apply

Usage:
  python worklog/scripts/sync_daily_to_notion.py --date today
  python worklog/scripts/sync_daily_to_notion.py --date today --person 이하진
  python worklog/scripts/sync_daily_to_notion.py --date 2026-07-05 --all
  python worklog/scripts/sync_daily_to_notion.py --date 2026-07-05 --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from worklog_paths import (  # noqa: E402
    DAILY_DIR,
    ROOT,
    daily_path,
    git_daily_url,
    list_daily_persons,
    load_team_config,
    map_assignee,
    resolve_person,
    team_dir_name,
)

CONFIG_PATH = ROOT / "notion_config.json"

TABLE_ROW_RE = re.compile(r"^\|(.+)\|$")
WBS_RE = re.compile(r"WBS-\d+", re.IGNORECASE)
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

SKIP_ASSIGNEE_MARKERS = ("담당자", "(이름)", "(담당", "이름)")


def load_config() -> dict[str, Any]:
    if not CONFIG_PATH.is_file():
        raise FileNotFoundError(f"Missing config: {CONFIG_PATH}")
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def resolve_date(value: str) -> str:
    if value.lower() in ("today", "오늘"):
        return date.today().isoformat()
    if not DATE_RE.match(value):
        raise ValueError(f"Invalid date: {value!r} (expected YYYY-MM-DD or 'today')")
    return value


def parse_section_lines(text: str, heading: str) -> list[str]:
    lines = text.splitlines()
    in_section = False
    collected: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped == heading:
            in_section = True
            continue
        if in_section and stripped.startswith("## "):
            break
        if in_section and stripped:
            collected.append(stripped)
    return collected


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
            headers = [normalize_header(h) for h in cells]
            continue
        if all(set(c) <= {"-", ":"} for c in cells):
            continue
        if len(cells) != len(headers):
            continue
        rows.append(dict(zip(headers, cells)))
    return rows


def normalize_header(header: str) -> str:
    mapping = {
        "담당": "담당자",
        "member": "담당자",
        "repo": "저장소",
        "repository": "저장소",
        "summary": "작업",
        "status": "상태",
        "blocker": "블로커",
    }
    key = header.strip()
    return mapping.get(key.lower(), key)


def should_skip_row(row: dict[str, str]) -> bool:
    name = row.get("담당자", "").strip()
    if not name:
        return True
    if any(marker in name for marker in SKIP_ASSIGNEE_MARKERS):
        return True
    work = row.get("작업", row.get("요약", "")).strip()
    if work.startswith("(") and work.endswith(")"):
        return True
    return False


def extract_wbs(*parts: str) -> str:
    found: list[str] = []
    for part in parts:
        for match in WBS_RE.findall(part or ""):
            code = match.upper()
            if code not in found:
                found.append(code)
    return ", ".join(found)


def row_has_blocker(row: dict[str, str]) -> bool:
    blocker = row.get("블로커", "").strip()
    if blocker and blocker not in ("-", "없음", "—", ""):
        return True
    return False


def parse_blocker_section(text: str) -> bool:
    for line in parse_section_lines(text, "## 블로커 / 공유 사항"):
        if line in ("- (없음)", "- 없음", "(없음)"):
            continue
        if line.startswith("- "):
            content = line[2:]
            if content in ("(없음)", "없음"):
                continue
            lowered = content.lower()
            if any(k in lowered for k in ("블로커", "blocker", "막힘", "blocking", "🚫", "⚠")):
                return True
    return False


def parse_tomorrow_plan(text: str) -> str:
    lines = parse_section_lines(text, "## 내일 계획")
    items = [ln[2:].strip() for ln in lines if ln.startswith("- ") and ln[2:].strip()]
    return " / ".join(items)


def build_row_payload(
    day: str,
    row: dict[str, str],
    config: dict[str, Any],
    *,
    folder_person: str,
    section_blocker: bool,
    tomorrow: str,
) -> dict[str, Any]:
    assignee = map_assignee(row.get("담당자", ""), folder_person)
    work = row.get("작업", row.get("요약", "")).strip()
    repo = row.get("저장소", "").strip()
    pr = row.get("PR", "").strip()
    wbs = row.get("WBS", "").strip() or extract_wbs(work, repo, pr)
    summary_parts = [p for p in (work, f"({repo})" if repo else "", pr) if p]
    summary = " ".join(summary_parts).strip()

    has_blocker = section_blocker or row_has_blocker(row)
    title = f"{day} {assignee} 일일" if assignee != "미지정" else f"{day} 팀 일일"

    return {
        "제목": title,
        "date:날짜:start": day,
        "date:날짜:is_datetime": 0,
        "담당": assignee,
        "WBS": wbs,
        "요약": summary,
        "Git daily": git_daily_url(config, folder_person, day),
        "블로커": "__YES__" if has_blocker else "__NO__",
        "_meta": {
            "assignee_key": assignee,
            "date": day,
            "folder_person": folder_person,
        },
    }


def parse_daily_file(path: Path, config: dict[str, Any], folder_person: str) -> list[dict[str, Any]]:
    text = path.read_text(encoding="utf-8")
    day = path.stem
    section_blocker = parse_blocker_section(text)
    tomorrow = parse_tomorrow_plan(text)
    payloads: list[dict[str, Any]] = []

    for row in parse_summary_table(text):
        if should_skip_row(row):
            continue
        payloads.append(
            build_row_payload(
                day,
                row,
                config,
                folder_person=folder_person,
                section_blocker=section_blocker,
                tomorrow=tomorrow,
            )
        )
    return payloads


def collect_sources(day: str, person: str | None, sync_all: bool) -> list[tuple[str, Path]]:
    sources: list[tuple[str, Path]] = []
    if sync_all:
        for folder_person in list_daily_persons():
            path = daily_path(folder_person, day)
            if path.is_file():
                sources.append((folder_person, path))
        return sources

    resolved = resolve_person(person)
    path = daily_path(resolved, day)
    if not path.is_file():
        raise FileNotFoundError(f"Missing {path}")
    return [(resolved, path)]


class NotionClient:
    def __init__(self, token: str, database_id: str) -> None:
        self.token = token
        self.database_id = database_id

    def _request(self, method: str, url: str, body: dict | None = None) -> dict:
        data = None if body is None else json.dumps(body).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            method=method,
            headers={
                "Authorization": f"Bearer {self.token}",
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(req) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Notion API {method} {url} failed ({exc.code}): {detail}") from exc

    def find_existing(self, day: str, assignee: str) -> str | None:
        body = {
            "filter": {
                "and": [
                    {"property": "날짜", "date": {"equals": day}},
                    {"property": "담당", "select": {"equals": assignee}},
                ]
            }
        }
        result = self._request(
            "POST",
            f"https://api.notion.com/v1/databases/{self.database_id}/query",
            body,
        )
        rows = result.get("results", [])
        return rows[0]["id"] if rows else None

    def to_api_properties(self, payload: dict[str, Any]) -> dict[str, Any]:
        props: dict[str, Any] = {
            "제목": {"title": [{"text": {"content": payload["제목"]}}]},
            "날짜": {"date": {"start": payload["date:날짜:start"]}},
            "담당": {"select": {"name": payload["담당"]}},
            "블로커": {"checkbox": payload["블로커"] == "__YES__"},
        }
        if payload.get("WBS"):
            props["WBS"] = {"rich_text": [{"text": {"content": payload["WBS"]}}]}
        if payload.get("요약"):
            props["요약"] = {"rich_text": [{"text": {"content": payload["요약"]}}]}
        if payload.get("Git daily"):
            props["Git daily"] = {"url": payload["Git daily"]}
        return props

    def upsert(self, payload: dict[str, Any]) -> dict[str, str]:
        meta = payload.pop("_meta", {})
        assignee = meta.get("assignee_key", payload["담당"])
        day = meta.get("date", payload["date:날짜:start"])
        page_id = self.find_existing(day, assignee)
        properties = self.to_api_properties(payload)

        if page_id:
            result = self._request(
                "PATCH",
                f"https://api.notion.com/v1/pages/{page_id}",
                {"properties": properties},
            )
            action = "updated"
        else:
            result = self._request(
                "POST",
                "https://api.notion.com/v1/pages",
                {"parent": {"database_id": self.database_id}, "properties": properties},
            )
            action = "created"

        return {
            "action": action,
            "page_id": result["id"],
            "url": result.get("url", ""),
            "제목": payload["제목"],
            "담당": assignee,
            "날짜": day,
        }


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    parser = argparse.ArgumentParser(description="Sync personal worklog daily markdown to Notion")
    parser.add_argument("--date", required=True, help="YYYY-MM-DD or 'today'")
    parser.add_argument(
        "--person",
        default=None,
        help="담당자 실명 또는 team. 생략 시 git user → team_config.json",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="해당 날짜에 존재하는 모든 daily/{person}/ 파일 동기화",
    )
    parser.add_argument("--dry-run", action="store_true", help="Parse only; do not write")
    parser.add_argument("--json", action="store_true", help="Print MCP-ready JSON payload")
    args = parser.parse_args()

    try:
        day = resolve_date(args.date)
        config = load_config()
        sources = collect_sources(day, args.person, args.all)
    except (ValueError, FileNotFoundError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if not sources:
        print(f"Error: no daily files for {day} under {DAILY_DIR}", file=sys.stderr)
        return 1

    all_payloads: list[dict[str, Any]] = []
    source_meta: list[dict[str, str]] = []
    for folder_person, path in sources:
        rows = parse_daily_file(path, config, folder_person)
        all_payloads.extend(rows)
        source_meta.append(
            {
                "person": folder_person,
                "path": str(path.relative_to(ROOT.parent)),
            }
        )

    if not all_payloads:
        paths = ", ".join(str(p) for _, p in sources)
        print(f"No syncable rows in {paths}", file=sys.stderr)
        return 1

    output = {
        "date": day,
        "sources": source_meta,
        "database_id": config["database_id"],
        "data_source_id": config["data_source_id"],
        "database_url": config["database_url"],
        "rows": all_payloads,
        "mcp_hint": {
            "tool": "notion-create-pages / notion-update-page",
            "parent": {"data_source_id": config["data_source_id"], "type": "data_source_id"},
        },
    }

    if args.json or args.dry_run:
        print(json.dumps(output, ensure_ascii=False, indent=2))
        if args.dry_run:
            print(f"\n[dry-run] {len(all_payloads)} row(s) from {len(sources)} file(s); no Notion write.", file=sys.stderr)
            return 0

    token = os.environ.get("NOTION_TOKEN", "").strip()
    if not token:
        print(
            "NOTION_TOKEN not set. Re-run with --json and apply via Notion MCP, "
            "or set NOTION_TOKEN for direct API sync.",
            file=sys.stderr,
        )
        print(json.dumps(output, ensure_ascii=False, indent=2))
        return 2

    client = NotionClient(token, config["database_id"])
    results = []
    for payload in all_payloads:
        row = dict(payload)
        results.append(client.upsert(row))

    print(json.dumps({"date": day, "results": results}, ensure_ascii=False, indent=2))
    print(f"Synced {len(results)} row(s) to Notion from {len(sources)} file(s).", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
