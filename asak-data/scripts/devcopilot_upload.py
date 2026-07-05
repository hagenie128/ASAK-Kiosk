#!/usr/bin/env python3
"""Upload ASAK Notion export data to DevCopilot workspace 2."""
from __future__ import annotations

import json
import re
import sys
import time
from collections import defaultdict
from pathlib import Path
from typing import Any

import requests

from req_link_maps import (
    SCENARIO_REQ_MAP,
    SCR_REQ_MAP,
    api_description_text,
    api_req_ids,
    req_prefix,
    scenario_display_title,
    scenario_req_ids,
    strip_scenario_id_prefix,
    task_req_ids,
    title_with_req,
)
from update_table_descriptions import TABLE_DESCRIPTIONS, SERVER_IDS, full_description

BASE = "https://devproject-hub-backend.onrender.com"
WS = 2
HEADERS = {"Content-Type": "application/json", "x-user-username": "hagenie128"}
DATA_FILE = Path(__file__).parent / "notion_data.json"

PRIORITY_MAP = {"상": "HIGH", "중": "MEDIUM", "하": "LOW"}
REQ_STATUS_MAP = {
    "예정": "TODO", "검토중": "TODO", "진행중": "IN_PROGRESS",
    "구현완료": "DONE", "테스트완료": "DONE",
}
CATEGORY_MAP = {
    "기능": "FUNCTION", "비기능": "NON_FUNCTION", "화면": "UI", "DB": "DB",
    "API": "API", "장치": "FUNCTION", "관리자": "FUNCTION",
}
TASK_STATUS_MAP = {
    "예정": "TODO", "검토중": "TODO", "진행중": "IN_PROGRESS",
    "완료": "DONE", "지연": "TODO",
}

