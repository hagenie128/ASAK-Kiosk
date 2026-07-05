#!/usr/bin/env python3
"""Append WBS/API/Scenario pages to notion_raw from embedded props."""
from __future__ import annotations

import json
from pathlib import Path

from gen_embedded_pages import add, main as gen_main

RAW = Path(__file__).parent / "notion_raw"

# More WBS from MCP fetch
add("39251ef04f0b8124bb8afcb5934676fe", "프론트: 결제 실패/재시도 화면 구현", {"작업 ID": "WBS-027", "작업명": "프론트: 결제 실패/재시도 화면 구현", "담당자": "강민준, 박유진", "date:시작일:start": "2026-07-09", "date:종료일:start": "2026-07-12", "상태": "예정"})
add("39251ef04f0b812e8c63ef987ba821c5", "프론트: 접근성 설정 화면 초안", {"작업 ID": "WBS-032", "작업명": "프론트: 접근성 설정 화면 초안", "담당자": "박유진", "date:시작일:start": "2026-07-21", "date:종료일:start": "2026-08-07", "상태": "예정"})
add("39251ef04f0b8148a7a7ef167f9dd24d", "관리자: 결제수단 설정 화면/API 설계", {"작업 ID": "WBS-030", "작업명": "관리자: 결제수단 설정 화면/API 설계", "담당자": "나연", "date:시작일:start": "2026-07-27", "date:종료일:start": "2026-08-07", "상태": "예정"})
add("39251ef04f0b8178b00be3b4fe8d14f8", "백엔드: 장바구니 검증 API", {"작업 ID": "WBS-025", "작업명": "백엔드: 장바구니 검증 API", "담당자": "하진", "date:시작일:start": "2026-07-08", "date:종료일:start": "2026-07-11", "상태": "예정"})
add("39151ef04f0b81a5980adf7f86726068", "키오스크 예외처리(결제/터치/타임아웃)", {"작업 ID": "WBS-016", "작업명": "키오스크 예외처리(결제/터치/타임아웃)", "담당자": "하진, 민준", "date:시작일:start": "2026-07-11", "date:종료일:start": "2026-07-16", "상태": "예정"})
add("39251ef04f0b8172a19eeecc6e6063ae", "백엔드: 추천 드레싱 menu_option 반영", {"작업 ID": "WBS-026", "작업명": "백엔드: 추천 드레싱 menu_option 반영", "담당자": "하진", "date:시작일:start": "2026-07-06", "date:종료일:start": "2026-07-09", "상태": "예정"})
add("39151ef04f0b811596aae31ceae9e7f1", "백엔드: 판매 항목 품절 상태 변경 API", {"작업 ID": "WBS-013", "작업명": "백엔드: 판매 항목 품절 상태 변경 API", "담당자": "하진, 나연", "date:시작일:start": "2026-07-10", "date:종료일:start": "2026-07-15", "상태": "예정"})
add("39151ef04f0b818a9180f42b0e88f529", "프론트-백엔드 연동 테스트", {"작업 ID": "WBS-015", "작업명": "프론트-백엔드 연동 테스트", "담당자": "하진, 유진, 나연", "date:시작일:start": "2026-07-10", "date:종료일:start": "2026-07-13", "상태": "예정"})
add("39151ef04f0b81379eb0eb3ab0a55192", "ERD · API 명세서 작성", {"작업 ID": "WBS-004", "작업명": "ERD · API 명세서 작성", "담당자": "하진", "date:시작일:start": "2026-07-03", "date:종료일:start": "2026-07-05", "상태": "예정"})
add("39151ef04f0b810ea567e4a612858219", "프론트: 옵션선택 화면 구현", {"작업 ID": "WBS-008", "작업명": "프론트: 옵션선택 화면 구현", "담당자": "유진, 민준", "date:시작일:start": "2026-07-06", "date:종료일:start": "2026-07-09", "상태": "예정"})
add("39451ef04f0b81f0bb08d595a005de84", "장치: 영수증 출력 모의 구현", {"작업 ID": "WBS-034", "작업명": "장치: 영수증 출력 모의 구현 (RTOS-DEVICE-001)", "담당자": "", "date:시작일:start": "2026-08-12", "date:종료일:start": "2026-08-15", "상태": "예정"})
add("39351ef04f0b81959f01db02bf61e827", "[삭제요망] 관리자 결제수단 설정", {"작업 ID": "WBS-EXT-002", "작업명": "[삭제요망] 관리자 결제수단 설정", "담당자": "", "date:시작일:start": "2026-08-05", "date:종료일:start": "2026-08-08", "상태": "예정"})
add("39351ef04f0b8104b7aadf4c22be1e57", "[삭제요망] 장바구니 서버 검증", {"작업 ID": "WBS-EXT-001", "작업명": "[삭제요망] 장바구니 서버 검증", "담당자": "", "date:시작일:start": "2026-07-15", "date:종료일:start": "2026-07-18", "상태": "예정"})
add("39151ef04f0b81ee8778c89fce69ea1d", "메뉴 구조 · 옵션 트리 설계", {"작업 ID": "WBS-001", "작업명": "메뉴 구조 · 옵션 트리 설계", "담당자": "하진, 나연", "date:시작일:start": "2026-07-03", "date:종료일:start": "2026-07-04", "상태": "예정"})
add("39151ef04f0b81828ee9c99496143eac", "화면 흐름도 · 기능 정의서", {"작업 ID": "WBS-002", "작업명": "화면 흐름도 · 기능 정의서", "담당자": "나연, 유진", "date:시작일:start": "2026-07-03", "date:종료일:start": "2026-07-04", "상태": "예정"})
add("39151ef04f0b8115abfacb7efae9e282", "기술스택 확정 · 역할분담", {"작업 ID": "WBS-003", "작업명": "기술스택 확정 · 역할분담", "담당자": "하진, 나연", "date:시작일:start": "2026-07-03", "date:종료일:start": "2026-07-03", "상태": "완료"})
add("39151ef04f0b811c96afcdd947b33b6e", "와이어프레임 · 컴포넌트 구조", {"작업 ID": "WBS-005", "작업명": "와이어프레임 · 컴포넌트 구조", "담당자": "유진, 나연", "date:시작일:start": "2026-07-03", "date:종료일:start": "2026-07-06", "상태": "예정"})
add("39151ef04f0b8165baa4f2d436a63b67", "백엔드: 메뉴/옵션 API", {"작업 ID": "WBS-011", "작업명": "백엔드: 메뉴/옵션 API", "담당자": "하진", "date:시작일:start": "2026-07-05", "date:종료일:start": "2026-07-08", "상태": "예정"})
add("39151ef04f0b81a887d7e20c9df188f8", "백엔드: 주문 생성 API", {"작업 ID": "WBS-012", "작업명": "백엔드: 주문 생성 API", "담당자": "하진", "date:시작일:start": "2026-07-07", "date:종료일:start": "2026-07-10", "상태": "예정"})
add("39151ef04f0b81f5a3b4e681fb3cde36", "프론트: 접근성 UI 적용", {"작업 ID": "WBS-022", "작업명": "프론트: 접근성 UI 적용(글자크기/대비)", "담당자": "민준, 나연", "date:시작일:start": "2026-07-21", "date:종료일:start": "2026-08-07", "상태": "예정"})
add("39151ef04f0b81dfa4fcda641d4c7e4b", "배포 · 발표자료 · 시연 시나리오", {"작업 ID": "WBS-019", "작업명": "배포 · 발표자료 · 시연 시나리오", "담당자": "나연, 하진", "date:시작일:start": "2026-08-17", "date:종료일:start": "2026-08-27", "상태": "예정"})
add("39251ef04f0b8195a8cfcb48e986bf63", "테스트: 추적성 점검", {"작업 ID": "WBS-031", "작업명": "테스트: 요구사항-시나리오-화면-API 추적성 점검", "담당자": "전원", "date:시작일:start": "2026-07-10", "date:종료일:start": "2026-07-17", "상태": "예정"})
add("39451ef04f0b81ceae70cb1a89037fa9", "백엔드: 관리자 주문 API", {"작업 ID": "WBS-035", "작업명": "백엔드: 관리자 주문 목록/상태변경 API (API-007/008)", "담당자": "하진, 나연", "date:시작일:start": "2026-07-09", "date:종료일:start": "2026-07-11", "상태": "예정"})

