import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

/**
 * API-006 결제 승인
 *
 * 토스 인증 성공 결과를 백엔드에 전달
 * 백엔드는 주문번호·금액 검증 후 토스 승인 API를 호출한다.
 *
 * {
 *   "orderId": 1,
 *   "orderStatus": "RECEIVED",
 *   "paymentMethodCode": "TOSS_PAY",
 *   "idempotencyKey": "uuid",
 *   "tossPayment": {
 *     "paymentKey": "tgen_...",
 *     "orderId": "A202607230001",
 *     "amount": 8900
 *   }
 * }
 *
 * CARD는 tossPayment 없이 기존 승인 요청을 사용한다.
 *
 * 성공 data: paymentId, orderId, orderNo, paymentStatus, approvedAmount, approvedAt,
 *   waitingOrderNo — BE ApprovePaymentResponse 필드명 그대로 (구 초안 waitingOrderCount 아님)
 */
export const approvePayment = (payRequest) =>
  apiClient.post(API_ENDPOINTS.payments, payRequest).then(unwrapResponse);

