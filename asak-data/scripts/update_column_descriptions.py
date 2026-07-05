#!/usr/bin/env python3
"""Update DevCopilot column descriptions for workspace 2 tables 41-62."""
from __future__ import annotations

import json
import sys
import time
from typing import Any

import requests

BASE = "https://devproject-hub-backend.onrender.com"
WS = 2
HEADERS = {"Content-Type": "application/json", "x-user-username": "hagenie128"}

TABLE_REQ: dict[str, str] = {
    "category": "FWD-MENU-001",
    "code_group": "KSD-ARCH-001",
    "common_code": "KSD-ARCH-001",
    "tag": "FWD-MENU-013",
    "menu": "FWD-MENU-001",
    "menu_tag": "FWD-MENU-013",
    "menu_nutrition": "FWD-MENU-009",
    "ingredient": "FWD-MENU-003",
    "allergen": "FWD-MENU-008",
    "ingredient_allergen": "FWD-MENU-008",
    "menu_ingredient": "FWD-MENU-003",
    "option_group": "FWD-MENU-003",
    "menu_option_group": "FWD-MENU-003",
    "menu_option": "FWD-MENU-003",
    "option_item": "FWD-MENU-003",
    "option_item_component": "LMIS-MENU-006",
    "payment_method_config": "LMIS-PAY-001",
    "orders": "LMIS-ORDER-004",
    "order_item": "LMIS-ORDER-004",
    "order_item_option": "LMIS-ORDER-004",
    "item_exclusion": "FWD-MENU-007",
    "payment": "FWD-PAY-001",
}

