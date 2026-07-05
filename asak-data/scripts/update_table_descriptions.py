#!/usr/bin/env python3
"""Update DevCopilot table descriptions with REQ IDs for workspace 2."""
from __future__ import annotations

import json
import sys
import time

import requests

BASE = "https://devproject-hub-backend.onrender.com"
WS = 2
HEADERS = {"Content-Type": "application/json", "x-user-username": "hagenie128"}

# table_name -> (description body without REQ suffix, REQ id)
TABLE_DESCRIPTIONS: dict[str, tuple[str, str]] = {
    "category": (
        "카테고리 마스터. 신메뉴/샌드위치/샐러디·볼/랩/프로틴/기타 6개 분류",
        "FWD-MENU-001",
    ),
    "code_group": (
        "공통코드 그룹. ORDER_STATUS·PAYMENT_METHOD 등 확장 가능 상태값 그룹",
        "KSD-ARCH-001",
    ),
    "common_code": (
        "공통코드 상세. 주문상태·결제수단·옵션유형·재료역할 등 API 코드값",
        "KSD-ARCH-001",
    ),
    "tag": (
        "메뉴 태그 마스터. BEST/NEW/저당 등 메뉴 배지 분류",
        "FWD-MENU-013",
    ),
    "menu": (
        "판매 메뉴 마스터. ASAK 키오스크 카테고리별 메뉴·가격·이미지·품절",
        "FWD-MENU-001",
    ),
    "menu_tag": (
        "메뉴-태그 N:M 연결. 베스트/신규 태그를 메뉴에 부착",
        "FWD-MENU-013",
    ),
    "menu_nutrition": (
        "메뉴 영양정보. 1인분 kcal·단백질·탄수화물·지방·나트륨 요약",
        "FWD-MENU-009",
    ),
    "ingredient": (
        "재료 마스터. 채소·단백질·드레싱·베이스 등 메뉴 구성 재료와 품절",
        "FWD-MENU-003",
    ),
    "allergen": (
        "알레르기 항목 마스터. 우유·대두·밀 등 14종 알레르기 정보",
        "FWD-MENU-008",
    ),
    "ingredient_allergen": (
        "재료-알레르기 N:M 연결. 재료별 알레르기 유발 성분 매핑",
        "FWD-MENU-008",
    ),
    "menu_ingredient": (
        "메뉴 기본 재료 연결. 기본 포함량·제외 가능 여부·역할(CORE/BASE)",
        "FWD-MENU-003",
    ),
    "option_group": (
        "옵션그룹 마스터. 드레싱/토핑/베이스/세트 사이드·음료 그룹 정의",
        "FWD-MENU-003",
    ),
    "menu_option_group": (
        "메뉴-옵션그룹 연결. 메뉴별 노출 옵션그룹·필수 여부·표시 순서",
        "FWD-MENU-003",
    ),
    "menu_option": (
        "메뉴별 옵션항목 설정. 추천 드레싱·기본 선택·메뉴당 옵션 노출",
        "FWD-MENU-004",
    ),
    "option_item": (
        "옵션 선택 항목. 추가 금액·제공량·품절·재료 기반 옵션",
        "FWD-MENU-003",
    ),
    "option_item_component": (
        "세트 옵션 구성품. SET_SIDE/SET_DRINK 세트 내 사이드·음료 구성",
        "LMIS-MENU-006",
    ),
    "payment_method_config": (
        "키오스크 결제수단 설정. 카드/간편결제 노출·정렬·활성 여부",
        "FWD-PAY-001",
    ),
    "orders": (
        "주문 마스터 테이블. 고객 주문 1건의 헤더·주문번호·유형·상태·총액",
        "FWD-ORDER-001",
    ),
    "order_item": (
        "주문 상세(메뉴 단위). 주문 시점 메뉴·수량·단가 스냅샷",
        "LMIS-ORDER-004",
    ),
    "order_item_option": (
        "주문상세별 선택 옵션. 토핑·드레싱·세트 선택 내역과 단가 스냅샷",
        "LMIS-ORDER-004",
    ),
    "item_exclusion": (
        "제외 재료 기록. 고객이 빼기(-) 선택한 기본 재료 목록",
        "FWD-MENU-007",
    ),
    "payment": (
        "결제 내역. 주문별 결제수단·승인 상태·금액·승인 시각",
        "FWD-PAY-001",
    ),
}

SERVER_IDS: dict[str, int] = {
    "category": 41, "code_group": 42, "common_code": 43, "tag": 44,
    "menu": 45, "menu_tag": 46, "menu_nutrition": 47, "ingredient": 48,
    "allergen": 49, "ingredient_allergen": 50, "menu_ingredient": 51,
    "option_group": 52, "menu_option_group": 53, "menu_option": 54,
    "option_item": 55, "option_item_component": 56, "payment_method_config": 57,
    "orders": 58, "order_item": 59, "order_item_option": 60,
    "item_exclusion": 61, "payment": 62,
}


def api(method: str, path: str, **kwargs) -> requests.Response:
    url = f"{BASE}{path}"
    for attempt in range(3):
        try:
            r = requests.request(method, url, headers=HEADERS, timeout=120, **kwargs)
            if r.status_code >= 500 and attempt < 2:
                time.sleep(3)
                continue
            return r
        except requests.RequestException:
            if attempt == 2:
                raise
            time.sleep(3)
    raise RuntimeError("unreachable")


def full_description(name: str) -> str:
    body, req = TABLE_DESCRIPTIONS[name]
    return f"{body} ({req})"


def main() -> None:
    tables = api("GET", f"/api/workspaces/{WS}/tables").json()
    by_id = {t["id"]: t for t in tables}
    samples: list[dict] = []
    failed: list[str] = []
    ok = 0

    print("PUT API: /api/workspaces/{id}/tables/{table_id}")
    print("Body: {\"name\": \"...\", \"description\": \"...\"}\n")

    for name, sid in sorted(SERVER_IDS.items(), key=lambda x: x[1]):
        if sid not in by_id:
            failed.append(f"{name} id={sid}: not found on server")
            continue
        tbl = by_id[sid]
        old = tbl.get("description") or ""
        new = full_description(name)
        if old == new:
            print(f"  SKIP {name} ({sid}): unchanged")
            ok += 1
            continue
        body = {"name": name, "description": new}
        r = api("PUT", f"/api/workspaces/{WS}/tables/{sid}", json=body)
        if r.status_code not in (200, 201):
            failed.append(f"{name} id={sid}: {r.status_code} {r.text[:120]}")
            print(f"FAIL {name}: {r.status_code}", file=sys.stderr)
            sys.exit(1)
        ok += 1
        print(f"  OK {name} ({sid})")
        if len(samples) < 5:
            samples.append({"name": name, "id": sid, "before": old, "after": new})

    report = {"updated": ok, "failed": failed, "samples": samples}
    out = __file__.replace("update_table_descriptions.py", "table_update_report.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\n=== Done: {ok}/22 tables ===")
    if failed:
        print("FAILED:", failed)
    print("\n=== Samples (before -> after) ===")
    for s in samples:
        print(f"  [{s['name']} id={s['id']}]")
        print(f"    BEFORE: {s['before']}")
        print(f"    AFTER:  {s['after']}")


if __name__ == "__main__":
    main()