TABLES: list[dict[str, Any]] = [
    {"name": "category", "description": "메뉴 카테고리", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "카테고리 ID"},
        {"name": "name", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "카테고리명"},
        {"name": "sort_order", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "노출 순서"},
        {"name": "is_active", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "사용 여부"},
    ]},
    {"name": "code_group", "description": "공통 코드 그룹", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "코드그룹 ID"},
        {"name": "group_code", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "코드그룹 코드"},
        {"name": "name", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "코드그룹명"},
    ]},
    {"name": "common_code", "description": "공통 코드", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "코드 ID"},
        {"name": "code_group_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "code_group", "is_nullable": False, "description": "code_group.id"},
        {"name": "code", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "API/프론트 코드값"},
        {"name": "name", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "표시명"},
        {"name": "sort_order", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "정렬 순서"},
        {"name": "is_active", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "사용 여부"},
    ]},
    {"name": "tag", "description": "메뉴 태그 마스터", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "태그 ID"},
        {"name": "code", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "태그 코드"},
        {"name": "name", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "표시명"},
        {"name": "color_hex", "data_type": "VARCHAR(20)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "태그 색상"},
        {"name": "is_active", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "사용 여부"},
    ]},
    {"name": "menu", "description": "판매 메뉴", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "메뉴 ID"},
        {"name": "category_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "category", "is_nullable": False, "description": "category.id"},
        {"name": "name", "data_type": "VARCHAR(100)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "ASAK 메뉴명"},
        {"name": "price", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "기본 판매가"},
        {"name": "image_url", "data_type": "TEXT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "메뉴 이미지"},
        {"name": "description", "data_type": "TEXT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "메뉴 설명"},
        {"name": "is_sold_out", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "메뉴 직접 품절 여부"},
        {"name": "created_at", "data_type": "TIMESTAMP", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "생성일시"},
        {"name": "updated_at", "data_type": "TIMESTAMP", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "수정일시"},
    ]},
    {"name": "menu_tag", "description": "메뉴별 태그 연결", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "연결 ID"},
        {"name": "menu_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "menu", "is_nullable": False, "description": "menu.id"},
        {"name": "tag_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "tag", "is_nullable": False, "description": "tag.id"},
    ]},
    {"name": "menu_nutrition", "description": "메뉴 영양정보 요약", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "영양정보 ID"},
        {"name": "menu_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "menu", "is_nullable": False, "description": "menu.id"},
        {"name": "kcal", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "기준 칼로리"},
        {"name": "protein_g", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "단백질"},
        {"name": "carb_g", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "탄수화물"},
        {"name": "fat_g", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "지방"},
        {"name": "sodium_mg", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "나트륨"},
        {"name": "source_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": True, "description": "데이터 출처 코드"},
    ]},
    {"name": "ingredient", "description": "재료 마스터", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "재료 ID"},
        {"name": "name", "data_type": "VARCHAR(100)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "재료명"},
        {"name": "type_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": False, "description": "재료 유형 코드"},
        {"name": "kcal", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "기준 칼로리"},
        {"name": "protein_g", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "기준 단백질"},
        {"name": "is_sold_out", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "재료 품절 여부"},
    ]},
    {"name": "allergen", "description": "알레르기 마스터", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "알레르기 ID"},
        {"name": "name", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "알레르기명"},
    ]},
    {"name": "ingredient_allergen", "description": "재료별 알레르기 연결", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "연결 ID"},
        {"name": "ingredient_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "ingredient", "is_nullable": False, "description": "ingredient.id"},
        {"name": "allergen_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "allergen", "is_nullable": False, "description": "allergen.id"},
    ]},
    {"name": "menu_ingredient", "description": "메뉴 기본 재료 연결", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "연결 ID"},
        {"name": "menu_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "menu", "is_nullable": False, "description": "menu.id"},
        {"name": "ingredient_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "ingredient", "is_nullable": False, "description": "ingredient.id"},
        {"name": "role_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": False, "description": "재료 역할 코드"},
        {"name": "quantity", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "기본 제공량"},
        {"name": "unit_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": True, "description": "단위 코드"},
        {"name": "is_default", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "기본 포함 여부"},
        {"name": "can_remove", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "고객 제외 가능 여부"},
        {"name": "sort_order", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "표시 순서"},
    ]},
    {"name": "option_group", "description": "옵션 그룹 마스터", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "옵션그룹 ID"},
        {"name": "name", "data_type": "VARCHAR(100)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "옵션그룹명"},
        {"name": "group_type_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": False, "description": "옵션그룹 유형 코드"},
        {"name": "min_select", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "최소 선택 수"},
        {"name": "max_select", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "최대 선택 수"},
    ]},
    {"name": "menu_option_group", "description": "메뉴별 옵션그룹 연결", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "연결 ID"},
        {"name": "menu_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "menu", "is_nullable": False, "description": "menu.id"},
        {"name": "option_group_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "option_group", "is_nullable": False, "description": "option_group.id"},
        {"name": "sort_order", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "표시 순서"},
        {"name": "is_required", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "필수 여부"},
    ]},
    {"name": "menu_option", "description": "메뉴별 옵션항목 설정", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "메뉴별 옵션 설정 ID"},
        {"name": "menu_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "menu", "is_nullable": False, "description": "menu.id"},
        {"name": "option_item_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "option_item", "is_nullable": False, "description": "option_item.id"},
        {"name": "is_recommended", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "추천 옵션 여부"},
        {"name": "is_default", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "기본 선택 여부"},
        {"name": "sort_order", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "표시 순서"},
        {"name": "is_active", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "노출 여부"},
    ]},
    {"name": "option_item", "description": "옵션 선택 항목", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "옵션항목 ID"},
        {"name": "option_group_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "option_group", "is_nullable": False, "description": "option_group.id"},
        {"name": "ingredient_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "ingredient", "is_nullable": True, "description": "ingredient.id"},
        {"name": "name", "data_type": "VARCHAR(100)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "옵션항목명"},
        {"name": "extra_price", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "추가 금액"},
        {"name": "original_price", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "할인 전 금액"},
        {"name": "amount", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "제공량"},
        {"name": "unit_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": True, "description": "단위 코드"},
        {"name": "icon_url", "data_type": "TEXT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "아이콘 URL"},
        {"name": "color_hex", "data_type": "VARCHAR(20)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "대표 색상"},
        {"name": "is_sold_out", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "품절 여부"},
        {"name": "created_at", "data_type": "TIMESTAMP", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "생성일시"},
        {"name": "updated_at", "data_type": "TIMESTAMP", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "수정일시"},
    ]},
    {"name": "option_item_component", "description": "세트 옵션 구성품", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "구성 ID"},
        {"name": "option_item_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "option_item", "is_nullable": False, "description": "option_item.id"},
        {"name": "ingredient_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "ingredient", "is_nullable": True, "description": "구성 재료"},
        {"name": "name", "data_type": "VARCHAR(100)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "구성품명"},
        {"name": "quantity", "data_type": "DECIMAL(8,2)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "구성 수량"},
        {"name": "unit_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": True, "description": "단위 코드"},
        {"name": "sort_order", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "표시 순서"},
    ]},
    {"name": "payment_method_config", "description": "결제수단 설정", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "설정 ID"},
        {"name": "method_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": False, "description": "결제수단 코드"},
        {"name": "name", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "표시명"},
        {"name": "is_active", "data_type": "BOOLEAN", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "노출 여부"},
        {"name": "sort_order", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "노출 순서"},
    ]},
    {"name": "orders", "description": "주문 헤더", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "주문 ID"},
        {"name": "order_no", "data_type": "VARCHAR(50)", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "주문번호"},
        {"name": "order_type_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": False, "description": "주문유형 코드"},
        {"name": "status_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": False, "description": "주문상태 코드"},
        {"name": "total_price", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "주문 총액"},
        {"name": "created_at", "data_type": "TIMESTAMP", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "주문 생성일시"},
    ]},
    {"name": "order_item", "description": "주문 메뉴 단위", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "주문상세 ID"},
        {"name": "order_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "orders", "is_nullable": False, "description": "orders.id"},
        {"name": "menu_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "menu", "is_nullable": False, "description": "menu.id"},
        {"name": "quantity", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "메뉴 수량"},
        {"name": "price", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "주문 시점 단가"},
    ]},
    {"name": "order_item_option", "description": "주문상세별 선택 옵션", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "선택 옵션 ID"},
        {"name": "order_item_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "order_item", "is_nullable": False, "description": "order_item.id"},
        {"name": "option_item_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "option_item", "is_nullable": False, "description": "option_item.id"},
        {"name": "quantity", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "옵션 수량"},
        {"name": "price", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "주문 시점 옵션 단가"},
    ]},
    {"name": "item_exclusion", "description": "제외한 기본 재료", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "제외 기록 ID"},
        {"name": "order_item_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "order_item", "is_nullable": False, "description": "order_item.id"},
        {"name": "ingredient_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "ingredient", "is_nullable": False, "description": "제외 재료"},
    ]},
    {"name": "payment", "description": "결제 내역", "columns": [
        {"name": "id", "data_type": "BIGINT", "is_pk": True, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "결제 ID"},
        {"name": "order_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "orders", "is_nullable": False, "description": "orders.id"},
        {"name": "method_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": False, "description": "결제수단 코드"},
        {"name": "status_id", "data_type": "BIGINT", "is_pk": False, "is_fk": True, "fk_target": "common_code", "is_nullable": False, "description": "결제상태 코드"},
        {"name": "amount", "data_type": "INT", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": False, "description": "결제 금액"},
        {"name": "paid_at", "data_type": "TIMESTAMP", "is_pk": False, "is_fk": False, "fk_target": None, "is_nullable": True, "description": "결제 승인 시각"},
    ]},
]

API_REQ_MAP: dict[str, str] = {
    "API-001": "FWD-MENU-001", "API-002": "FWD-MENU-001", "API-003": "FWD-MENU-002",
    "API-004": "FWD-MENU-003", "API-005": "FWD-ORDER-001", "API-006": "FWD-PAY-001",
    "API-007": "LMIS-ORDER-001", "API-008": "LMIS-ORDER-003", "API-009": "LMIS-MENU-001",
    "API-010": "LMIS-MENU-001", "API-011": "LMIS-MENU-004", "API-012": "LMIS-MENU-004",
    "API-013": "FWD-PAY-001", "API-014": "LMIS-PAY-001", "API-015": "LMIS-ORDER-005",
    "API-016": "FWD-CART-001", "API-017": "FWD-UI-001",
}

TEST_REQ_IDS = {"TEST-REQ"}
TEST_TASK_IDS = {"WBS-TEST", "WBS-TEST2", "WBS-TEST-MINJUN"}
TEST_SCENARIO_IDS = {"SC-TEST", "SC-TEST2"}
ALLOWED_ASSIGNEES = {"이하진", "김나연", "박유진"}
ASSIGNEE_MAP = {
    "이하진": "이하진", "하진": "이하진",
    "김나연": "김나연", "나연": "김나연",
    "박유진": "박유진", "유진": "박유진",
}
MINJUN_SKIP_COUNT = 0
ASSIGNEE_MAPPED_COUNT = 0
ASSIGNEE_EMPTY_COUNT = 0
DELAY_LOG: list[str] = []
SKIP_LOG: list[str] = []


def api(method: str, path: str, **kwargs) -> requests.Response:
    url = f"{BASE}{path}"
    for attempt in range(3):
        try:
            r = requests.request(method, url, headers=HEADERS, timeout=120, **kwargs)
            if r.status_code >= 500 and attempt < 2:
                time.sleep(5 * (attempt + 1))
                continue
            return r
        except requests.RequestException:
            if attempt == 2:
                raise
            time.sleep(5 * (attempt + 1))
    raise RuntimeError("unreachable")


def diff_summary(old: dict, new: dict) -> str:
    changes = []
    for k, v in new.items():
        if old.get(k) != v:
            changes.append(f"{k}: {old.get(k)!r} -> {v!r}")
    return "; ".join(changes) if changes else "no changes"


def _resolve_assignee(name: str | None) -> tuple[str, bool, bool]:
    """Return (assignee, had_minjun_skip, was_mapped). No global side effects."""
    if not name or not str(name).strip():
        return "", False, False
    had_minjun = False
    parts = re.split(r"[,，/、\s]+", str(name).strip())
    for part in parts:
        token = part.strip()
        if not token:
            continue
        if token == "민준":
            had_minjun = True
            continue
        mapped = ASSIGNEE_MAP.get(token)
        if mapped:
            return mapped, had_minjun, True
        if token in ALLOWED_ASSIGNEES:
            return token, had_minjun, True
    return "", had_minjun, False


def normalize_assignee(name: str | None) -> str:
    """Return exactly one DevCopilot assignee or empty string."""
    global MINJUN_SKIP_COUNT, ASSIGNEE_MAPPED_COUNT, ASSIGNEE_EMPTY_COUNT
    assignee, had_minjun, was_mapped = _resolve_assignee(name)
    if had_minjun:
        MINJUN_SKIP_COUNT += 1
    if assignee:
        if was_mapped:
            ASSIGNEE_MAPPED_COUNT += 1
    else:
        ASSIGNEE_EMPTY_COUNT += 1
    return assignee


def fix_existing_task_assignees(existing_list: list[dict]) -> int:
    """PUT-fix tasks whose assignee_name is invalid (multi, 민준, unmapped)."""
    fixed = 0
    for t in existing_list:
        raw = t.get("assignee_name") or ""
        expected, _, _ = _resolve_assignee(raw) if raw else ("", False, False)
        if raw in ALLOWED_ASSIGNEES:
            expected = raw
        if t.get("assignee_name") != expected:
            body = {
                "task_id": t["task_id"],
                "title": t["title"],
                "assignee_name": expected,
                "start_date": t.get("start_date") or "2026-07-01",
                "end_date": t.get("end_date") or "2026-07-31",
                "status": t.get("status") or "TODO",
            }
            print(f"  PUT fix assignee [{t['task_id']}]: {raw!r} -> {expected!r}")
            r = api("PUT", f"/api/workspaces/{WS}/tasks/{t['id']}", json=body)
            if r.status_code not in (200, 201):
                print(f"FAIL fix task {t['task_id']}: {r.status_code} {r.text}")
                sys.exit(1)
            fixed += 1
    return fixed


def load_data() -> dict:
    if not DATA_FILE.exists():
        print(f"ERROR: {DATA_FILE} not found. Run notion fetch first.", file=sys.stderr)
        sys.exit(1)
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def requirement_upload_targets(data: dict) -> list[dict]:
    """Notion requirements to sync: non-제외, non-test."""
    items = data.get("requirements", [])
    return [
        x
        for x in items
        if x.get("status_notion") != "제외" and x.get("id") not in TEST_REQ_IDS
    ]


def find_requirement_id_dupes(existing_list: list[dict]) -> dict[str, list[dict]]:
    by_id: dict[str, list[dict]] = defaultdict(list)
    for row in existing_list:
        by_id[row["id"]].append(row)
    return {rid: rows for rid, rows in by_id.items() if len(rows) > 1}


def cleanup_orphan_requirements(data: dict) -> list[tuple[str, str, str]]:
    """Delete TEST-* and requirements absent from Notion export. Returns deleted rows."""
    notion_ids = {x["id"] for x in data.get("requirements", [])}
    allowed = {
        x["id"]
        for x in data.get("requirements", [])
        if x.get("status_notion") != "제외" and x.get("id") not in TEST_REQ_IDS
    }
    deleted: list[tuple[str, str, str]] = []
    existing_list = api("GET", f"/api/workspaces/{WS}/requirements").json()
    dupes = find_requirement_id_dupes(existing_list)
    if dupes:
        print(f"WARNING: duplicate requirement ids on server: {sorted(dupes)}")
    for row in existing_list:
        rid = row["id"]
        title = row.get("title") or ""
        if rid in TEST_REQ_IDS or rid.startswith("TEST-"):
            r = api("DELETE", f"/api/workspaces/{WS}/requirements/{rid}")
            if r.status_code in (200, 204):
                deleted.append((rid, title, "TEST requirement"))
                print(f"  DELETE test requirement {rid}")
            continue
        if rid not in notion_ids:
            r = api("DELETE", f"/api/workspaces/{WS}/requirements/{rid}")
            if r.status_code in (200, 204):
                deleted.append((rid, title, "Notion에 없는 phantom"))
                print(f"  DELETE phantom requirement {rid}")
            continue
        if rid not in allowed:
            r = api("DELETE", f"/api/workspaces/{WS}/requirements/{rid}")
            if r.status_code in (200, 204):
                deleted.append((rid, title, "Notion 상태=제외"))
                print(f"  DELETE excluded requirement {rid}")
    return deleted


def upload_requirements(data: dict) -> int:
    deleted = cleanup_orphan_requirements(data)
    if deleted:
        print(f"  orphan/test cleanup: {len(deleted)} deleted")
    existing = {x["id"]: x for x in api("GET", f"/api/workspaces/{WS}/requirements").json()}
    items = data.get("requirements", [])
    skip = [x for x in items if x.get("status_notion") == "제외"]
    targets = requirement_upload_targets(data)
    print(f"\n=== Requirements: 대상 {len(targets)}, 스킵(제외) {len(skip)} ===")
    for s in skip:
        SKIP_LOG.append(f"REQ 제외: {s.get('id')} {s.get('title')}")
    ok = 0
    for i, item in enumerate(targets, 1):
        body = {
            "id": item["id"], "title": item["title"],
            "description": item.get("description") or "",
            "priority": PRIORITY_MAP.get(item.get("priority"), "MEDIUM"),
            "status": REQ_STATUS_MAP.get(item.get("status_notion"), "TODO"),
            "category": CATEGORY_MAP.get(item.get("category"), "FUNCTION"),
        }
        rid = item["id"]
        if rid in existing:
            print(f"  PUT diff [{rid}]: {diff_summary(existing[rid], body)}")
            r = api("PUT", f"/api/workspaces/{WS}/requirements/{rid}", json=body)
        else:
            r = api("POST", f"/api/workspaces/{WS}/requirements", json=body)
        if r.status_code not in (200, 201):
            print(f"FAIL requirements #{i} id={rid}: {r.status_code} {r.text}")
            sys.exit(1)
        ok += 1
        if i % 10 == 0:
            print(f"  ... requirements {i}/{len(targets)}")
    print(f"Requirements 완료: {ok}/{len(targets)}")
    return ok


def upload_tables() -> tuple[int, dict[str, int]]:
    existing_list = api("GET", f"/api/workspaces/{WS}/tables").json()
    existing = {t["name"]: t for t in existing_list}
    mapping: dict[str, int] = {}
    print(f"\n=== Tables: 대상 {len(TABLES)} ===")
    ok = 0
    for i, tbl in enumerate(TABLES, 1):
        name = tbl["name"]
        body = {"name": name, "description": tbl["description"]}
        if name in existing:
            sid = existing[name]["id"]
            print(f"  table exists: {name} -> server_id={sid}")
        else:
            r = api("POST", f"/api/workspaces/{WS}/tables", json=body)
            if r.status_code not in (200, 201):
                print(f"FAIL table {name}: {r.status_code} {r.text}")
                sys.exit(1)
            sid = r.json()["id"]
            print(f"  POST table {name} -> server_id={sid}")
        mapping[name] = sid
        for col in tbl["columns"]:
            fk = col.get("fk_target")
            if fk and fk in mapping:
                col = {**col, "fk_target": str(mapping[fk])}
            cr = api("POST", f"/api/workspaces/{WS}/tables/{sid}/columns", json=col)
            if cr.status_code not in (200, 201):
                if cr.status_code == 409 or "already" in cr.text.lower():
                    continue
                print(f"FAIL column {name}.{col['name']}: {cr.status_code} {cr.text}")
                sys.exit(1)
        ok += 1
        if i % 10 == 0:
            print(f"  ... tables {i}/{len(TABLES)}")
    print(f"Tables 완료: {ok}/{len(TABLES)}")
    return ok, mapping


def api_description(item: dict) -> str:
    aid = item.get("api_id", "")
    base = (item.get("description") or "").strip()
    for line in base.split("\n"):
        line = line.strip()
        if line and not line.startswith("{"):
            base = line
            break
    if not base:
        base = item.get("title") or aid
    return api_description_text(base, aid)


def _api_server_map(existing_list: list[dict]) -> dict[str, int]:
    """Map API-00N -> server id by endpoint+method."""
    mapping: dict[str, int] = {}
    for item in existing_list:
        key = f"{item.get('method','GET')}:{item.get('endpoint','')}"
        mapping[key] = item["id"]
    return mapping


def api_title(item: dict) -> str:
    api_id = item.get("api_id", "")
    base = item.get("base_title") or item.get("title") or api_id
    req_ids = item.get("req_ids") or api_req_ids(api_id)
    return title_with_req(f"{api_id} {base}", req_ids, primary_only=True)


def upload_apis(data: dict) -> tuple[int, dict[str, int]]:
    existing_list = api("GET", f"/api/workspaces/{WS}/apis").json()
    by_endpoint = _api_server_map(existing_list)
    items = [x for x in data.get("apis", []) if re.match(r"^API-0\d\d$", x.get("api_id", ""))]
    items.sort(key=lambda x: x["api_id"])
    print(f"\n=== APIs: 대상 {len(items)} (API-001~017) ===")
    mapping: dict[str, int] = {}
    ok = 0
    for i, item in enumerate(items, 1):
        body = {
            "title": api_title(item),
            "method": item.get("method", "GET"),
            "endpoint": item.get("endpoint", ""),
            "request_params": item.get("request_params") or "",
            "request_body": item.get("request_body") or "",
            "response_success": item.get("response_success") or "",
            "response_error": item.get("response_error") or "",
            "description": api_description(item),
        }
        key = f"{body['method']}:{body['endpoint']}"
        if key in by_endpoint:
            aid = by_endpoint[key]
            print(f"  PUT [{item['api_id']}] server_id={aid} title={body['title'][:50]}")
            r = api("PUT", f"/api/workspaces/{WS}/apis/{aid}", json=body)
        else:
            r = api("POST", f"/api/workspaces/{WS}/apis", json=body)
            if r.status_code not in (200, 201):
                print(f"FAIL api {item['api_id']}: {r.status_code} {r.text}")
                sys.exit(1)
            aid = r.json()["id"]
            print(f"  POST [{item['api_id']}] server_id={aid}")
        mapping[item["api_id"]] = aid
        ok += 1
        if i % 10 == 0:
            print(f"  ... apis {i}/{len(items)}")
    print(f"APIs 완료: {ok}/{len(items)}")
    return ok, mapping


def scenario_title(item: dict) -> str:
    sid = item.get("id", "")
    raw = item.get("base_title") or item.get("title") or sid
    base = strip_scenario_id_prefix(raw)
    req_ids = item.get("req_ids") or scenario_req_ids(sid)
    primary = SCENARIO_REQ_MAP.get(sid, [None])[0] if req_ids else None
    return scenario_display_title(base, req_ids, primary=primary)


def upload_scenarios(data: dict) -> int:
    existing_list = api("GET", f"/api/workspaces/{WS}/scenarios").json()
    existing = {s["id"]: s for s in existing_list}
    items = [x for x in data.get("scenarios", []) if x.get("id") and x["id"] not in TEST_SCENARIO_IDS]
    items.sort(key=lambda x: x["id"])
    print(f"\n=== Scenarios: 대상 {len(items)} (전부 DRAFT) ===")
    ok = 0
    for i, item in enumerate(items, 1):
        body = {
            "id": item["id"],
            "title": scenario_title(item),
            "pre_condition": item.get("pre_condition") or "",
            "post_condition": item.get("post_condition") or "",
            "normal_flow": item.get("normal_flow") or "",
            "alternative_flow": item.get("alternative_flow") or "",
            "mermaid_script": item.get("mermaid_script") or "",
            "status": "DRAFT",
        }
        sid = item["id"]
        if sid in existing:
            print(f"  PUT [{sid}] title={body['title'][:55]} mermaid={len(body['mermaid_script'])}")
            r = api("PUT", f"/api/workspaces/{WS}/scenarios/{sid}", json=body)
        else:
            r = api("POST", f"/api/workspaces/{WS}/scenarios", json=body)
        if r.status_code not in (200, 201):
            print(f"FAIL scenario #{i} {sid}: {r.status_code} {r.text}")
            sys.exit(1)
        ok += 1
        if i % 10 == 0:
            print(f"  ... scenarios {i}/{len(items)}")
    print(f"Scenarios 완료: {ok}/{len(items)} DRAFT")
    return ok


def cleanup_test_data() -> dict[str, int]:
    """Remove test requirements/tasks/scenarios if present."""
    removed = {"requirements": 0, "tasks": 0, "scenarios": 0}
    for rid in TEST_REQ_IDS:
        r = api("DELETE", f"/api/workspaces/{WS}/requirements/{rid}")
        if r.status_code in (200, 204):
            removed["requirements"] += 1
            print(f"  DELETE test requirement {rid}")
    tasks = api("GET", f"/api/workspaces/{WS}/tasks").json()
    for t in tasks:
        if t.get("task_id") in TEST_TASK_IDS:
            r = api("DELETE", f"/api/workspaces/{WS}/tasks/{t['id']}")
            if r.status_code in (200, 204):
                removed["tasks"] += 1
                print(f"  DELETE test task {t['task_id']}")
    scenarios = api("GET", f"/api/workspaces/{WS}/scenarios").json()
    for s in scenarios:
        if s.get("id") in TEST_SCENARIO_IDS:
            r = api("DELETE", f"/api/workspaces/{WS}/scenarios/{s['id']}")
            if r.status_code in (200, 204):
                removed["scenarios"] += 1
                print(f"  DELETE test scenario {s['id']}")
    return removed


def task_body_from_item(item: dict) -> dict:
    status_notion = item.get("status_notion", "예정")
    if status_notion == "지연":
        DELAY_LOG.append(f"WBS 지연: {item.get('task_id')} {item.get('title')}")
    task_id = item["task_id"]
    base_title = item.get("base_title") or item.get("title") or task_id
    req_ids = item.get("req_ids") or task_req_ids(task_id)
    title = item.get("title") or title_with_req(base_title, req_ids)
    return {
        "task_id": task_id,
        "title": title,
        "assignee_name": normalize_assignee(item.get("assignee")),
        "start_date": item.get("start_date") or "2026-07-01",
        "end_date": item.get("end_date") or "2026-07-31",
        "status": TASK_STATUS_MAP.get(status_notion, "TODO"),
    }


def upload_tasks(data: dict) -> int:
    global MINJUN_SKIP_COUNT, ASSIGNEE_MAPPED_COUNT, ASSIGNEE_EMPTY_COUNT
    MINJUN_SKIP_COUNT = 0
    ASSIGNEE_MAPPED_COUNT = 0
    ASSIGNEE_EMPTY_COUNT = 0
    existing_list = api("GET", f"/api/workspaces/{WS}/tasks").json()
    existing = {t["task_id"]: t for t in existing_list}
    print(f"\n=== Tasks: 기존 {len(existing_list)}건 assignee 점검 ===")
    fix_existing_task_assignees(existing_list)
    items = [x for x in data.get("tasks", []) if x.get("task_id") not in TEST_TASK_IDS]
    items = sorted(items, key=lambda x: x.get("task_id", ""))
    print(f"\n=== Tasks: 대상 {len(items)} ===")
    ok = 0
    samples: list[dict] = []
    for i, item in enumerate(items, 1):
        body = task_body_from_item(item)
        tid = item["task_id"]
        if len(samples) < 3:
            samples.append(body)
        if tid in existing:
            eid = existing[tid]["id"]
            print(f"  PUT diff [{tid}]: {diff_summary(existing[tid], body)}")
            r = api("PUT", f"/api/workspaces/{WS}/tasks/{eid}", json=body)
        else:
            r = api("POST", f"/api/workspaces/{WS}/tasks", json=body)
        if r.status_code not in (200, 201):
            print(f"FAIL task #{i} {tid}: {r.status_code} {r.text}")
            sys.exit(1)
        ok += 1
        if i % 10 == 0:
            print(f"  ... tasks {i}/{len(items)}")
    print(f"Tasks 완료: {ok}/{len(items)}")
    print(f"  assignee 매핑: {ASSIGNEE_MAPPED_COUNT}, empty: {ASSIGNEE_EMPTY_COUNT}, 민준skip: {MINJUN_SKIP_COUNT}")
    print("  샘플 3건:")
    for s in samples:
        print(f"    {json.dumps(s, ensure_ascii=False)}")
    return ok


QA_STATUS_MAP = {"예정": "TODO", "진행중": "IN_PROGRESS", "완료": "DONE", "실패": "FAILED"}


def qa_purpose(item: dict) -> str:
    parts = [item.get("purpose") or item.get("expected_result") or ""]
    req_ids = item.get("req_ids") or []
    sc = item.get("scenario_id") or ""
    if sc:
        parts.append(sc)
    if req_ids:
        parts.append(f"({', '.join(req_ids)})")
    return " ".join(p for p in parts if p).strip()


def upload_qa(data: dict) -> int:
    existing_list = api("GET", f"/api/workspaces/{WS}/qa").json()
    existing = {q["id"]: q for q in existing_list}
    items = sorted(data.get("qa", []), key=lambda x: x.get("id", ""))
    print(f"\n=== QA Test Cases: 대상 {len(items)} ===")
    ok = 0
    for i, item in enumerate(items, 1):
        tc_id = item["id"]
        body = {
            "id": tc_id,
            "title": item.get("title") or tc_id,
            "purpose": qa_purpose(item),
            "pre_condition": item.get("pre_condition") or "",
            "steps": item.get("steps") or "",
            "expected_result": item.get("expected_result") or "",
            "status": QA_STATUS_MAP.get(item.get("status_notion"), "TODO"),
        }
        if tc_id in existing:
            print(f"  PUT [{tc_id}] {body['title'][:50]}")
            r = api("PUT", f"/api/workspaces/{WS}/qa/{tc_id}", json=body)
        else:
            r = api("POST", f"/api/workspaces/{WS}/qa", json=body)
        if r.status_code not in (200, 201):
            print(f"FAIL qa #{i} {tc_id}: {r.status_code} {r.text}")
            sys.exit(1)
        ok += 1
        if i % 10 == 0:
            print(f"  ... qa {i}/{len(items)}")
    print(f"QA 완료: {ok}/{len(items)}")
    return ok


def verify_table_descriptions() -> int:
    tables = api("GET", f"/api/workspaces/{WS}/tables").json()
    by_name = {t["name"]: t for t in tables}
    ok = 0
    fixed = 0
    print(f"\n=== Tables: REQ ID description 검증 {len(SERVER_IDS)}건 ===")
    for name, sid in sorted(SERVER_IDS.items(), key=lambda x: x[1]):
        if name not in by_name:
            print(f"FAIL table {name} id={sid} not found")
            sys.exit(1)
        expected = full_description(name)
        old = by_name[name].get("description") or ""
        if old != expected:
            body = {"name": name, "description": expected}
            r = api("PUT", f"/api/workspaces/{WS}/tables/{sid}", json=body)
            if r.status_code not in (200, 201):
                print(f"FAIL table PUT {name}: {r.status_code} {r.text}")
                sys.exit(1)
            fixed += 1
            print(f"  PUT {name}: {old[:40]} -> {expected[:40]}")
        ok += 1
    print(f"Tables 검증 완료: {ok}/{len(SERVER_IDS)} (수정 {fixed})")
    return fixed


def update_wiki_screens(wiki_id: int = 5) -> bool:
    wikis = api("GET", f"/api/workspaces/{WS}/wikis").json()
    wiki = next((w for w in wikis if w["id"] == wiki_id), None)
    if not wiki:
        print(f"FAIL wiki {wiki_id} not found")
        return False
    content = wiki.get("content") or ""
    updated = content
    for scr_id, req_list in sorted(SCR_REQ_MAP.items()):
        if not req_list:
            continue
        pattern = rf"(## {scr_id} [^\n]+)"
        def repl(m: re.Match, reqs: list[str] = req_list) -> str:
            line = m.group(1)
            for rid in reqs:
                tag = f" ({rid})"
                if tag not in line:
                    line = f"{line}{tag}"
            return line
        updated = re.sub(pattern, repl, updated)
    if updated == content:
        print(f"Wiki {wiki_id}: SCR REQ tags already present")
        return True
    body = {"title": wiki.get("title") or "ASAK 화면설계", "content": updated}
    r = api("PUT", f"/api/workspaces/{WS}/wikis/{wiki_id}", json=body)
    if r.status_code not in (200, 201):
        print(f"FAIL wiki PUT {wiki_id}: {r.status_code} {r.text}")
        sys.exit(1)
    print(f"Wiki {wiki_id} SCR REQ tags updated")
    return True


def verify_requirement_links(req_ids: list[str]) -> dict[str, dict[str, int]]:
    tasks = api("GET", f"/api/workspaces/{WS}/tasks").json()
    apis = api("GET", f"/api/workspaces/{WS}/apis").json()
    scenarios = api("GET", f"/api/workspaces/{WS}/scenarios").json()
    tables = api("GET", f"/api/workspaces/{WS}/tables").json()
    qa = api("GET", f"/api/workspaces/{WS}/qa").json()
    report: dict[str, dict[str, int]] = {}
    for rid in req_ids:
        report[rid] = {
            "tasks": len([t for t in tasks if rid in (t.get("title") or "") or rid in (t.get("task_id") or "")]),
            "apis": len([a for a in apis if rid in (a.get("description") or "") or rid in (a.get("title") or "")]),
            "scenarios": len([s for s in scenarios if rid in (s.get("title") or "") or rid in (s.get("id") or "")]),
            "tables": len([t for t in tables if rid in (t.get("description") or "")]),
            "qa": len([q for q in qa if rid in (q.get("title") or "") or rid in (q.get("purpose") or "")]),
        }
    return report


def quality_fix_upload(data: dict | None = None) -> dict[str, Any]:
    """Re-upload requirements/scenarios/APIs/tasks/QA with REQ ID linkage; verify tables/wiki."""
    if data is None:
        data = load_data()
    stats: dict[str, Any] = {}
    stats["requirements"] = upload_requirements(data)
    stats["scenarios"] = upload_scenarios(data)
    stats["apis"], _ = upload_apis(data)
    stats["tasks"] = upload_tasks(data)
    stats["qa"] = upload_qa(data)
    stats["tables_fixed"] = verify_table_descriptions()
    stats["wiki_updated"] = update_wiki_screens(5)
    req_ids = [x["id"] for x in requirement_upload_targets(data)]
    stats["link_check"] = verify_requirement_links(req_ids)
    return stats


def upload_data_only(data: dict | None = None) -> dict[str, int]:
    """Upload requirements, APIs, scenarios, tasks only (skip tables)."""
    if data is None:
        data = load_data()
    stats: dict[str, int] = {}
    print("\n=== 테스트 데이터 정리 ===")
    cleanup_test_data()
    stats["requirements"] = upload_requirements(data)
    stats["apis"], _ = upload_apis(data)
    stats["scenarios"] = upload_scenarios(data)
    stats["tasks"] = upload_tasks(data)
    return stats


def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--data-only", action="store_true", help="Skip tables upload")
    p.add_argument("--quality-fix", action="store_true", help="REQ ID quality fix re-upload")
    args = p.parse_args()
    data = load_data()
    if args.quality_fix:
        stats = quality_fix_upload(data)
        print(f"\n=== 품질 수정 완료 === stats={json.dumps(stats, ensure_ascii=False, indent=2)}")
    elif args.data_only:
        stats = upload_data_only(data)
        print(f"\n=== 완료 === stats={stats}")
    else:
        upload_requirements(data)
        upload_tables()
        upload_apis(data)
        upload_scenarios(data)
        upload_tasks(data)
        print("\n=== 완료 ===")


if __name__ == "__main__":
    main()
