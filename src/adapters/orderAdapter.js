/**
 * 주문 생성 API/mock → 완료 화면 모델 (WBS2-028)
 *
 * 입력: 주문 생성 응답 또는 orderCompleteSamples 행
 * view-model 후보 (정본 명칭 유지):
 *   orderNumber / orderNo
 *   totalAmount / totalPrice (mock은 totalPrice — 여기서 매핑)
 *   waitingOrderCount / waitingCount
 *   orderType
 *
 * 표: public/mocks/README.md §3
 */
export function toOrderCompleteView(payload) {
  if (!payload) return null;
  // TODO(WBS2-028): totalPrice→totalAmount, waitingCount→waitingOrderCount
  return payload;
}
