import { create } from "zustand";

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

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  updateItemQuantity: (cartItemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity }
          : item,
      ),
    })),

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