# APIs (from notion_data backup)
APIS = [
    ("39251ef04f0b813f9b8af829584c450b", "카테고리 목록 조회", {"API ID": "API-001", "API명": "카테고리 목록 조회", "Method": "GET", "userDefined:URL": "/api/categories", "Request": "없음", "Response": '{"code":"CATEGORY_LIST_SUCCESS"}', "Error": '{"code":"CATEGORY_LIST_FAILED"}', "처리 내용": "category 테이블에서 sort_order 기준으로 카테고리 목록 조회"}),
    ("04851ef04f0b831abbe601a5cd258ac9", "메뉴 목록 조회", {"API ID": "API-002", "API명": "메뉴 목록 조회", "Method": "GET", "userDefined:URL": "/api/menus", "Request": "Query: categoryId(Long, optional)", "Response": '{"code":"MENU_LIST_SUCCESS"}', "Error": '{"code":"CATEGORY_NOT_FOUND"}', "처리 내용": "카테고리 조건에 따라 ASAK 메뉴 목록을 조회한다."}),
    ("39251ef04f0b81b6a23bd0da22f3632e", "메뉴 상세 조회", {"API ID": "API-003", "API명": "메뉴 상세 조회", "Method": "GET", "userDefined:URL": "/api/menus/{menuId}", "Request": "Path: menuId(Long, required)", "Response": '{"code":"MENU_DETAIL_SUCCESS"}', "Error": '{"code":"MENU_NOT_FOUND"}', "처리 내용": "menuId로 메뉴 조회"}),
    ("39151ef04f0b816583b6f7d373600582", "메뉴 옵션 조회", {"API ID": "API-004", "API명": "메뉴 옵션 조회", "Method": "GET", "userDefined:URL": "/api/menus/{menuId}/options", "Request": "Path: menuId(Long, required)", "Response": '{"code":"MENU_OPTIONS_SUCCESS"}', "Error": '{"code":"MENU_NOT_FOUND"}', "처리 내용": "베이스/드레싱/토핑/세트 옵션 목록 조회"}),
    ("30b51ef04f0b8358af2f01c096421506", "주문 생성", {"API ID": "API-005", "API명": "주문 생성", "Method": "POST", "userDefined:URL": "/api/orders", "Request": "orderType, items[]", "Response": '{"code":"ORDER_CREATE_SUCCESS"}', "Error": '{"code":"ORDER_INVALID"}', "처리 내용": "장바구니 내용을 기준으로 주문을 생성한다."}),
    ("36651ef04f0b829b94e501c66c7c66a9", "가상 결제 처리", {"API ID": "API-006", "API명": "가상 결제 처리", "Method": "POST", "userDefined:URL": "/api/payments", "Request": "orderId, paymentMethod, amount", "Response": '{"code":"PAYMENT_APPROVED"}', "Error": '{"code":"PAYMENT_AMOUNT_MISMATCH"}', "처리 내용": "결제 승인 처리 및 결제 정보 저장"}),
    ("67a51ef04f0b821c9d77811c4e813c41", "관리자 주문 목록/상세 조회", {"API ID": "API-007", "API명": "관리자 주문 목록/상세 조회", "Method": "GET", "userDefined:URL": "/api/admin/orders", "Request": "Query: status(String, optional)", "Response": '{"code":"ADMIN_ORDER_LIST_SUCCESS"}', "Error": '{"code":"ORDER_STATUS_INVALID"}', "처리 내용": "관리자용 주문 목록과 상세 조회"}),
    ("02751ef04f0b827cb7e781935cb20a90", "관리자 주문 상태 변경", {"API ID": "API-008", "API명": "관리자 주문 상태 변경", "Method": "PATCH", "userDefined:URL": "/api/admin/orders/{orderId}/status", "Request": "orderStatus", "Response": '{"code":"ORDER_STATUS_UPDATE_SUCCESS"}', "Error": '{"code":"ORDER_STATUS_INVALID"}', "처리 내용": "관리자가 주문 상태를 변경한다."}),
    ("39151ef04f0b81809b72c1daaac09498", "판매 항목 품절 상태 변경", {"API ID": "API-009", "API명": "판매 항목 품절 상태 변경", "Method": "PATCH", "userDefined:URL": "/api/admin/sold-out-items", "Request": "targetType, targetId, isSoldOut", "Response": '{"code":"SOLD_OUT_UPDATE_SUCCESS"}', "Error": '{"code":"SOLD_OUT_TARGET_NOT_FOUND"}', "처리 내용": "메뉴/재료/옵션 품절 상태 변경"}),
    ("39251ef04f0b8184853ec576e1b9ba99", "관리자 판매 항목 목록 조회", {"API ID": "API-010", "API명": "관리자 판매 항목 목록 조회", "Method": "GET", "userDefined:URL": "/api/admin/sold-out-items", "Request": "Query: targetType, keyword", "Response": '{"code":"SOLD_OUT_ITEM_LIST_SUCCESS"}', "Error": '{"code":"SOLD_OUT_ITEM_LIST_FAILED"}', "처리 내용": "품절 처리 대상 목록 조회"}),
    ("39251ef04f0b81e4bec7e4146890bbb7", "관리자 메뉴 목록 조회", {"API ID": "API-011", "API명": "관리자 메뉴 목록 조회", "Method": "GET", "userDefined:URL": "/api/admin/menus", "Request": "Query: categoryId, keyword, isSoldOut", "Response": '{"code":"ADMIN_MENU_LIST_SUCCESS"}', "Error": '{"code":"ADMIN_MENU_LIST_FAILED"}', "처리 내용": "관리자 메뉴 목록 조회"}),
    ("39251ef04f0b81c38e86e9521d37502a", "관리자 메뉴 등록/수정", {"API ID": "API-012", "API명": "관리자 메뉴 등록/수정", "Method": "POST", "userDefined:URL": "/api/admin/menus", "Request": "categoryId, name, price, imageUrl, description, optionGroupIds", "Response": '{"code":"ADMIN_MENU_UPSERT_SUCCESS"}', "Error": '{"code":"ADMIN_MENU_SAVE_FAILED"}', "처리 내용": "관리자 메뉴 등록/수정"}),
    ("39251ef04f0b8136b6d9d97eeee6cd27", "활성 결제수단 조회", {"API ID": "API-013", "API명": "활성 결제수단 조회", "Method": "GET", "userDefined:URL": "/api/payment-methods", "Request": "없음", "Response": '{"code":"PAYMENT_METHOD_LIST_SUCCESS"}', "Error": '{"code":"PAYMENT_METHOD_LIST_FAILED"}', "처리 내용": "키오스크 결제수단 목록 조회"}),
    ("39251ef04f0b8159a4c3dedb4949e4e4", "관리자 결제수단 설정 변경", {"API ID": "API-014", "API명": "관리자 결제수단 설정 변경", "Method": "PATCH", "userDefined:URL": "/api/admin/payment-methods/{methodId}", "Request": "isActive, sortOrder", "Response": '{"code":"PAYMENT_METHOD_UPDATE_SUCCESS"}', "Error": '{"code":"PAYMENT_METHOD_UPDATE_FAILED"}', "처리 내용": "결제수단 노출/정렬 변경"}),
    ("39251ef04f0b8155ad12d44bbccf9dcb", "관리자 일별 매출 조회", {"API ID": "API-015", "API명": "관리자 일별 매출 조회", "Method": "GET", "userDefined:URL": "/api/admin/sales/daily", "Request": "Query: from, to", "Response": '{"code":"ADMIN_DAILY_SALES_SUCCESS"}', "Error": '{"code":"SALES_DAILY_FAILED"}', "처리 내용": "일자별 주문수와 결제금액 조회"}),
    ("39251ef04f0b8127a34be3534f376a63", "장바구니 검증", {"API ID": "API-016", "API명": "장바구니 검증", "Method": "POST", "userDefined:URL": "/api/cart/validate", "Request": "items[]", "Response": '{"code":"CART_VALIDATE_SUCCESS"}', "Error": '{"code":"CART_INVALID"}', "처리 내용": "장바구니 주문 가능 여부 검증"}),
    ("39251ef04f0b81eca9c1e4cbd4909f80", "접근성 설정 조회", {"API ID": "API-017", "API명": "접근성 설정 조회", "Method": "GET", "userDefined:URL": "/api/ui/accessibility-options", "Request": "없음", "Response": '{"code":"ACCESSIBILITY_SETTINGS_SUCCESS"}', "Error": '{"code":"ACCESSIBILITY_OPTION_FAILED"}', "처리 내용": "접근성 옵션 목록 조회"}),
]
for pid, title, props in APIS:
    add(pid, title, props)

