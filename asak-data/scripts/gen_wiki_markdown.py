#!/usr/bin/env python3
"""Generate docs/wiki/*.md from notion_data.json, seed manifest, screens, Notion exports."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from api_format import _compact_json

REPO = Path(__file__).resolve().parents[2]
WIKI = REPO / "docs" / "wiki"
DATA = json.loads((Path(__file__).parent / "notion_data.json").read_text(encoding="utf-8"))
MANIFEST = json.loads((REPO / "asak-data" / "seed" / "manifest.json").read_text(encoding="utf-8"))
SCREENS = json.loads((REPO / "docs" / "screens" / "screens.json").read_text(encoding="utf-8"))
SCREENS_WIKI = (REPO / "docs" / "screens" / "screens-wiki.md").read_text(encoding="utf-8")

TABLES = {
    "category": ("카테고리 마스터. 6개 분류", "FWD-MENU-001"),
    "code_group": ("공통코드 그룹", "KSD-ARCH-001"),
    "common_code": ("공통코드 상세", "KSD-ARCH-001"),
    "tag": ("메뉴 태그 마스터", "FWD-MENU-013"),
    "menu": ("판매 메뉴 마스터", "FWD-MENU-001"),
    "menu_tag": ("메뉴-태그 N:M", "FWD-MENU-013"),
    "menu_nutrition": ("메뉴 영양정보", "FWD-MENU-009"),
    "ingredient": ("재료 마스터", "FWD-MENU-003"),
    "allergen": ("알레르기 14종", "FWD-MENU-008"),
    "ingredient_allergen": ("재료-알레르기 N:M", "FWD-MENU-008"),
    "menu_ingredient": ("메뉴 기본 재료", "FWD-MENU-003"),
    "option_group": ("옵션그룹 마스터", "FWD-MENU-003"),
    "menu_option_group": ("메뉴-옵션그룹", "FWD-MENU-003"),
    "menu_option": ("메뉴별 옵션 설정·추천 드레싱", "FWD-MENU-004"),
    "option_item": ("옵션 선택 항목", "FWD-MENU-003"),
    "option_item_component": ("세트 옵션 구성품", "LMIS-MENU-006"),
    "payment_method_config": ("결제수단 설정", "FWD-PAY-001"),
    "orders": ("주문 헤더", "FWD-ORDER-001"),
    "order_item": ("주문 메뉴 단위", "LMIS-ORDER-004"),
    "order_item_option": ("선택 옵션", "LMIS-ORDER-004"),
    "item_exclusion": ("제외 재료", "FWD-MENU-007"),
    "payment": ("결제 내역", "FWD-PAY-001"),
}

EXTRA_APIS = [
    {
        "api_id": "API-018",
        "title": "멤버십 스탬프 적립",
        "method": "POST",
        "endpoint": "/api/membership/stamps",
        "request_body": "orderId, memberId, confirmStamp",
        "response_success": "MEMBERSHIP_STAMP_SUCCESS",
        "description": "결제 후 스탬프 1회 확인·적립 (SC-006, 확장)",
    },
    {
        "api_id": "API-019",
        "title": "영수증 출력 요청",
        "method": "POST",
        "endpoint": "/api/orders/{orderId}/receipt-print",
        "request_body": "orderId",
        "response_success": "RECEIPT_PRINT_REQUESTED",
        "description": "모의 프린터 출력 요청 (SC-015, Week 5 MVP 제외)",
    },
    {
        "api_id": "API-020",
        "title": "QR/바코드 스캔",
        "method": "POST",
        "endpoint": "/api/device/scan",
        "request_body": "scanType, code",
        "response_success": "SCAN_SUCCESS",
        "description": "쿠폰/멤버십 인식 (SC-016, 확장)",
    },
]

TEST_CASES = [
    {
        "id": "TC-001", "name": "신규 고객의 기본 주문 흐름 성공", "sc": "SC-001",
        "api": "API-001~006", "screen": "SCR-001~008", "phase": "KSD", "type": "통합", "prio": "상",
        "pre": "키오스크 정상 구동, 모든 메뉴 판매중",
        "steps": "1) 홈 진입 2) 메뉴 선택 3) 추천조합+토핑 4) 장바구니 5) 결제",
        "expect": "결제 완료 후 주문번호 표시",
    },
    {
        "id": "TC-002", "name": "재방문 고객 빠른 주문(화면 5회 이내)", "sc": "SC-002",
        "api": "API-002~006", "screen": "SCR-003~008", "phase": "FWD", "type": "화면", "prio": "상",
        "pre": "재방문 고객, 추천조합 기본값 설정됨",
        "steps": "메뉴선택→옵션(기본값 유지)→장바구니→주문확인→결제, 화면 전환 5회 이내",
        "expect": "주문번호 표시, 화면 전환 ≤5회",
    },
    {
        "id": "TC-003", "name": "품절 항목 포함 시 주문 불가/대체", "sc": "SC-003",
        "api": "API-002~004, API-009", "screen": "SCR-003~004, SCR-011", "phase": "KSD", "type": "통합", "prio": "상",
        "pre": "관리자가 재료/옵션 품절 처리",
        "steps": "1) API-009 품절 ON 2) 키오스크 메뉴/옵션 확인 3) SOLD OUT 표시 4) 대체 선택",
        "expect": "품절 항목 선택 불가, 다른 항목으로 주문 가능",
    },
    {
        "id": "TC-004", "name": "결제 실패 시 원인 안내·장바구니 유지", "sc": "SC-005",
        "api": "API-006", "screen": "SCR-007, SCR-012", "phase": "KSD", "type": "API", "prio": "상",
        "pre": "결제 실패 테스트 모드",
        "steps": "1) 장바구니 담기 2) 결제 3) 실패 응답 4) 안내 확인 5) 장바구니 유지",
        "expect": "실패 원인 표시, 장바구니 유지",
    },
    {
        "id": "TC-005", "name": "결제 성공 및 주문번호 생성", "sc": "SC-004",
        "api": "API-005~006", "screen": "SCR-006~008", "phase": "KSD", "type": "API", "prio": "상",
        "pre": "장바구니 1건 이상",
        "steps": "주문확인→CARD 결제→승인",
        "expect": "payment APPROVED, orderNo 생성",
    },
    {
        "id": "TC-006", "name": "멤버십 스탬프 1회 확인 후 적립", "sc": "SC-006",
        "api": "API-018", "screen": "SCR-007~008", "phase": "KSD", "type": "API", "prio": "하",
        "pre": "멤버십 보유 고객 (확장)",
        "steps": "결제 중 1회 확인→결제 완료→적립 표시",
        "expect": "이중 확인 없이 적립 결과 표시",
    },
    {
        "id": "TC-007", "name": "관리자 주문 상태 변경", "sc": "SC-008",
        "api": "API-007~008", "screen": "SCR-009~010", "phase": "LMIS", "type": "관리자", "prio": "상",
        "pre": "결제 완료 주문 존재",
        "steps": "목록→상세→RECEIVED→PREPARING→COMPLETED",
        "expect": "DB·화면 상태 일치",
    },
    {
        "id": "TC-008", "name": "접근성 옵션 적용 주문", "sc": "SC-013",
        "api": "API-017", "screen": "SCR-014", "phase": "FWD", "type": "화면", "prio": "중",
        "pre": "저시력 고객 시나리오 (후반)",
        "steps": "글자크기 확대→메뉴 탐색→주문 완료",
        "expect": "안내 없이 주문 완료",
    },
    {
        "id": "TC-009", "name": "관리자 로그인 검증", "sc": "—",
        "api": "API-HOLD-001", "screen": "SCR-015", "phase": "LMIS", "type": "관리자", "prio": "중",
        "pre": "관리자 계정 (후반)",
        "steps": "로그인→세션 발급→관리자 화면 진입",
        "expect": "인증 성공/실패 분기 (Notion row 미등록)",
    },
    {
        "id": "TC-010", "name": "관리자 메뉴 목록 조회", "sc": "SC-017",
        "api": "API-011", "screen": "SCR-016", "phase": "LMIS", "type": "관리자", "prio": "중",
        "pre": "관리자 메뉴 관리 화면",
        "steps": "목록 조회→필터/품절 표시 확인",
        "expect": "seed 메뉴 84건 조회",
    },
    {
        "id": "TC-011", "name": "관리자 신규 메뉴 등록", "sc": "SC-017",
        "api": "API-012", "screen": "SCR-017", "phase": "LMIS", "type": "관리자", "prio": "중",
        "pre": "관리자 로그인 (후반)",
        "steps": "메뉴 등록→옵션그룹 연결→저장→키오스크 노출",
        "expect": "키오스크 메뉴 목록 즉시 반영",
    },
    {
        "id": "TC-012", "name": "관리자 판매 항목 품절 관리", "sc": "SC-007",
        "api": "API-009~010", "screen": "SCR-011", "phase": "LMIS", "type": "관리자", "prio": "상",
        "pre": "관리자 품절 화면",
        "steps": "대상 선택→품절 토글→키오스크 반영 확인",
        "expect": "CORE/BASE/DEFAULT/OPTION 품절 규칙 준수",
    },
    {
        "id": "TC-013", "name": "관리자 일별 매출 조회", "sc": "SC-018",
        "api": "API-015", "screen": "SCR-019", "phase": "LMIS", "type": "관리자", "prio": "하",
        "pre": "주문·결제 데이터 존재 (후반)",
        "steps": "기간 선택→일별 매출 조회",
        "expect": "일자별 주문수·금액 표시",
    },
    {
        "id": "TC-014", "name": "최종 통합 리허설(E2E)", "sc": "SC-024",
        "api": "API-001~009", "screen": "SCR-001~011", "phase": "통합테스트", "type": "통합", "prio": "상",
        "pre": "데모 환경 준비",
        "steps": "고객 주문→결제→관리자 확인/상태변경 일괄 시연",
        "expect": "흐름 끊김 없이 시연 가능",
    },
]


def sort_key_id(prefix: str, val: str) -> tuple:
    m = re.search(rf"{prefix}-(\d+)", val)
    return (int(m.group(1)) if m else 999, val)


def _week5_mvp_terms(text: str) -> str:
    """Replace deprecated Day 10 wording with Week 5 MVP."""
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


def gen_requirements() -> str:
    reqs = sorted(
        [r for r in DATA["requirements"] if r.get("status_notion") != "제외"],
        key=lambda r: sort_key_id("", r["id"]),
    )
    by_cat: dict[str, list] = {}
    for r in reqs:
        by_cat.setdefault(r.get("category") or "기타", []).append(r)
    lines = [
        "# ASAK 요구사항 정의서",
        "",
        "> Notion 02. 요구사항 정의 · `notion_data.json` (2026-07-05)",
        "",
        "## 목차",
        "- [Week 5 MVP 범위](#week-5-mvp-범위)",
        "- [요구사항 ID 체계](#요구사항-id-체계)",
        "- [요구사항 목록](#요구사항-목록)",
        "",
        "## Week 5 MVP 범위",
        "",
        "**고객**: 카테고리·메뉴·옵션·장바구니·주문·가상결제·완료",
        "",
        "**관리자**: 주문 목록/상세·상태 변경·판매 항목 품절(옵션)",
        "",
        "**API**: API-001~009 · **DB**: 22테이블(시드 17+MVP주문5)",
        "",
        "## 요구사항 ID 체계",
        "",
        "| 접두사 | 의미 |",
        "|--------|------|",
        "| FWD-* | 고객 키오스크 |",
        "| LMIS-* | 관리자 |",
        "| KSD-* | 통합·결제 무결성 |",
        "| DEV-* | 비기능 |",
        "| RTOS-* | 장치(확장) |",
        "",
        f"## 요구사항 목록 ({len(reqs)}건)",
        "",
        "| ID | 구분 | 우선순위 | 상태 | 요구사항명 | 상세 |",
        "|----|------|----------|------|------------|------|",
    ]
    for cat in ["기능", "화면", "관리자", "비기능", "장치", "DB", "API", "기타"]:
        for r in by_cat.get(cat, []):
            desc = (r.get("description") or "").replace("|", "\\|")[:80]
            lines.append(
                f"| {r['id']} | {r.get('category','')} | {r.get('priority','')} | "
                f"{r.get('status_notion','')} | {r.get('title','')} | {desc} |"
            )
    return "\n".join(lines) + "\n"


def gen_scenarios() -> str:
    wanted = {f"SC-{i:03d}" for i in range(1, 19)}
    scs = sorted(
        [s for s in DATA["scenarios"] if s["id"] in wanted],
        key=lambda s: sort_key_id("SC", s["id"]),
    )
    lines = [
        "# ASAK 사용자 시나리오 명세",
        "",
        "> Notion 03. 사용자 시나리오 · SC-001~018 (2026-07-05)",
        "",
        "## 전체 주문 흐름",
        "",
        "```mermaid",
        "flowchart LR",
        "    A[홈] --> B[먹고가기/포장]",
        "    B --> C[메뉴선택]",
        "    C --> D[옵션선택]",
        "    D --> E[장바구니]",
        "    E --> F[주문확인]",
        "    F --> G[결제]",
        "    G --> H[완료]",
        "    H --> I[관리자 확인]",
        "```",
        "",
        f"## 시나리오 목록 ({len(scs)}건)",
        "",
    ]
    for s in scs:
        lines += [
            f"### {s['id']} {s['title']}",
            "",
            f"- **시작**: {_week5_mvp_terms(s.get('pre_condition', ''))}",
            f"- **종료**: {_week5_mvp_terms(s.get('post_condition', ''))}",
            f"- **기본 흐름**: {_week5_mvp_terms(s.get('normal_flow', ''))}",
            f"- **예외**: {_week5_mvp_terms(s.get('alternative_flow', '') or '—')}",
            f"- **상태**: {s.get('status_notion','')}",
            "",
        ]
        mmd = s.get("mermaid_script") or ""
        if mmd.strip():
            lines += ["```mermaid", mmd.strip(), "```", ""]
    return "\n".join(lines)


def gen_screen_design() -> str:
    figma_block = "\n".join(
        f"| {s['screen_id']} | {s['title']} | {s.get('figma_url') or '*(Figma 예정)*'} | {s.get('status','')} |"
        for s in SCREENS
    )
    return (
        "# ASAK 화면 설계 및 Figma 연동\n\n"
        "> Notion 04. 화면 설계 · SCR-001~019 · Figma 프로토타입 연동 예정 (2026-07-05)\n\n"
        "## Figma 연동\n\n"
        "| 항목 | 내용 |\n|------|------|\n"
        "| 디자인 도구 | Figma (와이어프레임→프로토타입) |\n"
        "| Notion 역할 | SCR 목록·요구사항·API·테스트 추적 |\n"
        "| DevCopilot | Screens 탭 + Wiki 본 문서 |\n"
        "| Week 5 MVP | SCR-001~008 (8/1) + Week 6 SCR-009~011 (고객+관리자+결제실패) |\n\n"
        "## SCR 요약표\n\n"
        "| ID | 화면명 | Figma | 상태 |\n|----|--------|-------|------|\n"
        f"{figma_block}\n\n"
        "## 고객·관리자 흐름\n\n"
        "**고객**: 홈 → 먹고가기/포장 → 메뉴 → 옵션 → 장바구니 → 주문확인 → 결제 → 완료\n\n"
        "**관리자**: 주문관리 → 주문상세 / 품절관리 / (후반) 로그인·메뉴·결제·매출\n\n"
        "---\n\n"
        "## SCR 상세 (SCR-001~019)\n\n"
        + re.sub(r"^# ASAK 키오스크 화면설계.*?\n\n", "", SCREENS_WIKI, count=1, flags=re.DOTALL)
    )


def gen_db() -> str:
    counts = MANIFEST.get("counts", {})
    lines = [
        "# ASAK DB 설계 테이블 정의서",
        "",
        "> Notion 05. DB 설계 · MySQL 3NF 22테이블 · `asak-data/seed/manifest.json`",
        "",
        "## ERD (요약)",
        "",
        "```mermaid",
        "erDiagram",
        "    category ||--o{ menu : has",
        "    menu ||--o{ menu_ingredient : contains",
        "    menu ||--o{ menu_option_group : option_groups",
        "    orders ||--o{ order_item : items",
        "    order_item ||--o{ order_item_option : options",
        "    orders ||--o| payment : paid_by",
        "```",
        "",
        "## 시드 manifest 수치 (v2)",
        "",
        "| 엔티티 | 건수 |",
        "|--------|------|",
    ]
    for k, v in counts.items():
        lines.append(f"| `{k}` | {v:,} |" if isinstance(v, int) and v > 999 else f"| `{k}` | {v} |")
    lines += [
        "",
        "> 주문 5테이블(`orders`~`payment`)은 설계 포함·시드 미포함. API-005/006 구현 시 DDL 추가.",
        "",
        f"## 22테이블 정의 ({len(TABLES)}개)",
        "",
        "| # | 테이블 | 설명 | 연계 REQ |",
        "|---|--------|------|----------|",
    ]
    for i, (name, (desc, req)) in enumerate(TABLES.items(), 1):
        cnt = counts.get(name, "—")
        lines.append(f"| {i} | `{name}` | {desc} (seed: {cnt}) | {req} |")
    lines += [
        "",
        "## MVP 우선순위",
        "",
        "**필수 17**: category~option_item + orders~payment",
        "",
        "**확장 5**: tag, menu_tag, menu_nutrition, option_item_component, payment_method_config",
        "",
        "상세 컬럼·제약조건은 Notion 05. DB 설계 및 DevCopilot ERD 참고.",
        "",
    ]
    return "\n".join(lines)


def _compact_envelope_line(response: str) -> str:
    """Table cell: one-line envelope from notion_data / api_format samples."""
    if not response:
        return "—"
    try:
        obj = json.loads(response)
        if isinstance(obj, dict) and "code" in obj:
            return _compact_json(obj)
    except json.JSONDecodeError:
        pass
    return response.replace("\n", " ")[:80]


def _compact_request_cell(a: dict) -> str:
    """Table cell: query string or compact JSON body."""
    body = (a.get("request_body") or "").strip()
    if body:
        try:
            return _compact_json(json.loads(body))
        except json.JSONDecodeError:
            return body.replace("\n", " ")[:50]
    params = (a.get("request_params") or "").strip()
    if params:
        return params
    legacy = (a.get("request_params") or a.get("request_body") or "").strip()
    return legacy if legacy else "—"


def _api_num(api_id: str) -> int:
    return int(api_id.split("-")[1])


def gen_api() -> str:
    apis = sorted(DATA["apis"], key=lambda a: sort_key_id("API", a["api_id"]))
    apis_kiosk = [a for a in apis if _api_num(a["api_id"]) <= 6]
    apis_admin = [a for a in apis if 7 <= _api_num(a["api_id"]) <= 9]
    all_apis = apis + [a for a in EXTRA_APIS if a["api_id"] not in {x["api_id"] for x in apis}]
    all_apis = sorted(all_apis, key=lambda a: sort_key_id("API", a["api_id"]))

    def _example_block(api_id: str, label: str) -> list[str]:
        row = next((a for a in apis if a["api_id"] == api_id), None)
        if not row:
            return []
        return [
            f"#### {api_id} {label}",
            "",
            "**성공**",
            "",
            "```json",
            row.get("response_success", "").strip(),
            "```",
            "",
            "**실패**",
            "",
            "```json",
            row.get("response_error", "").strip(),
            "```",
            "",
        ]

    def _api_table_rows(api_rows: list) -> list[str]:
        out: list[str] = []
        for a in api_rows:
            req = _compact_request_cell(a).replace("|", "\\|")
            out.append(
                f"| {a['api_id']} | {a['method']} | `{a['endpoint']}` | {req[:60]} | "
                f"`{_compact_envelope_line(a.get('response_success', ''))}` | "
                f"{(a.get('description') or a.get('title', ''))[:50]} |"
            )
        return out

    lines = [
        "# ASAK REST API 명세서",
        "",
        "> API 목록은 Notion DB 참조 — [06. API 명세](https://app.notion.com/p/34651ef04f0b838ca3a481e55eebfb2b)",
        "",
        "> Notion 06. API 명세 · API-001~020 · 공통 응답 `{success,status,code,message,data}`",
        "",
        "> **Week 5 MVP:** 고객 키오스크 주문 흐름(API-001~006) 완성이 최우선. "
        "장치·멤버십·실결제·상세통계는 후반 확장.",
        "",
        "## 작성 체크리스트",
        "",
        "- [ ] API ID를 작성했는가?",
        "- [ ] Method와 URL이 명확한가?",
        "- [ ] Request Body 또는 Query String 예시가 있는가?",
        "- [ ] 성공 Response Body 예시가 있는가?",
        "- [ ] 실패 Response Body 예시가 있는가?",
        "- [ ] 모든 응답이 `success`, `status`, `code`, `message`, `data` 구조를 따르는가?",
        "- [ ] 관련 테이블을 적었는가?",
        "- [ ] 처리 내용을 단계별로 적었는가?",
        "- [ ] 화면 설계와 연결되는 API인지 확인했는가?",
        "- [ ] Week 5 MVP 범위 밖 API를 9주 로드맵의 확장 기능으로 분리했는가?",
        "",
        "## Part 0 — 공통",
        "",
        "### ApiResponse envelope",
        "",
        "모든 API 성공/실패 응답은 아래 필드를 포함한다. **비즈니스 payload는 `data`에만** 둔다.",
        "",
        "```json",
        '{ "success": true, "status": 200, "code": "...", "message": "...", "data": {} }',
        "```",
        "",
        "### 인증·공통 헤더·에러 처리",
        "",
        "- Week 5 MVP(API-001~009): 별도 인증 없음. 관리자 API는 후반 JWT/세션 적용 예정.",
        "- 공통 헤더: `Content-Type: application/json` (POST/PATCH), `Accept: application/json`",
        "- 에러: HTTP status + `success=false` envelope. `code`로 프론트 분기.",
        "",
        "### envelope 예시",
        "",
    ]
    for api_id, label in [
        ("API-001", "카테고리 목록"),
        ("API-005", "주문 생성"),
        ("API-006", "결제 승인"),
        ("API-007", "관리자 주문 목록"),
    ]:
        lines.extend(_example_block(api_id, label))
    lines += [
        "## 읽기 순서",
        "",
        "1. **Part 0 — 공통** — envelope · 인증·헤더·에러",
        "2. **Part 1 — 고객 키오스크 (Week 5 MVP)** — API-001~006",
        "3. **Part 2 — 관리자 (Week 6)** — API-007~009",
        "4. **Part 3 — Week 7~8 확장** — API-010~020",
        "",
        "## Part 1 — 고객 키오스크 (Week 5 MVP)",
        "",
        "키오스크 흐름: **카테고리 → 메뉴목록 → 메뉴상세 → 옵션 → 주문생성 → 결제**",
        "",
        "| ID | Method | Endpoint | Request | Success (전체 envelope, data=payload) | 설명 |",
        "|----|--------|----------|---------|---------------------------------------|------|",
    ]
    lines.extend(_api_table_rows(apis_kiosk))
    lines += [
        "",
        "## Part 2 — 관리자 (Week 6)",
        "",
        "| ID | Method | Endpoint | Request | Success (전체 envelope, data=payload) | 설명 |",
        "|----|--------|----------|---------|---------------------------------------|------|",
    ]
    lines.extend(_api_table_rows(apis_admin))
    lines += [
        "",
        "## Part 3 — Week 7~8 확장 (API-010~020)",
        "",
        "| ID | Method | Endpoint | REQ | 설명 |",
        "|----|--------|----------|-----|------|",
    ]
    for a in all_apis:
        if _api_num(a["api_id"]) < 10:
            continue
        req = _compact_request_cell(a).replace("|", "\\|")
        lines.append(
            f"| {a['api_id']} | {a['method']} | `{a['endpoint']}` | {req[:50]} | "
            f"{(a.get('description') or a.get('title', ''))[:55]} |"
        )
    lines += [
        "",
        "## 상태값 (common_code)",
        "",
        "| 구분 | 코드 |",
        "|------|------|",
        "| 주문상태 | RECEIVED, PREPARING, COMPLETED |",
        "| 결제상태 | READY, APPROVED, FAILED |",
        "| 주문유형 | EAT_IN, TAKE_OUT |",
        "",
        "상세 request/response JSON은 Notion 06. API 명세 본문 참고.",
        "",
    ]
    return "\n".join(lines)


def gen_wbs() -> str:
    tasks = [t for t in DATA["tasks"] if not t["task_id"].startswith("WBS-EXT")]
    tasks = sorted(tasks, key=lambda t: sort_key_id("WBS", t["task_id"]))
    lines = [
        "# ASAK WBS 및 일정 계획",
        "",
        "> Notion 01·07 · 9주 (7/2~9/2) · Week 5 MVP (8/1) + 9/2 최종 발표 (2026-07-06)",
        "",
        "## 9주 로드맵",
        "",
        "| Week | 날짜 (평일) | 목표 | 산출물 (현실적 분량) |",
        "|------|-------------|------|----------------------|",
        "| Week 1 | 7/2(수)~7/4(금) · 3일 | 기획·Notion·시드·ERD — 설계만 | WBS-001~006, ERD, API 명세 초안, 시드 JSON |",
        "| Week 2 | 7/7(월)~7/11(금) | API/FE 골격 + 금 0.5일 연동 스모크 | API-001~002 골격, SCR 와이어·컴포넌트 뼈대 |",
        "| Week 3 | 7/14(월)~7/18(금) | 키오스크 (1) | SCR-001~002, API-001~002 |",
        "| Week 4 | 7/21(월)~7/25(금) | 키오스크 (2) | SCR-003~004, API-003~004 |",
        "| Week 5 | 7/28(월)~8/1(금) | **MVP** | SCR-001~008, API-001~006, 8/1 E2E 1일 |",
        "| Week 6 | 8/4(월)~8/8(금) | 관리자 | SCR-009~011, API-007~009 |",
        "| Week 7 | 8/11(월)~8/13(수) · **3일** | **스모크 QA만 (필수)** | TC-001~008 + 관리자 최소 |",
        "| Week 8 | 8/25(화)~8/28(금) | 통합 E2E + 리허설 | TC-014, 회귀·시연 (DevCopilot·문서는 여유 시) |",
        "| Week 9 | 8/31(월)~9/2(수) | 발표 준비·**9/2 발표** | 발표자료, 최종 시연 |",
        "",
        "> **8/15(금) 광복절** 휴일. Week 7: 8/14~8/22 DevCopilot·문서는 선택 또는 Week 8 이관.",
        "",
        f"## WBS 작업표 ({len(tasks)}건)",
        "",
        "| ID | 작업명 | 담당 | 시작 | 종료 | 상태 |",
        "|----|--------|------|------|------|------|",
    ]
    for t in tasks:
        lines.append(
            f"| {t['task_id']} | {t.get('title','')} | {t.get('assignee','')} | "
            f"{t.get('start_date','')} | {t.get('end_date','')} | {t.get('status_notion','')} |"
        )
    return "\n".join(lines) + "\n"


def gen_qa() -> str:
    lines = [
        "# ASAK QA 테스트 케이스",
        "",
        "> Notion 09. 테스트/오류 관리 · TC-001~014 (2026-07-05)",
        "",
        "## 테스트 범위",
        "",
        "- **Week 5 MVP**: API-001~009, 고객 주문 E2E · **Week 6**: 관리자 주문/품절",
        "- **확장**: API-010~020, 접근성·멤버십·매출",
        "",
        "## TC 목록",
        "",
        "| ID | 테스트명 | SC | API | 화면 | 단계 | 우선 | 기대 결과 |",
        "|----|----------|----|----|------|------|------|-----------|",
    ]
    for t in TEST_CASES:
        lines.append(
            f"| {t['id']} | {t['name']} | {t['sc']} | {t['api']} | {t['screen']} | "
            f"{t['phase']} | {t['prio']} | {t['expect'][:40]} |"
        )
    lines += ["", "## TC 상세", ""]
    for t in TEST_CASES:
        lines += [
            f"### {t['id']} {t['name']}",
            "",
            f"- **전제조건**: {t['pre']}",
            f"- **수행 절차**: {t['steps']}",
            f"- **기대 결과**: {t['expect']}",
            f"- **관련**: {t['sc']} · {t['api']} · {t['screen']}",
            "",
        ]
    return "\n".join(lines)


def gen_meeting() -> str:
    return """# ASAK 회의록 및 최종 배포 검증

