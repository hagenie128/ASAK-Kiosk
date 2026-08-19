import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

/**
 * 결제 승인
 * 요청 정본:
  *  {
    "idempotencyKey": "uuid",
    "orderId": 1,
    "orderStatus": "RECEIVED",
    "paymentMethodCode": "CARD"
  }
 */
export const approvePayment = (payRequest) =>
  apiClient.post(API_ENDPOINTS.payments, payRequest).then(unwrapResponse);