# (table_name, column_name) -> description body without REQ suffix
COLUMN_DESC: dict[tuple[str, str], str] = {
    # category
    ("category", "id"): "카테고리 테이블 기본키. BIGINT 자동 증가",
    ("category", "name"): "카테고리 표시명. 예: 샌드위치, 샐러디·볼. NOT NULL, UNIQUE 권장",
    ("category", "sort_order"): "키오스크 카테고리 탭 표시 순서. 0부터 오름차순. 작을수록 왼쪽",
    ("category", "is_active"): "카테고리 노출 여부. true=주문 화면에 표시, false=숨김",
    # code_group
    ("code_group", "id"): "공통코드 그룹 기본키. BIGINT 자동 증가",
    ("code_group", "group_code"): "코드그룹 식별자. 예: ORDER_STATUS, PAYMENT_METHOD. UNIQUE",
    ("code_group", "name"): "코드그룹 한글명. 예: 주문상태, 결제수단",
    # common_code
    ("common_code", "id"): "공통코드 기본키. BIGINT 자동 증가",
    ("common_code", "code_group_id"): "소속 코드그룹 FK. code_group.id 참조. 1:N",
    ("common_code", "code"): "API/프론트 전달 코드값. 예: RECEIVED, CARD. (code_group_id, code) UNIQUE",
    ("common_code", "name"): "화면 표시명. 예: 접수, 카드결제",
    ("common_code", "sort_order"): "코드 목록 정렬 순서. 0부터 오름차순",
    ("common_code", "is_active"): "코드 사용 여부. true=선택 가능, false=비활성",
    # tag
    ("tag", "id"): "메뉴 태그 기본키. BIGINT 자동 증가",
    ("tag", "code"): "태그 코드. 예: BEST, NEW, LOW_SUGAR. UNIQUE",
    ("tag", "name"): "태그 표시명. 예: 베스트, 신규, 저당",
    ("tag", "color_hex"): "태그 배지 색상. HEX 형식. 예: #FF5733. NULL=기본색",
    ("tag", "is_active"): "태그 사용 여부. true=메뉴에 부착 가능",
    # menu
    ("menu", "id"): "메뉴 기본키. BIGINT 자동 증가",
    ("menu", "category_id"): "소속 카테고리 FK. category.id 참조",
    ("menu", "category.id"): "소속 카테고리 FK. category.id 참조. 1:N",
    ("menu", "name"): "키오스크 메뉴 표시명. 예: 스파이시 쉬림프 샌드위치",
    ("menu", "price"): "기본 판매가. 단위: 원(KRW). 옵션 추가 전 가격. 예: 8900",
    ("menu", "image_url"): "메뉴 썸네일 이미지 URL. NULL=이미지 없음",
    ("menu", "description"): "메뉴 설명 문구. 상세 화면에 표시. NULL=설명 없음",
    ("menu", "is_sold_out"): "메뉴 직접 품절 여부. true=주문 불가(품절 표시), false=판매중",
    ("menu", "created_at"): "메뉴 등록 일시. TIMESTAMP. DEFAULT CURRENT_TIMESTAMP",
    ("menu", "updated_at"): "메뉴 최종 수정 일시. TIMESTAMP. ON UPDATE",
    # menu_tag
    ("menu_tag", "id"): "메뉴-태그 연결 기본키. BIGINT 자동 증가",
    ("menu_tag", "menu_id"): "연결 메뉴 FK. menu.id 참조",
    ("menu_tag", "menu.id"): "연결 메뉴 FK. menu.id 참조",
    ("menu_tag", "tag_id"): "연결 태그 FK. tag.id 참조",
    ("menu_tag", "tag.id"): "연결 태그 FK. tag.id 참조",
    # menu_nutrition
    ("menu_nutrition", "id"): "메뉴 영양정보 기본키. BIGINT 자동 증가",
    ("menu_nutrition", "menu_id"): "연결된 메뉴 FK. menu.id 참조. 메뉴당 1건 권장",
    ("menu_nutrition", "menu.id"): "연결된 메뉴 FK. menu.id 참조. 메뉴당 1건 권장",
    ("menu_nutrition", "kcal"): "메뉴 1회 제공 기준 열량. 단위: kcal(킬로칼로리). 예: 464. NULL=미등록",
    ("menu_nutrition", "protein_g"): "단백질 함량. 단위: g(그램). 예: 18.4. NULL=미등록",
    ("menu_nutrition", "carb_g"): "탄수화물 함량. 단위: g(그램). 예: 55.4. NULL=미등록",
    ("menu_nutrition", "fat_g"): "지방 함량. 단위: g(그램). 예: 18.5. NULL=미등록",
    ("menu_nutrition", "sodium_mg"): "나트륨 함량. 단위: mg(밀리그램). 예: 1176. NULL=미등록",
    ("menu_nutrition", "source_id"): "영양정보 출처 코드 FK. common_code.id 참조. NULL=출처 미지정",
    # ingredient
    ("ingredient", "id"): "재료 마스터 기본키. BIGINT 자동 증가",
    ("ingredient", "name"): "재료명. 예: 로메인, 그릭 요거트. UNIQUE",
    ("ingredient", "type_id"): "재료 유형 코드 FK. common_code.id (INGREDIENT_TYPE). 예: VEGGIE, PROTEIN",
    ("ingredient", "kcal"): "재료 1단위 기준 열량. 단위: kcal. NULL=미측정",
    ("ingredient", "protein_g"): "재료 1단위 기준 단백질. 단위: g. NULL=미측정",
    ("ingredient", "is_sold_out"): "재료 품절 여부. true=해당 재료 포함 메뉴 주문 제한",
    # allergen
    ("allergen", "id"): "알레르기 기본키. BIGINT 자동 증가",
    ("allergen", "name"): "알레르기 항목명. 예: 우유, 대두, 밀. UNIQUE",
    # ingredient_allergen
    ("ingredient_allergen", "id"): "재료-알레르기 연결 기본키",
    ("ingredient_allergen", "ingredient_id"): "재료 FK. ingredient.id 참조",
    ("ingredient_allergen", "ingredient.id"): "재료 FK. ingredient.id 참조",
    ("ingredient_allergen", "allergen_id"): "알레르기 FK. allergen.id 참조",
    ("ingredient_allergen", "allergen.id"): "알레르기 FK. allergen.id 참조",
    # menu_ingredient
    ("menu_ingredient", "id"): "메뉴-재료 연결 기본키",
    ("menu_ingredient", "menu_id"): "메뉴 FK. menu.id 참조",
    ("menu_ingredient", "menu.id"): "메뉴 FK. menu.id 참조",
    ("menu_ingredient", "ingredient_id"): "재료 FK. ingredient.id 참조",
    ("menu_ingredient", "ingredient.id"): "재료 FK. ingredient.id 참조",
    ("menu_ingredient", "role_id"): "재료 역할 코드 FK. CORE/BASE/DEFAULT (common_code)",
    ("menu_ingredient", "quantity"): "기본 제공량. DECIMAL. NULL=수량 미지정",
    ("menu_ingredient", "unit_id"): "수량 단위 코드 FK. g/ml/ea (common_code). NULL=단위 없음",
    ("menu_ingredient", "is_default"): "기본 포함 여부. true=기본 제공 재료",
    ("menu_ingredient", "can_remove"): "고객 제외 가능 여부. true=재료 빼기(-) 옵션 가능",
    ("menu_ingredient", "sort_order"): "메뉴 상세 화면 재료 표시 순서. 0부터",
    # option_group
    ("option_group", "id"): "옵션그룹 기본키. BIGINT 자동 증가",
    ("option_group", "name"): "옵션그룹명. 예: 드레싱 선택, 토핑 추가",
    ("option_group", "group_type_id"): "옵션그룹 유형 FK. TOPPING/DRESSING/BASE/SET_SIDE 등",
    ("option_group", "min_select"): "최소 선택 수. 0=선택 안 해도 됨",
    ("option_group", "max_select"): "최대 선택 수. 1=단일 선택, 2+=다중 선택",
    # menu_option_group
    ("menu_option_group", "id"): "메뉴-옵션그룹 연결 기본키",
    ("menu_option_group", "menu_id"): "메뉴 FK. menu.id 참조",
    ("menu_option_group", "menu.id"): "메뉴 FK. menu.id 참조",
    ("menu_option_group", "option_group_id"): "옵션그룹 FK. option_group.id 참조",
    ("menu_option_group", "option_group.id"): "옵션그룹 FK. option_group.id 참조",
    ("menu_option_group", "sort_order"): "메뉴 상세 내 옵션그룹 표시 순서",
    ("menu_option_group", "is_required"): "해당 메뉴에서 필수 선택 여부. true=반드시 선택",
    # menu_option
    ("menu_option", "id"): "메뉴별 옵션항목 설정 기본키",
    ("menu_option", "menu_id"): "메뉴 FK. menu.id 참조",
    ("menu_option", "menu.id"): "메뉴 FK. menu.id 참조",
    ("menu_option", "option_item_id"): "옵션항목 FK. option_item.id 참조",
    ("menu_option", "option_item.id"): "옵션항목 FK. option_item.id 참조",
    ("menu_option", "is_recommended"): "추천 옵션 여부. true=추천 드레싱 등 배지 표시",
    ("menu_option", "is_default"): "기본 선택 여부. true=옵션 화면 진입 시 미리 선택",
    ("menu_option", "sort_order"): "해당 메뉴 내 옵션항목 표시 순서",
    ("menu_option", "is_active"): "해당 메뉴에서 옵션 노출 여부. false=숨김",
    # option_item
    ("option_item", "id"): "옵션항목 기본키. BIGINT 자동 증가",
    ("option_item", "option_group_id"): "소속 옵션그룹 FK. option_group.id 참조",
    ("option_item", "option_group.id"): "소속 옵션그룹 FK. option_group.id 참조",
    ("option_item", "ingredient_id"): "재료 기반 옵션일 때 FK. ingredient.id. NULL=세트/요청사항 등",
    ("option_item", "ingredient.id"): "재료 기반 옵션일 때 FK. ingredient.id. NULL=비재료 옵션",
    ("option_item", "name"): "옵션항목 표시명. 예: 발사믹 드레싱, 아보카도 추가",
    ("option_item", "extra_price"): "옵션 추가 금액. 단위: 원(KRW). 0=무료. 예: 500",
    ("option_item", "original_price"): "할인 전 금액. 단위: 원. NULL=할인 없음",
    ("option_item", "amount"): "제공량. DECIMAL. NULL=수량 미표시",
    ("option_item", "unit_id"): "제공량 단위 코드 FK. g/ml/ea. NULL=단위 없음",
    ("option_item", "icon_url"): "옵션 아이콘/이미지 URL. NULL=아이콘 없음",
    ("option_item", "color_hex"): "옵션 대표 색상 HEX. NULL=기본색",
    ("option_item", "is_sold_out"): "옵션 품절 여부. true=선택 불가",
    ("option_item", "created_at"): "옵션항목 등록 일시",
    ("option_item", "updated_at"): "옵션항목 수정 일시",
    # option_item_component
    ("option_item_component", "id"): "세트 구성품 기본키",
    ("option_item_component", "option_item_id"): "세트 옵션항목 FK. option_item.id",
    ("option_item_component", "option_item.id"): "세트 옵션항목 FK. option_item.id",
    ("option_item_component", "ingredient_id"): "구성 재료 FK. ingredient.id. NULL=이름만 있는 구성품",
    ("option_item_component", "ingredient.id"): "구성 재료 FK. ingredient.id",
    ("option_item_component", "name"): "구성품명. 예: 감자칩, 제로콜라",
    ("option_item_component", "quantity"): "구성 수량. DECIMAL. NULL=수량 미지정",
    ("option_item_component", "unit_id"): "구성 수량 단위 FK. NULL=단위 없음",
    ("option_item_component", "sort_order"): "세트 내 구성품 표시 순서",
    # payment_method_config
    ("payment_method_config", "id"): "결제수단 설정 기본키",
    ("payment_method_config", "method_id"): "결제수단 코드 FK. common_code.id (PAYMENT_METHOD)",
    ("payment_method_config", "name"): "키오스크 결제수단 표시명. 예: 카드, 간편결제",
    ("payment_method_config", "is_active"): "결제수단 노출 여부. true=결제 화면에 표시",
    ("payment_method_config", "sort_order"): "결제수단 버튼 표시 순서. 0부터",
    # orders
    ("orders", "id"): "주문 헤더 기본키. BIGINT 자동 증가",
    ("orders", "order_no"): "고객에게 표시되는 주문번호. VARCHAR UNIQUE. 예: A-20260705-001",
    ("orders", "order_type_id"): "주문유형 코드 FK. EAT_IN(먹고가기)/TAKE_OUT(포장)",
    ("orders", "status_id"): "주문상태 코드 FK. RECEIVED/PREPARING/COMPLETED 등",
    ("orders", "total_price"): "주문 총액. 단위: 원(KRW). 옵션·수량 반영 후 합계",
    ("orders", "created_at"): "주문 생성 일시. TIMESTAMP",
    # order_item
    ("order_item", "id"): "주문 상세(메뉴 단위) 기본키",
    ("order_item", "order_id"): "주문 헤더 FK. orders.id 참조",
    ("order_item", "orders.id"): "주문 헤더 FK. orders.id 참조",
    ("order_item", "menu_id"): "주문 메뉴 FK. menu.id 참조",
    ("order_item", "menu.id"): "주문 메뉴 FK. menu.id 참조",
    ("order_item", "quantity"): "메뉴 수량. INT. DEFAULT 1. 예: 2",
    ("order_item", "price"): "주문 시점 메뉴 단가 스냅샷. 단위: 원. 가격 변동 보존용",
    # order_item_option
    ("order_item_option", "id"): "주문상세별 선택 옵션 기본키",
    ("order_item_option", "order_item_id"): "주문상세 FK. order_item.id 참조",
    ("order_item_option", "order_item.id"): "주문상세 FK. order_item.id 참조",
    ("order_item_option", "option_item_id"): "선택 옵션 FK. option_item.id 참조",
    ("order_item_option", "option_item.id"): "선택 옵션 FK. option_item.id 참조",
    ("order_item_option", "quantity"): "옵션 수량. INT. 토핑 개별 수량 조절 시 사용",
    ("order_item_option", "price"): "주문 시점 옵션 단가 스냅샷. 단위: 원",
    # item_exclusion
    ("item_exclusion", "id"): "제외 재료 기록 기본키",
    ("item_exclusion", "order_item_id"): "주문상세 FK. order_item.id 참조",
    ("item_exclusion", "order_item.id"): "주문상세 FK. order_item.id 참조",
    ("item_exclusion", "ingredient_id"): "고객이 제외한 기본 재료 FK. ingredient.id",
    ("item_exclusion", "ingredient.id"): "고객이 제외한 기본 재료 FK. ingredient.id",
    # payment
    ("payment", "id"): "결제 내역 기본키",
    ("payment", "order_id"): "주문 FK. orders.id 참조. 주문당 1건 권장",
    ("payment", "orders.id"): "주문 FK. orders.id 참조",
    ("payment", "method_id"): "결제수단 코드 FK. common_code.id (CARD 등)",
    ("payment", "status_id"): "결제상태 코드 FK. READY/APPROVED/FAILED",
    ("payment", "amount"): "결제 승인 금액. 단위: 원(KRW). 주문 total_price와 일치해야 함",
    ("payment", "paid_at"): "결제 승인 완료 시각. NULL=미결제 또는 실패",
}


