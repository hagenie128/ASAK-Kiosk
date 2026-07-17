// 메뉴 디테일 페이지 footer버튼
import React from "react";
import { formatCurrency } from "@/utils/currency";

export default function MenuDetailFooter({ disabled, totalPrice, onConfirm }) {
  const formatted =
    typeof totalPrice === "number" && !isNaN(totalPrice)
      ? formatCurrency(totalPrice)
      : null;

  return (
    <footer className="menu-detail-footer">
      <button type="button" onClick={onConfirm} disabled={disabled}>
        장바구니에 담기{formatted ? " · " + formatted : ""}
      </button>
    </footer>
  );
}
