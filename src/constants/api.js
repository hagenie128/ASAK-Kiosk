/** Client-facing API contract: `/api` paths and camelCase JSON. */
export const API_BASE_PATH = "/api";

export const API_ENDPOINTS = Object.freeze({
  // 목표 계약(구현 가이드): GET /api/kiosk/menuList — 현재 mock·기존 경로는 /menus
  categories: "/categories",
  menus: "/menus",
  kioskMenuList: "/kiosk/menuList",
  menu: (menuId) => `/menus/${menuId}`,
  menuOptions: (menuId) => `/menus/${menuId}/options`,
  orders: "/orders",
  payments: "/payments",
  adminOrders: "/admin/orders",
  adminOrderStatus: (orderId) => `/admin/orders/${orderId}/status`,
  adminSoldOutItems: "/admin/sold-out-items",
  adminMenus: "/admin/menus",
  paymentMethods: "/payment-methods",
  adminPaymentMethod: (methodId) => `/admin/payment-methods/${methodId}`,
  adminSalesDaily: "/admin/sales/daily",
});
