import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

/**
 * 주문 생성 (결제 직전, WBS2-026~028)
 * 요청 정본: orderType, items[].{menuId, quantity, optionItems[], excludedIngredientIds[]}
 * 성공 후 approvePayment 연결 · complete에는 orderNo 필요
 * 표: public/mocks/README.md §3~4
 */
export const createOrder = (payload) =>
  apiClient.post(API_ENDPOINTS.orders, payload).then(unwrapResponse);

