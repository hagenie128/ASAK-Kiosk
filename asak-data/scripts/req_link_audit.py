#!/usr/bin/env python3
"""Audit and report REQ ID linkage across DevCopilot workspace 2 artifacts."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import requests

from req_link_maps import SCR_REQ_MAP

BASE = "https://devproject-hub-backend.onrender.com"
WS = 2
HEADERS = {"Content-Type": "application/json", "x-user-username": "hagenie128"}
TEST_REQ_IDS = {"TEST-REQ"}


def get_json(path: str) -> list | dict:
    r = requests.get(f"{BASE}{path}", headers=HEADERS, timeout=120)
    r.raise_for_status()
    return r.json()


def active_requirement_ids(requirements: list[dict]) -> list[str]:
    return sorted(
        rid
        for row in requirements
        if (rid := row.get("id"))
        and rid not in TEST_REQ_IDS
        and not str(rid).startswith("TEST-")
    )


def wiki_content() -> str:
    wikis = get_json(f"/api/workspaces/{WS}/wikis")
    screen = next((w for w in wikis if w.get("id") == 5), None)
    return (screen or {}).get("content") or ""


def count_links(req_id: str, tasks, apis, scenarios, tables, qa, wiki: str) -> dict[str, int]:
    screens = sum(
        1
        for scr, reqs in SCR_REQ_MAP.items()
        if req_id in reqs and f"## {scr} " in wiki
    )
    return {
        "wbs": sum(1 for t in tasks if req_id in (t.get("title") or "")),
        "api": sum(
            1
            for a in apis
            if req_id in (a.get("description") or "") or req_id in (a.get("title") or "")
        ),
        "scenario": sum(1 for s in scenarios if req_id in (s.get("title") or "")),
        "table": sum(1 for t in tables if req_id in (t.get("description") or "")),
        "qa": sum(
            1
            for q in qa
            if req_id in (q.get("title") or "") or req_id in (q.get("purpose") or "")
        ),
        "screen": screens,
    }


def audit() -> dict:
    requirements = get_json(f"/api/workspaces/{WS}/requirements")
    req_ids = active_requirement_ids(requirements)
    tasks = get_json(f"/api/workspaces/{WS}/tasks")
    apis = get_json(f"/api/workspaces/{WS}/apis")
    scenarios = get_json(f"/api/workspaces/{WS}/scenarios")
    tables = get_json(f"/api/workspaces/{WS}/tables")
    qa = get_json(f"/api/workspaces/{WS}/qa")
    wiki = wiki_content()

    report: dict = {"total": len(req_ids), "req_ids": req_ids, "details": {}, "orphans": [], "partial": [], "fully_linked": []}
    for rid in req_ids:
        counts = count_links(rid, tasks, apis, scenarios, tables, qa, wiki)
        total = sum(counts.values())
        report["details"][rid] = {**counts, "total": total}
        if total == 0:
            report["orphans"].append(rid)
        elif total == 1:
            report["partial"].append(rid)
        else:
            report["fully_linked"].append(rid)
    report["summary"] = {
        "fully_linked": len(report["fully_linked"]),
        "partial": len(report["partial"]),
        "orphan": len(report["orphans"]),
    }
    return report


def main() -> None:
    report = audit()
    out = Path(__file__).parent / "req_link_report.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    s = report["summary"]
    print(f"REQ audit: total={report['total']} fully={s['fully_linked']} partial={s['partial']} orphan={s['orphan']}")
    if report["orphans"]:
        print("Orphans:", ", ".join(report["orphans"]))
    if report["partial"]:
        print("Partial:", ", ".join(report["partial"][:20]))
    print(f"Report: {out}")


if __name__ == "__main__":
    main()
