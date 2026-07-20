import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

/**
 * 결제 승인 (WBS2-026) — 실서버 전엔 mock scenario로 대체 가능
 * payload 후보: { orderId, orderNo, amount, paymentMethod }
 * 응답: paymentScenarios.* 와 동일 envelope 형태 기대
 * 표: public/mocks/README.md §2
 */
export const approvePayment = (payload) =>
  apiClient.post(API_ENDPOINTS.payments, payload).then(unwrapResponse);

