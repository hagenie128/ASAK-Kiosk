// Figma SCR 화면 표시용 정적 데이터. API·store 연결 전 UI 검증 전용.
import cartProduct from "../assets/figma/cart-product-sample.png";

export const STATIC_CART_ITEMS = [
  {
    cartItemId: "static-1",
    menuName: "멕시칸 랩",
    unitPrice: 8400,
    quantity: 1,
    imageUrl: cartProduct,
    optionSummary: "제외 재료 1개 · 추가 옵션 2개",
    lineTotal: 8400,
    kcal: 560,
    minusDisabled: true,
  },
  {
    cartItemId: "static-2",
    menuName: "클래식 시저 샐러드",
    unitPrice: 8400,
    quantity: 1,
    imageUrl: cartProduct,
    optionSummary: "추가 옵션 1개",
    lineTotal: 8400,
    kcal: 560,
    minusDisabled: true,
  },
];

export const STATIC_CART = {
  itemCount: STATIC_CART_ITEMS.length,
  quantityTotal: 2,
  totalPrice: 16800,
  items: STATIC_CART_ITEMS,
};

export const STATIC_PAYMENT = {
  orderType: "포장",
  itemCount: 2,
  totalPrice: 16800,
  methods: [
    { id: "card", label: "신용/체크카드", hint: "IC칩·삼성페이·애플페이" },
    { id: "kakao", label: "카카오페이", hint: "QR·바코드" },
  ],
};

export const STATIC_COMPLETE = {
  orderNumber: "A-1325",
  waitingCount: 3,
  totalPrice: 16800,
  orderType: "포장",
};

export const STATIC_ACCESSIBILITY = {
  options: [
    { id: "high-contrast", label: "고대비 모드", enabled: false },
    { id: "large-text", label: "큰 글씨", enabled: false },
    { id: "reduce-motion", label: "움직임 줄이기", enabled: false },
  ],
};

export function formatWon(value) {
  return `${Number(value || 0).toLocaleString("ko-KR")}원`;
}
