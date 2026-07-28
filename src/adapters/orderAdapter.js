/**
 * 주문 생성 API/mock → 완료 화면 모델 (WBS2-028)
 *
 * 입력: 주문 생성 응답 또는 orderCompleteSamples 행
 * view-model 후보 (정본 명칭 유지):
 *   orderNo
 *   totalAmount
 *   waitingOrderCount
 *   orderType
 *
 * 표: public/mocks/README.md §3
 */
export function toOrderCompleteView(payload) {
  if (!payload) return null;
  // TODO(API-005, real API wiring only): legacy mock orderNumber→orderNo,
  // totalPrice→totalAmount, waitingCount→waitingOrderCount를 이 경계에서만 변환한다.
  // 요청은 orderType, items[{ menuId, quantity, optionItems[{ optionItemId, quantity }],
  // excludedIngredientIds }]만 전송하고 totalAmount는 포함하지 않는다.
  // 지금은 mock payload를 그대로 유지한다.
  return payload;
}
