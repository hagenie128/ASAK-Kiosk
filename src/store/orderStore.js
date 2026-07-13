import { create } from "zustand";

// 주문 진행 중 화면을 넘나들며 유지해야 하는 값 (SCR-001에서 선택한 orderType 등)
export const useOrderStore = create((set) => ({
  orderType: null, // "EAT_IN" | "TAKE_OUT"
  setOrderType: (orderType) => set({ orderType }),

  lastOrder: null, // 주문 완료 화면(SCR-008)에서 보여줄 최근 주문 결과
  setLastOrder: (order) => set({ lastOrder: order }),

  reset: () => set({ orderType: null, lastOrder: null }),
}));
