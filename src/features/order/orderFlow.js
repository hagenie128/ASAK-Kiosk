export const ORDER_SESSION_RESET_REASON = Object.freeze({
  PAYMENT_APPROVED: "PAYMENT_APPROVED",
  TIMEOUT_CONFIRMED: "TIMEOUT_CONFIRMED",
});

/**
 * 세션 초기화 여부 (결제 성공·타임아웃 확정만 true)
 * FAILED 결제는 false — cart 보존 (WBS2-027)
 */
export function shouldResetOrderSession({ paymentStatus, timeoutConfirmed }) {
  return paymentStatus === "APPROVED" || timeoutConfirmed === true;
}
