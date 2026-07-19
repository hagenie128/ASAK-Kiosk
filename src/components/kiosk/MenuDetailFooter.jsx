// 메뉴 디테일 하단 CTA — 표시 전용
export default function MenuDetailFooter({ disabled = true, totalPrice, onConfirm }) {
  const formatted =
    typeof totalPrice === "number" && !Number.isNaN(totalPrice)
      ? `${Number(totalPrice).toLocaleString("ko-KR")}원`
      : null;

  return (
    <footer className="menu-detail-footer">
      <button type="button" disabled={disabled} onClick={onConfirm}>
        장바구니에 담기{formatted ? ` · ${formatted}` : ""}
      </button>
    </footer>
  );
}