> Notion 10. 회의록 + 11. 최종 제출 체크리스트 (2026-07-05)

## 회의록

### 2026-07-03 키오스크 컨셉 회의

| 항목 | 내용 |
|------|------|
| 참석 | 하진, 유진, 나연 |
| 결정 | 서비스명 **ASAK/아삭**, Week 5 MVP = 고객 주문 (SCR-001~008, 8/1) + Week 6 관리자 확인, KVS/매출/멤버십 보류 |
| 디자인 | Primary #16A34A, Crunch Yellow #FACC15, Cream #FFFDF3 |
| 다음 | Figma 팔레트, 화면 흐름도, MVP DB/API, 와이어프레임 |

**MVP 고객**: 홈~결제완료 8화면 · **관리자**: 주문목록/상세/상태/품절

---

## 11. 최종 제출 체크리스트

### 필수 산출물

| 산출물 | 위치 | 상태 |
|--------|------|------|
| 요구사항 정의서 | Notion 02 / Wiki | 완료 |
| 사용자 시나리오 | Notion 03 SC-001~018 | 완료 |
| 화면 설계서 | Notion 04 SCR-001~019 | 진행중 |
| ERD·테이블 정의 | Notion 05 · 22테이블 | 완료 |
| API 명세 | Notion 06 API-001~020 | 완료 |
| React/Spring | GitHub ASAK-front/back | 예정 |
| MySQL seed | asak-data/seed | 진행중 |
| 테스트 결과 | Notion 09 TC-001~014 | 진행중 |
| README | ASAK/README.md | 완료 |

