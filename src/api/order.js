import { apiClient } from "./client";

// API-005 POST /api/orders — 백엔드 준비 전까지는 자리만 잡아둠
export async function createOrder(payload) {
  const res = await apiClient.post("/api/orders", payload);
  return res.data.data;
}

// API-006 POST /api/orders/{orderId}/payment
export async function requestPayment(orderId, payload) {
  const res = await apiClient.post(`/api/orders/${orderId}/payment`, payload);
  return res.data.data;
}
