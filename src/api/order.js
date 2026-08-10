import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

/**
 * 주문 생성
 * 요청 정본
  * {
    "orderType": "TAKE_OUT",
    "items": [
      {
        "menuId": 364,
        "quantity": 1,
        "optionItems": [],
        "excludedIngredientIds": []
      }
    ]
  }
 * 성공 후 approvePayment 연결 · complete에는 orderNo 필요

 */
export const createOrder = (orderRequest) =>
  apiClient.post(API_ENDPOINTS.orders, orderRequest).then(unwrapResponse);

