// SCR-023 / Receipt — Future Scope (프린터 실연동 제외 가능)
// UI 뼈대만. 완료 화면 CTA에서 넘길 props 자리.
//
// Props: orderNumber, lines[{ name, quantity, price }], totalPrice, status
//   status: preview | printing | error | success
// 데이터 출처 후보: orderSession.order + cart 스냅샷 (결제 직전)
// 표: public/mocks/README.md §3 (orderNo/totalPrice)
import Header from "@/components/kiosk/Header";
import { formatCurrency } from "@/utils/currency";

export default function ReceiptPage({
  orderNumber = null,
  lines = [],
  totalPrice = 0,
  status = "preview",
} = {}) {
  const statusLabel =
    status === "printing"
      ? "인쇄 중…"
      : status === "error"
        ? "인쇄 실패"
        : status === "success"
          ? "인쇄 완료"
          : "주문 내역을 확인하세요";

  return (
    <div className={`receipt-page${status !== "preview" ? ` is-${status}` : ""}`}>
      <Header />
      <main className="receipt-page__content">
        <h1>영수증</h1>
        <p
          className={`receipt-page__hint${status === "error" ? " is-error" : ""}${status === "success" ? " is-success" : ""}`}
        >
          {statusLabel}
        </p>

        <article className={`receipt-ticket${status === "printing" ? " is-printing" : ""}`}>
          <i className="receipt-ticket__hang" aria-hidden="true" />
          <span>주문번호</span>
          <strong>{orderNumber ?? "—"}</strong>
          <hr />
          <ul>
            {lines.length === 0 ? (
              <li>
                <span>—</span>
                <b>—</b>
              </li>
            ) : (
              lines.map((line) => (
                <li key={line.id ?? line.name}>
                  <span>{line.name}</span>
                  <b>{formatCurrency(line.price)}</b>
                </li>
              ))
            )}
          </ul>
          <hr />
          <p className="receipt-ticket__total">
            <span>합계</span>
            <b>{formatCurrency(totalPrice)}</b>
          </p>
          <div className="receipt-ticket__barcode" aria-hidden="true">
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} style={{ height: `${28 + ((i * 7) % 28)}px` }} />
            ))}
          </div>
          <small>ASALADAKIOSK</small>
        </article>
      </main>
      <footer className="receipt-page__footer">
        <button type="button" disabled className="is-primary">
          {status === "printing" ? "인쇄 중…" : "닫기"}
        </button>
      </footer>
    </div>
  );
}
