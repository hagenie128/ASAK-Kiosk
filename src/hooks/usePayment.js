/**
 * PaymentPage용 결제 hook (WBS2-026~027) — 자리표시자
 *
 * 입력 후보:
 *   methodId (paymentMethods.methodId)
 *   amount (calculateCartTotal)
 *   scenarioKey? (dev: approve|declined|network|…)
 *
 * 출력 후보:
 *   isPaying, selectedMethodId, error
 *   approve() → paymentScenarios.* envelope
 *     성공: setPayment(data) → navigate /complete · clearItems
 *     실패: setPaymentError({ code, message, reason }) → /payment-error · cart 유지
 *
 * 규칙: 중복 결제 방지(isPaying lock) · priceCalculation만 금액
 * mock 표: public/mocks/README.md §1~2
 */
export function usePayment() {
  return {
    isPaying: false,
    selectedMethodId: null,
    error: null,
    // TODO(WBS2-026): mock scenario / API 연결
    approve: async () => {
      throw new Error("usePayment.approve: 미연결 (WBS2-026)");
    },
  };
}
