// 경로 상수 — 화면 설계 DB의 SCR-xxx ID와 매칭해서 관리
export const ROUTES = {
  // 키오스크 (고객)
  KIOSK_HOME: "/", // SCR-001 홈 (매장·포장)
  KIOSK_MENU_LIST: "/menu", // SCR-003 메뉴 선택
  KIOSK_MENU_DETAIL: "/menu/:menuId", // SCR-004 메뉴 상세/옵션 선택
  KIOSK_CART: "/cart", // SCR-005 장바구니·주문확인
  KIOSK_PAYMENT: "/payment", // SCR-007 결제
  KIOSK_ORDER_COMPLETE: "/order-complete", // SCR-008 주문 완료
  KIOSK_ACCESSIBILITY: "/accessibility", // SCR-014 접근성 설정

  // 관리자
  ADMIN_LOGIN: "/admin/login", // SCR-015
  ADMIN_ORDERS: "/admin/orders", // SCR-009 관리자 주문 관리
  ADMIN_ORDER_DETAIL: "/admin/orders/:orderId", // SCR-010 관리자 주문 상세
  ADMIN_MENUS: "/admin/menus", // SCR-016 관리자 메뉴 관리
  ADMIN_MENU_EDIT: "/admin/menus/:menuId/edit", // SCR-017 관리자 메뉴 등록/수정
  ADMIN_SOLD_OUT: "/admin/sold-out", // SCR-011 관리자 판매 항목 품절 관리
  ADMIN_PAYMENT_METHODS: "/admin/payment-methods", // SCR-018
  ADMIN_SALES: "/admin/sales", // SCR-019 관리자 매출 요약
};

export function menuDetailPath(menuId) {
  return `/menu/${menuId}`;
}

export function adminOrderDetailPath(orderId) {
  return `/admin/orders/${orderId}`;
}
