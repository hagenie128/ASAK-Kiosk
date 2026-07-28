/**
 * 결제 승인 API/mock → 완료·오류 화면 모델 (WBS2-026~028)
 *
 * 입력: paymentScenarios.* envelope 또는 API-006 응답
 * 성공 view-model 후보:
 *   orderNo, approvedAmount(=amount), approvedAt(=paidAt),
 *   paymentStatus, waitingOrderCount?
 * 실패 view-model 후보:
 *   code, message, reason, paymentStatus=FAILED
 *
 * UI에서 amount/approvedAmount 이름을 섞어 쓰지 말고 여기서만 매핑.
 * 표: public/mocks/README.md §2~3
 */
export function toPaymentResultView(envelope) {
  if (!envelope) return null;
  // TODO(API-006, real API wiring only): legacy mock amount→approvedAmount,
  // paidAt→approvedAt를 이 경계에서만 변환한다. 요청은 orderId,
  // paymentMethodCode, idempotencyKey만 전송하며 승인 금액은 서버 정본이다.
  // 지금은 mock envelope를 그대로 유지한다.
  return envelope;
}
