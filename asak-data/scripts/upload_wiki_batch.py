#!/usr/bin/env python3
"""Batch upload docs/wiki deliverables to DevCopilot workspace 2."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import requests

BASE = "https://devproject-hub-backend.onrender.com"
WS = 2
HEADERS = {"Content-Type": "application/json", "x-user-username": "hagenie128"}
REPO = Path(__file__).resolve().parents[2]
WIKI = REPO / "docs" / "wiki"
UI = "https://devcopilot.ai.kr/workspace/2/wiki"

# title, file, optional existing id to PUT (title will be updated)
UPLOADS: list[tuple[str, str, int | None]] = [
    ("ASAK 요구사항 정의서", "requirements-definition.md", None),
    ("ASAK 사용자 시나리오 명세", "user-scenarios.md", None),
    ("ASAK 화면 설계 및 Figma 연동", "screen-design-figma.md", 5),
    ("ASAK DB 설계 테이블 정의서", "db-table-definition.md", None),
    ("ASAK REST API 명세서", "rest-api-spec.md", None),
    ("ASAK WBS 및 일정 계획", "wbs-schedule.md", None),
    ("ASAK QA 테스트 케이스", "qa-test-cases.md", None),
    ("ASAK 회의록 및 최종 배포 검증", "meeting-deliverables-checklist.md", None),
]


def api(method: str, path: str, **kwargs) -> requests.Response:
    return requests.request(method, f"{BASE}{path}", headers=HEADERS, timeout=120, **kwargs)


def main() -> None:
    results: list[dict] = []
    existing = {w["id"]: w for w in api("GET", f"/api/workspaces/{WS}/wikis").json()}
    by_title = {w["title"]: w for w in existing.values()}

    for title, rel, force_id in UPLOADS:
        content = (WIKI / rel).read_text(encoding="utf-8")
        body = {"title": title, "content": content}
        if force_id and force_id in existing:
            r = api("PUT", f"/api/workspaces/{WS}/wikis/{force_id}", json=body)
            action = "updated"
            wid = force_id
        elif title in by_title:
            wid = by_title[title]["id"]
            r = api("PUT", f"/api/workspaces/{WS}/wikis/{wid}", json=body)
            action = "updated"
        else:
            r = api("POST", f"/api/workspaces/{WS}/wikis", json=body)
            action = "created"
            wid = r.json().get("id")
        if r.status_code not in (200, 201):
            print(f"FAIL {title}: {r.status_code} {r.text}", file=sys.stderr)
            sys.exit(1)
        url = f"{UI}/{wid}"
        print(f"{action} id={wid} title={title} url={url}")
        results.append({"id": wid, "title": title, "url": url, "file": rel, "action": action})

    # README with ids
    id_map = {r["title"]: r["id"] for r in results}
    readme = (REPO / "asak-data" / "scripts" / "gen_wiki_markdown.py")
    sys.path.insert(0, str(readme.parent))
    import gen_wiki_markdown as gwm  # noqa: E402

    readme_path = WIKI / "README.md"
    readme_path.write_text(gwm.gen_readme(id_map), encoding="utf-8")
    print(f"Wrote {readme_path}")

    out = REPO / "asak-data" / "scripts" / "wiki_upload_report.json"
    out.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Report: {out}")


if __name__ == "__main__":
    main()