def req_suffix(table_name: str) -> str:
    return f" ({TABLE_REQ.get(table_name, 'KSD-ARCH-001')})"


def build_description(table_name: str, col_name: str) -> str | None:
    body = COLUMN_DESC.get((table_name, col_name))
    if not body:
        return None
    return body + req_suffix(table_name)


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


def main() -> None:
    tables = api("GET", f"/api/workspaces/{WS}/tables").json()
    targets = [t for t in tables if t["id"] >= 41 and t["id"] <= 62]
    before_after: list[tuple[str, str, str]] = []
    per_table: dict[str, int] = {}
    skipped = 0
    failed: list[str] = []

    for tbl in sorted(targets, key=lambda x: x["id"]):
        tname = tbl["name"]
        updated = 0
        for col in tbl.get("columns", []):
            new_desc = build_description(tname, col["name"])
            if not new_desc:
                skipped += 1
                continue
            old_desc = col.get("description") or ""
            if old_desc == new_desc:
                continue
            body = {
                "name": col["name"],
                "data_type": col["data_type"],
                "is_pk": col["is_pk"],
                "is_fk": col["is_fk"],
                "fk_target": col.get("fk_target"),
                "is_nullable": col["is_nullable"],
                "description": new_desc,
            }
            r = api("PUT", f"/api/workspaces/{WS}/columns/{col['id']}", json=body)
            if r.status_code not in (200, 201):
                failed.append(f"{tname}.{col['name']} id={col['id']}: {r.status_code} {r.text[:100]}")
                print(f"FAIL {tname}.{col['name']}: {r.status_code}", file=sys.stderr)
                sys.exit(1)
            updated += 1
            if tname == "menu_nutrition" and len(before_after) < 3:
                before_after.append((col["name"], old_desc, new_desc))
        per_table[tname] = updated
        print(f"  {tname} (id={tbl['id']}): {updated} columns updated")

    total = sum(per_table.values())
    print(f"\n=== Total updated: {total} columns across {len(per_table)} tables ===")
    print(f"Skipped (no mapping): {skipped}")
    if failed:
        print("FAILED:", failed)
    print("\n=== menu_nutrition before -> after (sample) ===")
    for name, old, new in before_after:
        print(f"  [{name}]")
        print(f"    BEFORE: {old}")
        print(f"    AFTER:  {new}")

    report = {"per_table": per_table, "total": total, "before_after": [
        {"name": n, "before": o, "after": a} for n, o, a in before_after
    ]}
    out = __file__.replace("update_column_descriptions.py", "column_update_report.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
