export const ORDER_SESSION_RESET_REASON = Object.freeze({
  PAYMENT_APPROVED: "PAYMENT_APPROVED",
  TIMEOUT_CONFIRMED: "TIMEOUT_CONFIRMED",
});

export function shouldResetOrderSession({ paymentStatus, timeoutConfirmed }) {
  return paymentStatus === "APPROVED" || timeoutConfirmed === true;
}
