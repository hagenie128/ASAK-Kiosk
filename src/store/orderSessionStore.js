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

export const useOrderSession = create((set) => ({
  ...initialState,

  setOrderType: (orderType) => set({ orderType }),

  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItemQuantity: (index, quantity) =>
    set((state) => ({
      items: state.items.map((it, i) =>
        i === index ? { ...it, quantity } : it,
      ),
    })),
  removeItem: (index) =>
    set((state) => ({ items: state.items.filter((_, i) => i !== index) })),

  setOrder: (order) => set({ order }),
  setPayment: (payment) => set({ payment, paymentError: null }),
  setPaymentError: (paymentError) => set({ paymentError }),

  // 결제 APPROVED 뒤에만 호출
  resetSession: () => set(initialState),
}));
