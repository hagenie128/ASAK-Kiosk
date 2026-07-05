#!/usr/bin/env python3
"""Export Notion 04. 화면설계 (SCR-001~019) to JSON/Markdown for DevCopilot upload."""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "docs" / "screens"
RAW_DIR = Path(__file__).parent / "notion_raw"
SNAPSHOT_FILE = Path(__file__).parent / "screens_notion_snapshot.json"

SCREEN_PAGE_IDS: dict[str, str] = {
    "SCR-001": "39251ef0-4f0b-8180-9f23-d741a44576d4",
    "SCR-002": "39251ef0-4f0b-81f3-817e-d64352907379",
    "SCR-003": "39151ef04f0b81d5bcadc90c901d56d8",
    "SCR-004": "39151ef04f0b8163bec2c6b5cd0b6f19",
    "SCR-005": "39151ef04f0b81adb474ddf94c33827d",
    "SCR-006": "39251ef0-4f0b-8187-af99-d9f6add9af64",
    "SCR-007": "39151ef04f0b8125a9dacd7c7ad95831",
    "SCR-008": "39151ef04f0b816287ceda11a8ede0f6",
    "SCR-009": "39151ef04f0b816a89b6c3b956e9974a",
    "SCR-010": "39251ef0-4f0b-8186-9277-fd3fc980ff52",
    "SCR-011": "39151ef04f0b811189b2fc39fe4f1959",
    "SCR-012": "39251ef0-4f0b-815c-b6a3-cf814f31623b",
    "SCR-013": "39251ef0-4f0b-8102-bff0-db4c2edddd62",
    "SCR-014": "39251ef0-4f0b-8136-a250-c51fd7314855",
    "SCR-015": "39251ef0-4f0b-81ad-9057-eec10351023e",
    "SCR-016": "39251ef0-4f0b-812fba53ed19e6089d7b",
    "SCR-017": "39251ef0-4f0b-81e3-bf1dcbe8caf82632",
    "SCR-018": "39251ef0-4f0b-81b0-84fa-e81a1dc8e1c7",
    "SCR-019": "39251ef0-4f0b-813d-8e9f-f5fa34adf007",
}

def _week5_mvp_terms(text: str) -> str:
    """Replace deprecated Day 10 wording with Week 5/6 MVP."""
    if not text:
        return text
    for old, new in (
        ("Day 10 1차 발표", "Week 5 MVP"),
        ("Day 10 발표", "Week 5 MVP"),
        ("Day10", "Week 5 MVP"),
        ("Day 10", "Week 5 MVP"),
    ):
        text = text.replace(old, new)
    return text


NOTION_STATUS_TO_DC = {
    "기획중": "WIREFRAME",
    "와이어프레임": "WIREFRAME",
    "디자인중": "DESIGNING",
    "프로토타입완료": "DESIGNING",
    "개발중": "CODING",
    "개발완료": "CODING",
    "수정필요": "DESIGNING",
    "제외": "WIREFRAME",
}

PROP_KEYS = {
    "screen_id": "화면 ID",
    "title": "화면명",
    "figma_url": "Figma 링크",
    "prototype_url": "Prototype 링크",
    "input_vars": "입력 데이터",
    "output_vars": "출력 데이터",
    "status_notion": "상태",
    "category": "구분",
    "phase": "단계",
    "domain": "도메인",
    "priority": "우선순위",
    "assignee": "담당자",
    "description": "화면 설명",
    "related_req": "관련 요구사항",
    "related_sc": "관련 시나리오",
    "related_api": "관련 API",
    "related_test": "관련 테스트",
    "notes": "비고",
    "dev_done": "개발 완료",
}