# Scenarios SC-001~018
SCENARIOS = [
    ("39151ef04f0b81a8aba7e755a9ce72c4", "신규 고객의 기본 주문 흐름", {"시나리오 ID": "SC-001", "시나리오명": "신규 고객의 기본 주문 흐름", "시작 조건": "ASAK 키오스크 화면 진입", "종료 조건": "결제 완료 후 주문번호 표시", "기본 흐름": "카테고리 탐색 → 메뉴 선택 → 옵션 선택 → 장바구니 → 결제", "예외 흐름": "이전 단계 복귀 시 선택 유지", "상태": "초안"}),
    ("39151ef04f0b81a4b874ea63b2e87f81", "재방문 고객의 빠른 주문", {"시나리오 ID": "SC-002", "시나리오명": "재방문 고객의 빠른 주문", "시작 조건": "재방문 고객", "종료 조건": "주문번호 표시", "기본 흐름": "빠른 주문 흐름", "예외 흐름": "", "상태": "확정"}),
    ("39151ef04f0b8136afedfbe033869bc0", "결제 실패 후 재시도", {"시나리오 ID": "SC-003", "시나리오명": "결제 실패 후 재시도", "시작 조건": "결제 실패 발생", "종료 조건": "재시도 성공 또는 취소", "기본 흐름": "실패 안내 → 재시도 → 성공", "예외 흐름": "취소 시 장바구니 유지", "상태": "초안"}),
    ("39151ef04f0b81a8a6bcd5370f9cb200", "메뉴 선택 및 옵션 구성", {"시나리오 ID": "SC-004", "시나리오명": "메뉴 선택 및 옵션 구성", "시작 조건": "메뉴 목록 화면", "종료 조건": "장바구니 담기 완료", "기본 흐름": "메뉴 선택 → 옵션 구성 → 담기", "예외 흐름": "품절 항목 선택 불가", "상태": "초안"}),
    ("39151ef04f0b8161aa65f28c31b0c440", "빠른 주문 UX", {"시나리오 ID": "SC-005", "시나리오명": "빠른 주문 UX", "시작 조건": "홈 화면", "종료 조건": "결제 완료", "기본 흐름": "추천 조합으로 빠른 주문", "예외 흐름": "", "상태": "초안"}),
    ("39151ef04f0b81758d4cdaca3d3aedfc", "관리자 메뉴 등록/수정", {"시나리오 ID": "SC-006", "시나리오명": "관리자 메뉴 등록/수정", "시작 조건": "관리자 메뉴 관리 화면", "종료 조건": "저장 완료", "기본 흐름": "메뉴 등록/수정 → 저장", "예외 흐름": "유효성 오류", "상태": "초안"}),
    ("39151ef04f0b81c6a8f7dcfa29cd4eb2", "재료 제외 옵션 선택", {"시나리오 ID": "SC-007", "시나리오명": "재료 제외 옵션 선택", "시작 조건": "옵션 선택 화면", "종료 조건": "제외 재료 반영", "기본 흐름": "재료 제외 선택", "예외 흐름": "", "상태": "초안"}),
    ("39151ef04f0b8138b9cbebbf1b185ce7", "품절 항목 주문 시도", {"시나리오 ID": "SC-008", "시나리오명": "품절 항목 주문 시도", "시작 조건": "품절 항목 존재", "종료 조건": "주문 불가 안내", "기본 흐름": "품절 표시 확인", "예외 흐름": "다른 메뉴 선택", "상태": "초안"}),
    ("39151ef04f0b81ebb344fed659c7976a", "멤버십 스탬프 적립", {"시나리오 ID": "SC-009", "시나리오명": "멤버십 스탬프 적립", "시작 조건": "결제 진행 중", "종료 조건": "적립 완료", "기본 흐름": "적립 확인 → 결제 → 적립", "예외 흐름": "", "상태": "초안"}),
    ("39151ef04f0b81108c44f3390d12c241", "품절 상태 고객 화면 반영", {"시나리오 ID": "SC-010", "시나리오명": "품절 상태 고객 화면 반영", "시작 조건": "관리자 품절 처리", "종료 조건": "키오스크 품절 표시", "기본 흐름": "품절 변경 → 화면 반영", "예외 흐름": "", "상태": "초안"}),
    ("39151ef04f0b81ab9a44d01540d67a95", "장바구니 수량 변경", {"시나리오 ID": "SC-011", "시나리오명": "장바구니 수량 변경", "시작 조건": "장바구니에 항목 존재", "종료 조건": "총액 재계산", "기본 흐름": "수량 변경/삭제", "예외 흐름": "", "상태": "초안"}),
    ("39251ef04f0b81cfa42be317f935c85b", "관리자 주문 상태 변경", {"시나리오 ID": "SC-012", "시나리오명": "관리자 주문 상태 변경", "시작 조건": "관리자 주문 상세", "종료 조건": "상태 변경 완료", "기본 흐름": "상태 변경", "예외 흐름": "잘못된 전이", "상태": "초안"}),
    ("39151ef04f0b8197a3eef6305fe345c6", "타임아웃 자동 초기화", {"시나리오 ID": "SC-013", "시나리오명": "타임아웃 자동 초기화", "시작 조건": "주문 중 미입력", "종료 조건": "홈 화면 복귀", "기본 흐름": "타임아웃 → 초기화", "예외 흐름": "", "상태": "초안"}),
    ("39151ef04f0b81f5892ce9384de4f834", "QR/바코드 스캔 할인", {"시나리오 ID": "SC-014", "시나리오명": "QR/바코드 스캔 할인", "시작 조건": "결제 단계", "종료 조건": "할인 적용", "기본 흐름": "스캔 → 할인", "예외 흐름": "유효하지 않은 쿠폰", "상태": "초안"}),
    ("39151ef04f0b81a08f33d8258c24b8d0", "영수증 출력", {"시나리오 ID": "SC-015", "시나리오명": "영수증 출력", "시작 조건": "결제 완료", "종료 조건": "영수증 출력", "기본 흐름": "출력 선택 → 출력", "예외 흐름": "출력 안함", "상태": "초안"}),
    ("39251ef04f0b81718105dab254a1954c", "관리자 일별 매출 조회", {"시나리오 ID": "SC-016", "시나리오명": "관리자 일별 매출 조회", "시작 조건": "관리자 매출 화면", "종료 조건": "데이터 표시", "기본 흐름": "기간 선택 → 조회", "예외 흐름": "", "상태": "초안"}),
    ("39151ef04f0b81abb8d5c758031d1251", "결제 성공 흐름", {"시나리오 ID": "SC-017", "시나리오명": "결제 성공 흐름", "시작 조건": "장바구니에 항목 존재", "종료 조건": "결제 승인", "기본 흐름": "결제수단 선택 → 결제", "예외 흐름": "", "상태": "초안"}),
    ("39251ef04f0b81a7812fd6f133f1cff4", "접근성 옵션 적용", {"시나리오 ID": "SC-018", "시나리오명": "접근성 옵션 적용", "시작 조건": "접근성 설정 화면", "종료 조건": "전체 화면 적용", "기본 흐름": "옵션 선택 → 적용", "예외 흐름": "", "상태": "초안"}),
]
for pid, title, props in SCENARIOS:
    add(pid, title, props)

if __name__ == "__main__":
    gen_main()
    print("part2 appended")
