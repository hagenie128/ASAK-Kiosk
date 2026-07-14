import { create } from "zustand";

const emptySession = () => ({
  orderType: null,
  items: [],
  order: null,
  payment: null,
  paymentError: null,
});

/** Only customer order-session state belongs in a global store. */
export const useOrderSessionStore = create((set, get) => ({
  ...emptySession(),
  lastCompletedOrder: null,
  setOrderType: (orderType) => set({ orderType }),
  setItems: (items) => set({ items }),
  setOrder: (order) => set({ order }),
  setPaymentError: (paymentError) => set({ paymentError }),

  resetOrderSession: (reason, completedOrder = null) => {
    if (reason !== "PAYMENT_APPROVED" && reason !== "TIMEOUT_CONFIRMED") {
      throw new Error(`Order session reset is not allowed for: ${reason}`);
    }
    set({ ...emptySession(), lastCompletedOrder: completedOrder ?? get().lastCompletedOrder });
  },

  handlePaymentResult: (payment) => {
    if (payment?.paymentStatus !== "APPROVED") {
      // A failed payment retains cart, selected options, order type, and order.
      set({ paymentError: payment });
      return false;
    }
    get().resetOrderSession("PAYMENT_APPROVED", { order: get().order, payment });
    return true;
  },

  confirmTimeout: () => get().resetOrderSession("TIMEOUT_CONFIRMED"),
  clearCompletedOrder: () => set({ lastCompletedOrder: null }),
}));
