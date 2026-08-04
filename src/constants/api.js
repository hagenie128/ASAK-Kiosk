/** Client-facing API contract: `/api` paths and camelCase JSON. */
export const API_BASE_PATH = "/api";

export const API_ENDPOINTS = Object.freeze({
  categories: "/api/kiosk/categories",
  menus: "/api/kiosk/menuList",
  menu: (menuId) => `/api/kiosk/menuDetail/${menuId}`,
  menuOptions: (menuId) => `/menus/${menuId}/options`,
  orders: "/orders",
  payments: "/payments",
});