def _split_ids(text: str) -> list[str]:
    if not text or text.strip() in ("없음", "-"):
        return []
    parts = re.split(r"[,，\n/]+", text)
    out: list[str] = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        for m in re.finditer(r"(?:FWD|LMIS|KSD|RTOS|DEV|API|SC|TC)-[A-Z0-9-]+", p):
            out.append(m.group())
        if re.fullmatch(r"SC-\d{3}", p):
            out.append(p)
        elif re.fullmatch(r"API-\d{3}", p):
            out.append(p)
        elif not out or p not in " ".join(out):
            if re.search(r"(시나리오|흐름)", p) and "SC-" not in p:
                out.append(p)
    return list(dict.fromkeys(out))


def parse_properties_from_fetch(text: str) -> dict[str, Any]:
    m = re.search(r"<properties>\s*(\{.*?\})\s*</properties>", text, re.DOTALL)
    if not m:
        return {}
    props = json.loads(m.group(1))
    row: dict[str, Any] = {}
    for key, notion_key in PROP_KEYS.items():
        val = props.get(notion_key, "")
        if key == "dev_done":
            row[key] = val == "__YES__"
        elif key in ("related_req", "related_sc", "related_api", "related_test"):
            row[key] = _split_ids(str(val))
        else:
            row[key] = str(val) if val is not None else ""
    if not row.get("screen_id"):
        row["screen_id"] = props.get("화면 ID", "")
    if not row.get("title"):
        row["title"] = props.get("화면명", "")
    row["status"] = NOTION_STATUS_TO_DC.get(row.get("status_notion", ""), "WIREFRAME")
    row["notion_url"] = props.get("url", "")
    return row


def load_from_notion_raw() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for sid in sorted(SCREEN_PAGE_IDS):
        pid = SCREEN_PAGE_IDS[sid]
        raw_file = RAW_DIR / f"{pid}.json"
        if not raw_file.exists():
            return []
        payload = json.loads(raw_file.read_text(encoding="utf-8"))
        text = payload.get("text") or payload.get("content") or ""
        row = parse_properties_from_fetch(text)
        if row:
            rows.append(row)
    return rows


def load_from_snapshot() -> list[dict[str, Any]]:
    data = json.loads(SNAPSHOT_FILE.read_text(encoding="utf-8"))
    return data["screens"]


def load_screens() -> list[dict[str, Any]]:
    rows = load_from_notion_raw()
    if rows:
        return sorted(rows, key=lambda r: r["screen_id"])
    return sorted(load_from_snapshot(), key=lambda r: r["screen_id"])


def to_devcopilot_localstorage(screens: list[dict[str, Any]], workspace_id: int = 2) -> dict[str, Any]:
    items = [
        {
            "id": s["screen_id"],
            "name": s["title"],
            "figmaUrl": s.get("figma_url") or "",
            "inputs": s.get("input_vars") or "",
            "outputs": s.get("output_vars") or "",
            "status": s.get("status", "WIREFRAME"),
        }
        for s in screens
    ]
    return {
        "localStorage_key": f"ws_{workspace_id}_screens",
        "workspace_id": workspace_id,
        "screens": items,
    }


def render_markdown_table(screens: list[dict[str, Any]]) -> str:
    lines = [
        "# ASAK 화면설계 (SCR-001~019)",
        "",
        "Notion [04. 화면 설계](https://app.notion.com/p/1c751ef04f0b825ea3aa8145f563bbc8) 기준. DevCopilot Screens UI 수동 입력용.",
        "",
        "| ID | 화면명 | 구분 | 상태 | 우선 | 입력 | 출력 | REQ | SC | API |",
        "|---|---|---|---|---|---|---|---|---|---|",
    ]
    for s in screens:
        lines.append(
            "| {screen_id} | {title} | {category} | {status_notion} | {priority} | {input_vars} | {output_vars} | {related_req} | {related_sc} | {related_api} |".format(
                screen_id=s["screen_id"],
                title=s["title"].replace("|", "\\|"),
                category=s.get("category", ""),
                status_notion=s.get("status_notion", ""),
                priority=s.get("priority", ""),
                input_vars=(s.get("input_vars") or "")[:40].replace("|", "\\|"),
                output_vars=(s.get("output_vars") or "")[:40].replace("|", "\\|"),
                related_req=", ".join(s.get("related_req") or [])[:30],
                related_sc=", ".join(s.get("related_sc") or [])[:20],
                related_api=", ".join(s.get("related_api") or [])[:25],
            )
        )
    lines.extend(["", "## Week 5 MVP (SCR-001~008) + Week 6 (SCR-009~011)", ""])
    for s in screens:
        num = int(s["screen_id"].split("-")[1])
        if num <= 11:
            lines.append(f"- **{s['screen_id']}** {s['title']} — {s.get('description', '')[:80]}")
    return "\n".join(lines) + "\n"


