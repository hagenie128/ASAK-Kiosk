/**
 * 주문 생성 + 결제 요청을 묶는 훅 자리 (WBS2-026~028)
 *
 * 흐름: cart items → createOrder → approvePayment(scenario)
 *   성공: setOrder + setPayment → /complete
 *   실패: setPaymentError → /payment-error (items 유지)
 * mock: paymentScenarios · orderCompleteSamples
 * 표: public/mocks/README.md
 */
export function useOrder() {
  return {
    isSubmitting: false,
    // TODO(WBS2-026): createOrder + approvePayment 묶기
    submitAndPay: async () => {
      throw new Error("useOrder.submitAndPay: 미연결");
    },
  };
}
