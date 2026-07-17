/*
 * 역할: 장바구니 "규칙 검사" 순수 함수 모음 (UI/Store 밖)
 * 입력: items, 변경하려는 cartItemId/quantity/options
 * 출력: 허용 여부, reason 코드, (선택) 정규화된 nextItems
 * 하지 말 것: React 상태, navigate, API, 가격 표시 포맷
 *
 * 책임 나누기 힌트:
 * - 숫자 한도(9/30) → quantityLimits.js가 정본
 * - 여기에는 "수정 시 수량 유지", "빈 장바구니 결제 불가", "품절 포함 시 결제 불가" 같은 조합 규칙을 둔다
 * - 실제 금액 합산 표시는 priceCalculation.js
 *
 * TODO 1: canSubmitCart(items)
 * TODO 2: assertEditKeepsOrderType(session, patch) — 수정이 orderType을 초기화하지 않는지
 * TODO 3: quantityLimits / soldOutPolicy 결과를 조합하는 facade만 남긴다 (중복 구현 금지)
 */
