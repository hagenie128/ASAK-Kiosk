/*
 * 역할: 품절 "판단"의 단일 기준 (표시·결제 차단에 쓸 결과만 반환)
 * 입력: 메뉴/옵션/재료의 품절 플래그, (선택) 장바구니 항목
 * 출력: 메뉴 전체 품절 여부, 옵션 disabled 목록, 결제 차단 여부 등
 * 하지 말 것: JSX, Store에서 항목 자동 삭제, API 호출
 *
 * 정책 힌트:
 * - 핵심 재료 품절 → 메뉴 전체 품절
 * - 일반 옵션 품절 → 해당 옵션만 disabled
 * - Base 일부 품절 → 해당 Base만 disabled
 * - Cart 담은 뒤 품절되어도 자동 삭제 금지 → 수정/삭제 제공, 해결 전 결제 차단
 *
 * TODO 1: isMenuSoldOut(menu, ingredients)
 * TODO 2: isOptionItemDisabled(optionItem)
 * TODO 3: findCartItemsBlockedBySoldOut(items, soldOutSnapshot)
 * TODO 4: canProceedToPayment(items, soldOutSnapshot)
 */
