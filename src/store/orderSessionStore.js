import { create } from "zustand";

/**
 * 키오스크 주문 세션 (cart + order + payment).
 * Home~Cart 는 사용 중. 아래는 Payment~Complete 연결 시 쓰는 필드.
 *
 * order:   API-005 응답 · orderId, orderNo, orderType, totalPrice,
 *          orderStatus, paymentStatus
 * payment: API-006 / paymentScenarios · paymentMethod, paymentId,
 *          orderId, orderNo, amount, paymentStatus, paidAt
 * paymentError: { code, message, reason? } — SCR-012, cart 유지
 *
 * APPROVED → resetSession · FAILED → setPaymentError only
 * 표: public/mocks/README.md §4
 */
const initialState = {
  orderType: null, // 'EAT_IN' | 'TAKE_OUT'
  items: [], // { menuId, menuName, unitPrice, quantity, optionItems[], excludedIngredientIds[] }
  order: {
    // API-005 주문 생성 응답:
    orderId: null,
    orderNo: null,
    orderType: null,
    totalPrice: 0,
    orderStatus: null, // RECEIVED | PREPARING | COMPLETED
    paymentStatus: null, // READY | APPROVED | FAILED
  },
  payment: {
    // API-006 결제 처리 응답:
    paymentMethod: null, // CARD | KAKAO_PAY
    paymentId: null,
    orderId: null,
    orderNo: null,
    amount: 0,
    paymentStatus: null,
    paidAt: null,
  },
  paymentError: null, // 실패 code/message (SCR-012용)
};

// cartItemId
// → 프론트 임시 장바구니 항목 ID

// orderItemId
// → 서버 주문 생성 후 받을 가능성이 있는 주문 항목 ID

export const useOrderSession = create((set) => ({
  ...initialState,

  setOrderType: (orderType) => set({ orderType }),

  // [학습] 신규 담기 전용. Edit 화면에서 이 함수를 다시 호출하지 않는다.
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  // [학습] 수량만 바꾼다. 옵션·제외재료 수정은 별도 updateItem(cartItemId, patch)가 필요하다.
  updateItemQuantity: (cartItemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity }
          : item,
      ),
    })),

  // TODO(학습): updateItem(cartItemId, nextItemFields) — 옵션/제외재료 수정용. addItem과 경로를 섞지 말 것.
  // TODO(학습): 품절이 된 뒤에도 자동 remove 하지 말 것. 결제 차단 + 수정/삭제 UI만 제공한다.

  clearItems: () => set({ items: [] }),

  removeItem: (cartItemId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.cartItemId !== cartItemId,
      ),
    })),

  setOrder: (order) => set({ order }),

  setPayment: (payment) =>
    set({
      payment,
      paymentError: null,
    }),

  setPaymentError: (paymentError) =>
    set({ paymentError }),

  resetSession: () => set(initialState),
}));
