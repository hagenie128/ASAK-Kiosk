/** Client-facing API contract: `/api` paths and camelCase JSON. */
export const API_BASE_PATH = "/api/kiosk";

export const API_ENDPOINTS = Object.freeze({
  categories: `${API_BASE_PATH}/categories`,
  menus: `${API_BASE_PATH}/menuList`,
  menu: (menuId) => `${API_BASE_PATH}/menuDetail/${menuId}`,
  carts: `${API_BASE_PATH}/cart/validate`,
  orders: `${API_BASE_PATH}/orders`,
  paymentMethods:`${API_BASE_PATH}/payment-methods`,
  payments: `${API_BASE_PATH}/payments`,
  orderReceipt : (orderId)=> `${API_BASE_PATH}/orders/${orderId}/receipt-print`,
  orderNoReceipt : (orderId)=> `${API_BASE_PATH}/orders/${orderId}/waiting-number-print`,
  deviceEvent : (eventId) => `${API_BASE_PATH}/orders/device-events/${eventId}`,
});
