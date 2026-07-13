import { create } from "zustand";

// 장바구니 상태. 화면 간(메뉴상세 -> 장바구니 -> 결제) 공유 상태라 zustand로 뺐음.
export const useCartStore = create((set, get) => ({
  items: [], // { menuId, name, price, quantity, options: [...] }

  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),

  removeItem: (index) =>
    set((state) => ({ items: state.items.filter((_, i) => i !== index) })),

  updateQuantity: (index, quantity) =>
    set((state) => ({
      items: state.items.map((item, i) => (i === index ? { ...item, quantity } : item)),
    })),

  clear: () => set({ items: [] }),

  get totalPrice() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
