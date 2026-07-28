// 메뉴 디테일 하단 CTA — 담기 확정 + 예상 금액
import { formatCurrency } from "@/utils/currency";

export default function MenuDetailFooter({ disabled = true, totalAmount, onConfirm }) {
  const formatted =
    typeof totalAmount === "number" && !Number.isNaN(totalAmount)
      ? formatCurrency(totalAmount)
      : null;

  return (
    <footer className="menu-detail-footer">
      <button type="button" disabled={disabled} onClick={onConfirm}>
        장바구니에 담기{formatted ? ` · ${formatted}` : ""}
      </button>
    </footer>
  );
}
