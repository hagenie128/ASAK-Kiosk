import { formatCurrency } from "@/utils/currency";
import React from "react";

/** SCR-003 BottomCTA — 담은 메뉴 요약 + 결제하기 */
export default function MenuListFooter({ itemCount, totalPrice, onCheckout }) {
  const hasItems = itemCount > 0;

  return (
    <footer className="menu-list-footer">
      <div className="menu-list-footer__summary">
        <span className="menu-list-footer__count">담은 메뉴 {itemCount}개</span>
        <span className="menu-list-footer__price">
          {hasItems ? formatCurrency(totalPrice) : "0원"}
        </span>
      </div>
      <button
        type="button"
        className="menu-list-footer__cta"
        disabled={!hasItems}
        onClick={onCheckout}
      >
        결제하기
      </button>
    </footer>
  );
}
