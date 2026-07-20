/**
 * 주문·결제 상태 상수 (남은 결제 분기용)
 *
 * orderStatus:   RECEIVED | PREPARING | COMPLETED | CANCELLED
 * paymentStatus: READY | APPROVED | FAILED
 * payment reason (mock): DECLINED | INSUFFICIENT | NETWORK | TIMEOUT |
 *                        DUPLICATE | METHOD_DISABLED
 * orderType: EAT_IN | TAKE_OUT  → constants/order.js
 * 표: public/mocks/README.md §2
 */
export const PAYMENT_STATUS = Object.freeze({
  READY: "READY",
  APPROVED: "APPROVED",
  FAILED: "FAILED",
});

export const ORDER_STATUS = Object.freeze({
  RECEIVED: "RECEIVED",
  PREPARING: "PREPARING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
});
