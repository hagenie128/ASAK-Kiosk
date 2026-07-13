import { apiClient } from "./client";

// API-007 GET /api/admin/orders
export async function getAdminOrders(params) {
  const res = await apiClient.get("/api/admin/orders", { params });
  return res.data.data;
}

// API-008 PATCH /api/admin/orders/{orderId}/status
export async function updateOrderStatus(orderId, status) {
  const res = await apiClient.patch(`/api/admin/orders/${orderId}/status`, { status });
  return res.data.data;
}
