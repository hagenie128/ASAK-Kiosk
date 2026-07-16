// 수량 제한만 하는 유틸 함수
/* 
| 구분         |     제한 | 초과 시         |
| ---------- | -----: | ------------ |
| 동일 메뉴 총수량  |  최대 9개 | 대량 주문 안내 토스트 |
| 장바구니 전체 수량 | 최대 30개 | 전체 수량 제한 토스트 |
| 최소 수량      |     1개 | `−` 비활성화     |

*/

export const MAX_QUANTITY_PER_MENU = 9; //1개의 메뉴
export const MAX_CART_QUANTITY = 30; // 장바구니의 최대수량


export const TOAST_MESSAGES = {
  MENU_LIMIT: "메뉴당 최대 9개까지 주문할 수 있습니다. 대량 주문은 직원에게 문의해 주세요.",
  CART_LIMIT: "한 번에 최대 30개까지 주문할 수 있습니다. 장바구니 수량을 확인해 주세요.",
};

//현재 장바구니에 같은 메뉴가 몇 개 들어있는지
function getMenuQuantityInCart(items, menuId) {
  return items
    .filter((item) => item.menuId === menuId)
    .reduce((sum, item) => sum + item.quantity, 0);
}
// 장바구니에 total 몇개씩 누적됐는지 확인 로직
function getCartTotalQuantity(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

// SCR-004 전용(상세 페이지): 아직 장바구니에 안 담긴, 지금 고르는 중인 수량(draftQuantity) 기준
export function canIncreaseQuantity({ items, menuId, draftQuantity }) {

  //draftQuantity : 현재 추가중인 옵션 선택 갯수
  const menuTotal = getMenuQuantityInCart(items, menuId) + draftQuantity + 1;

  if (menuTotal > MAX_QUANTITY_PER_MENU) {
    return { allowed: false, reason: "MENU_LIMIT" };
  }

  const cartTotal = getCartTotalQuantity(items) + draftQuantity + 1;
  if (cartTotal > MAX_CART_QUANTITY) {
    return { allowed: false, reason: "CART_LIMIT" };
  }

  return { allowed: true, reason: null };
}

// 메뉴 목록의 주문 목록 또는 장바구니에서
// 이미 저장된 항목의 수량을 1개 늘릴 수 있는지 검사
export function canIncreaseCartItemQuantity({
  items,
  menuId,
}) {
  const menuTotal =
    getMenuQuantityInCart(items, menuId) + 1;

  if (menuTotal > MAX_QUANTITY_PER_MENU) {
    return {
      allowed: false,
      reason: "MENU_LIMIT",
    };
  }

  const cartTotal =
    getCartTotalQuantity(items) + 1;

  if (cartTotal > MAX_CART_QUANTITY) {
    return {
      allowed: false,
      reason: "CART_LIMIT",
    };
  }

  return {
    allowed: true,
    reason: null,
  };
}