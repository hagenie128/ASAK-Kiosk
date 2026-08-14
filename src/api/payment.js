import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

/**
 * 결제 승인 (WBS2-026) — 실서버 전엔 mock scenario로 대체 가능
 * 요청 정본: { orderId, paymentMethodCode, idempotencyKey }
 * 응답: paymentScenarios.* 와 동일 envelope 형태 기대
 * 표: public/mocks/README.md · 샘플: public/mocks/payment-scenarios.sample.json
 */
export const approvePayment = (payload) =>
  apiClient.post(API_ENDPOINTS.payments, payload).then(unwrapResponse);