def render_wiki_markdown(screens: list[dict[str, Any]]) -> str:
    parts = [
        "# ASAK 키오스크 화면설계 (SCR-001~019)",
        "",
        "출처: Notion 04. 화면 설계 (2026-07-05 export)",
        "",
        "## 고객 키오스크 흐름",
        "홈 → 먹고가기/포장 → 메뉴선택 → 메뉴상세/옵션 → 장바구니 → 주문확인 → 결제 → 주문완료",
        "",
        "## 관리자 흐름",
        "주문관리 → 주문상세 / 품절관리 / (후반) 로그인·메뉴·결제수단·매출",
        "",
    ]
    for s in screens:
        parts.append(f"## {s['screen_id']} {s['title']}")
        parts.append("")
        parts.append(f"- **구분**: {s.get('category', '')} | **단계**: {s.get('phase', '')} | **상태**: {s.get('status_notion', '')}")
        parts.append(f"- **설명**: {_week5_mvp_terms(s.get('description', ''))}")
        parts.append(f"- **입력**: {s.get('input_vars', '')}")
        parts.append(f"- **출력**: {s.get('output_vars', '')}")
        if s.get("figma_url"):
            parts.append(f"- **Figma**: {s['figma_url']}")
        if s.get("related_req"):
            parts.append(f"- **요구사항**: {', '.join(s['related_req'])}")
        if s.get("related_sc"):
            parts.append(f"- **시나리오**: {', '.join(s['related_sc'])}")
        if s.get("related_api"):
            parts.append(f"- **API**: {', '.join(s['related_api'])}")
        if s.get("notes"):
            parts.append(f"- **비고**: {_week5_mvp_terms(s['notes'])}")
        parts.append("")
    return "\n".join(parts)


def export_all() -> None:
    screens = load_screens()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    checklist = []
    for s in screens:
        checklist.append({
            "screen_id": s["screen_id"],
            "title": s["title"],
            "figma_url": s.get("figma_url") or "",
            "prototype_url": s.get("prototype_url") or "",
            "input_vars": s.get("input_vars") or "",
            "output_vars": s.get("output_vars") or "",
            "status": s.get("status_notion") or "",
            "status_devcopilot": s.get("status") or "WIREFRAME",
            "category": s.get("category") or "",
            "phase": s.get("phase") or "",
            "priority": s.get("priority") or "",
            "related_req": s.get("related_req") or [],
            "related_sc": s.get("related_sc") or [],
            "related_api": s.get("related_api") or [],
            "related_test": s.get("related_test") or [],
            "description": _week5_mvp_terms(s.get("description") or ""),
            "notes": _week5_mvp_terms(s.get("notes") or ""),
            "notion_url": s.get("notion_url") or "",
        })

    (OUT_DIR / "screens.json").write_text(
        json.dumps(checklist, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUT_DIR / "screens.md").write_text(render_markdown_table(screens), encoding="utf-8")
    (OUT_DIR / "screens-wiki.md").write_text(render_wiki_markdown(screens), encoding="utf-8")

    ls = to_devcopilot_localstorage(screens)
    (OUT_DIR / "screens-devcopilot-localstorage.json").write_text(
        json.dumps(ls, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUT_DIR / "screens-devcopilot-import-array.json").write_text(
        json.dumps(ls["screens"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"exported {len(screens)} screens -> {OUT_DIR}")


if __name__ == "__main__":
    export_all()