### 시연 체크리스트

- [ ] 관리자 데이터 등록
- [ ] 키오스크 목록 조회
- [ ] 손님 주문 (SC-001)
- [ ] 결제 (SC-004)
- [ ] 완료 화면·주문번호
- [ ] 관리자 주문 확인·상태 변경
- [ ] 품절 비활성화 (SC-003)
- [ ] 재방문 5단계 이내 주문 (SC-002)

### DevCopilot Wiki 검증

1. https://devcopilot.ai.kr/workspace/2/wiki 접속
2. 산출물 8개 Wiki 문서 제목·내용 확인
3. Requirements / APIs / WBS 탭과 ID 추적성 대조

### Notion 문서 완성 (2026-07-05)

- [x] API-001~020 정합
- [x] SC-001~018 Mermaid
- [x] DB ERD 22테이블
- [x] WBS·테스트 Relation 컬럼
- [ ] Figma 프로토타입 (Notion 밖)
- [ ] React/Spring 구현 (Notion 밖)
"""


def gen_readme(ids: dict[str, int]) -> str:
    base = "https://devcopilot.ai.kr/workspace/2/wiki"
    rows = [
        ("ASAK 요구사항 정의서", "requirements-definition.md"),
        ("ASAK 사용자 시나리오 명세", "user-scenarios.md"),
        ("ASAK 화면 설계 및 Figma 연동", "screen-design-figma.md"),
        ("ASAK DB 설계 테이블 정의서", "db-table-definition.md"),
        ("ASAK REST API 명세서", "rest-api-spec.md"),
        ("ASAK WBS 및 일정 계획", "wbs-schedule.md"),
        ("ASAK QA 테스트 케이스", "qa-test-cases.md"),
        ("ASAK 회의록 및 최종 배포 검증", "meeting-deliverables-checklist.md"),
        ("ASAK 종합 기획서 요약", "asak-planning-summary.md"),
        ("ASAK 기술스택 요약", "tech-stack-summary.md"),
        ("ASAK DB/API 개요", "db-api-overview.md"),
    ]
    lines = [
        "# ASAK DevCopilot Wiki Index",
        "",
        "> workspace 2 · https://devcopilot.ai.kr/workspace/2/wiki",
        "",
        "## 산출물 Wiki (학원 체크리스트)",
        "",
        "| Wiki 제목 | 로컬 md | DevCopilot URL |",
        "|-----------|---------|----------------|",
    ]
    for title, md in rows[:8]:
        wid = ids.get(title, "—")
        url = f"{base}/{wid}" if isinstance(wid, int) else "—"
        lines.append(f"| {title} | [{md}](./{md}) | {url} |")
    lines += [
        "",
        "## 기존 Wiki",
        "",
        "| Wiki 제목 | md |",
        "|-----------|-----|",
    ]
    for title, md in rows[8:]:
        wid = ids.get(title, "—")
        url = f"{base}/{wid}" if isinstance(wid, int) else "—"
        lines.append(f"| {title} | [{md}](./{md}) | {url} |")
    lines += [
        "",
        "## 업로드",
        "",
        "```powershell",
        "python asak-data/scripts/upload_wiki.py --title \"ASAK 요구사항 정의서\" --file docs/wiki/requirements-definition.md",
        "```",
        "",
    ]
    return "\n".join(lines)


FILES = {
    "requirements-definition.md": gen_requirements,
    "user-scenarios.md": gen_scenarios,
    "screen-design-figma.md": gen_screen_design,
    "db-table-definition.md": gen_db,
    "rest-api-spec.md": gen_api,
    "wbs-schedule.md": gen_wbs,
    "qa-test-cases.md": gen_qa,
    "meeting-deliverables-checklist.md": gen_meeting,
}


def main() -> None:
    WIKI.mkdir(parents=True, exist_ok=True)
    for name, fn in FILES.items():
        path = WIKI / name
        content = fn()
        if path.exists() and path.read_text(encoding="utf-8") == content:
            print(f"Skip {path} (unchanged)")
            continue
        path.write_text(content, encoding="utf-8")
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()
