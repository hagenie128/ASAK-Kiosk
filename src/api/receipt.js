import { API_ENDPOINTS } from "../constants/api";
import { apiClient, unwrapResponse } from "./client";

/**
 * 영수증 출력/ 결과값 api
 *
 * 영수증 출력을 원할 시 -> 백엔드로부터 보내는 request
 *
 * [영수증 출력시 ]
    {
      "eventType": "PRINT_RECEIPT",
      "payload": "영수증 출력 데이터",
      "requestId": "receipt-364-550e8400-e29b-41d4-a716-446655440000"
    }
 *
  [주문 번호 출력시]

    {
    "requestId": "waiting-number-364-550e8400-e29b-41d4-a716-446655440000"
  }
 *

  payload --> RTOS가 실제 출력할 영수증 내용
 */

//영수증 출력
export const requestReceiptPrint  = ({orderId , receiptPayload }) =>
  apiClient.post(API_ENDPOINTS.orderReceipt(orderId), {
    eventType: "PRINT_RECEIPT",
    payload : receiptPayload,
    requestId : crypto.randomUUID(),
  }).then(unwrapResponse);

//주문 번호 출력
export const requestWaitingNumberPrint  = ({orderId}) => (
  apiClient.post(API_ENDPOINTS.orderNoReceipt(orderId), {
    requestId : crypto.randomUUID(),
  })
).then(unwrapResponse);

//출력 성공 유무
export const getDeviceEvent = (eventId) => (
  apiClient.get(API_ENDPOINTS.deviceEvent(eventId))).then(unwrapResponse);
