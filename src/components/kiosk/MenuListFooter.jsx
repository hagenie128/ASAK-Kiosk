// Shared/CartFooterBar 요약 — Figma BottomCTA cartSummary
import { formatWon } from "@/data/staticUi";

export default function MenuListFooter({ itemCount = 0, totalPrice = 0, onCheckout }) {
  const hasItems = itemCount > 0;

  return (
    <footer className="menu-list-footer">
      <div>
        <span>담은 메뉴 {itemCount}개</span>
        <span className="menu-list-footer__summary">{formatWon(hasItems ? totalPrice : 0)}</span>
      </div>
      <button
        className="menu-list-footer__cta"
        type="button"
        disabled={!hasItems}
        onClick={onCheckout}
      >
        결제하기
      </button>
    </footer>
  );
}
