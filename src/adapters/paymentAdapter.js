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
  // TODO(WBS2-026): 성공/실패 분기 매핑 구현
  return envelope;
}
