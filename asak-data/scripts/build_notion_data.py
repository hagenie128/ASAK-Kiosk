#!/usr/bin/env python3
"""Build notion_data.json from notion_raw/ with REQ ID enrichment.

Duplicate key merge rules (requirements.id, scenarios.id, etc.):
  1. Prefer pages whose Notion 상태 is not "제외".
  2. Among ties, keep the row with the higher richness_score.
  3. Log each merge/skip to stdout.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from api_format import format_api_fields
from req_link_maps import (
    SCENARIO_REQ_MAP,
    api_req_ids,
    expand_refs,
    parse_req_list,
    qa_req_ids,
    scenario_display_title,
    scenario_req_ids,
    task_req_ids,
    title_with_req,
)

SCRIPT = Path(__file__).parent
RAW = SCRIPT / "notion_raw"
OUT = SCRIPT / "notion_data.json"
COMPACT = SCRIPT / "compact_pages.json"


def props_to_text(url: str, props: dict) -> str:
    return (
        f'Here is the result of "view" for the Page with URL {url}.\n'
        f'<page url="{url}">\n<properties>\n'
        f"{json.dumps(props, ensure_ascii=False)}\n"
        f"</properties>\n</page>"
    )


def parse_properties(text: str) -> dict | None:
    m = re.search(r"<properties>\s*(\{.*?\})\s*</properties>", text, re.DOTALL)
    return json.loads(m.group(1)) if m else None


def parse_mermaid(text: str) -> str:
    m = re.search(r"```mermaid\s*(.*?)```", text, re.DOTALL)
    return m.group(1).strip() if m else ""


def extract_code_blocks(text: str) -> list[str]:
    return [m.group(1).strip() for m in re.finditer(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)]


def extract_code(raw: str) -> str:
    if not raw:
        return ""
    m = re.search(r'"code"\s*:\s*"([A-Z0-9_]+)"', raw)
    if m:
        return m.group(1)
    blocks = extract_code_blocks(raw)
    return blocks[0] if blocks else raw[:500]


def classify(props: dict, title: str, text: str) -> tuple[str, dict] | None:
    if "요구사항 ID" in props:
        return "requirements", {
            "id": props.get("요구사항 ID", "").strip(),
            "title": props.get("요구사항명") or title,
            "description": props.get("상세 설명") or "",
            "priority": props.get("우선순위"),
            "status_notion": props.get("상태"),
            "category": props.get("구분"),
        }
    if "작업 ID" in props:
        task_id = props.get("작업 ID", "").strip()
        base_title = props.get("작업명") or title
        req_ids = task_req_ids(task_id, props)
        return "tasks", {
            "task_id": task_id,
            "title": title_with_req(base_title, req_ids),
            "base_title": base_title,
            "req_ids": req_ids,
            "assignee": props.get("담당자") or "",
            "start_date": props.get("date:시작일:start") or "",
            "end_date": props.get("date:종료일:start") or "",
            "status_notion": props.get("상태"),
        }
    if "API ID" in props:
        api_id = props.get("API ID", "").strip()
        req = props.get("Request") or ""
        if req == "없음":
            req = ""
        method = props.get("Method") or "GET"
        req_ids = api_req_ids(api_id)
        base_title = props.get("API명") or title
        desc = (props.get("처리 내용") or props.get("설명") or "").strip()
        fmt = format_api_fields(
            api_id,
            method,
            props.get("userDefined:URL") or "",
            req,
            props.get("Response") or "",
            props.get("Error") or "",
            text,
        )
        return "apis", {
            "api_id": api_id,
            "title": title_with_req(f"{api_id} {base_title}", req_ids, primary_only=True),
            "base_title": base_title,
            "req_ids": req_ids,
            "method": method,
            "endpoint": props.get("userDefined:URL") or "",
            "request_params": fmt["request_params"],
            "request_body": fmt["request_body"],
            "response_success": fmt["response_success"],
            "response_error": fmt["response_error"],
            "description": desc,
        }
    if "시나리오 ID" in props:
        sid = props.get("시나리오 ID", "").strip()
        base_title = props.get("시나리오명") or title
        req_ids = scenario_req_ids(sid, props)
        return "scenarios", {
            "id": sid,
            "title": scenario_display_title(
                base_title,
                req_ids,
                primary=SCENARIO_REQ_MAP.get(sid, [None])[0] if req_ids else None,
            ),
            "base_title": base_title,
            "req_ids": req_ids,
            "pre_condition": props.get("시작 조건") or "",
            "post_condition": props.get("종료 조건") or "",
            "normal_flow": props.get("기본 흐름") or "",
            "alternative_flow": props.get("예외 흐름") or "",
            "mermaid_script": parse_mermaid(text),
            "status_notion": props.get("상태"),
        }
    if "테스트 ID" in props:
        tc_id = props.get("테스트 ID", "").strip()
        base_title = props.get("테스트명") or title
        req_ids = qa_req_ids(tc_id, props)
        sc_match = re.search(r"SC-\d{3}", str(props.get("비고", "")))
        sc_id = sc_match.group(0) if sc_match else ""
        return "qa", {
            "id": tc_id,
            "title": title_with_req(f"{tc_id} {base_title}", req_ids, primary_only=True),
            "base_title": base_title,
            "req_ids": req_ids,
            "scenario_id": sc_id,
            "purpose": props.get("기대 결과") or "",
            "pre_condition": props.get("전제조건") or "",
            "steps": props.get("수행 절차") or "",
            "expected_result": props.get("기대 결과") or "",
            "status_notion": props.get("상태"),
        }
    return None


def load_sources() -> list[tuple[str, str, dict, str]]:
    items: list[tuple[str, str, dict, str]] = []
    if RAW.exists():
        for f in sorted(RAW.glob("*.json")):
            raw = json.loads(f.read_text(encoding="utf-8"))
            text = raw.get("text", "")
            props = parse_properties(text)
            if props:
                items.append((raw.get("title", ""), raw.get("url", ""), props, text))
    if COMPACT.exists():
        for e in json.loads(COMPACT.read_text(encoding="utf-8")):
            url = e.get("url") or f"https://app.notion.com/p/{e['page_id']}"
            text = props_to_text(url, e["props"])
            items.append((e.get("title", ""), url, e["props"], text))
    return items


def richness_score(bucket: str, row: dict, text: str) -> int:
    score = len(text)
    if "```mermaid" in text:
        score += 500
    if bucket == "scenarios":
        score += len(row.get("normal_flow") or "") * 2
        score += len(row.get("mermaid_script") or "") * 3
        score += len(row.get("req_ids") or []) * 10
    if bucket == "tasks":
        score += len(row.get("req_ids") or []) * 20
        if row.get("관련 산출물") if isinstance(row, dict) else False:
            score += 100
    if bucket == "qa":
        score += len(row.get("steps") or "")
    return score


def merge_rank(bucket: str, row: dict, text: str) -> tuple[int, int]:
    """Lower sorts first: non-제외 wins; then higher richness_score wins."""
    excluded = 0 if row.get("status_notion") != "제외" else 1
    return (excluded, -richness_score(bucket, row, text))


def main():
    data = {"requirements": [], "tasks": [], "apis": [], "scenarios": [], "qa": []}
    seen = {k: set() for k in data}
    key_map = {
        "requirements": "id",
        "tasks": "task_id",
        "apis": "api_id",
        "scenarios": "id",
        "qa": "id",
    }
    scores: dict[str, dict[str, tuple[int, int]]] = {k: {} for k in data}
    merge_log: list[str] = []
    for title, url, props, text in load_sources():
        item = classify(props, title, text)
        if not item:
            continue
        bucket, row = item
        kid = row.get(key_map[bucket], "")
        if not kid:
            continue
        rank = merge_rank(bucket, row, text)
        if kid in seen[bucket]:
            prev_rank = scores[bucket][kid]
            if rank < prev_rank:
                idx = next(
                    i for i, r in enumerate(data[bucket]) if r.get(key_map[bucket]) == kid
                )
                old_title = data[bucket][idx].get("title", "")
                data[bucket][idx] = row
                scores[bucket][kid] = rank
                merge_log.append(
                    f"MERGE {bucket} {kid}: kept {row.get('title') or title!r} "
                    f"(was {old_title!r}) from {url}"
                )
            else:
                merge_log.append(
                    f"SKIP  {bucket} {kid}: dropped {row.get('title') or title!r} from {url}"
                )
            continue
        seen[bucket].add(kid)
        scores[bucket][kid] = rank
        data[bucket].append(row)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"Wrote {OUT}: req={len(data['requirements'])}, api={len(data['apis'])}, "
        f"scenario={len(data['scenarios'])}, task={len(data['tasks'])}, qa={len(data['qa'])}"
    )
    if merge_log:
        print(f"Merge log ({len(merge_log)} lines):")
        for line in merge_log:
            print(f"  {line}")


if __name__ == "__main__":
    main()
