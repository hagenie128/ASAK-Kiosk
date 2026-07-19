// SCR-023 / Receipt — Figma 3014:40926 계열
/**
 * [FIGMA-AI] Figma 영수증 프레임과 printing/error/success 상태를 옮긴 화면입니다.
 * [AI-LOGIC] LINES와 viewState는 영수증 출력 상태 QA 미리보기용 목업입니다.
 * 실제 주문 항목과 프린터 연동은 아직 연결하지 않은 상태입니다.
 */
import Header from "@/components/kiosk/Header";
import { formatWon } from "@/data/staticUi";

const LINES = [
  { name: "시그니처 샐러드 x1", price: 9800 },
  { name: "음료 세트 x1", price: 3000 },
  { name: "옵션 추가", price: 4000 },
];

export default function ReceiptPage({ viewState = "preview" } = {}) {
  const statusLabel =
    viewState === "printing"
      ? "인쇄 중…"
      : viewState === "error"
        ? "인쇄 실패"
        : viewState === "success"
          ? "인쇄 완료"
          : "주문 내역을 확인하세요";
  const figmaNode =
    viewState === "printing"
      ? "3014:41168"
      : viewState === "error"
        ? "3014:41170"
        : viewState === "success"
          ? "3014:41047"
          : "3014:40926";

  return (
    <div
      className={`receipt-page${viewState !== "preview" ? ` is-${viewState}` : ""}`}
      data-figma-node={figmaNode}
      data-view-state={viewState}
    >
      <Header />
      <main className="receipt-page__content">
        <h1>영수증</h1>
        <p className={`receipt-page__hint${viewState === "error" ? " is-error" : ""}${viewState === "success" ? " is-success" : ""}`}>
          {statusLabel}
        </p>

        <article className={`receipt-ticket${viewState === "printing" ? " is-printing" : ""}`}>
          <i className="receipt-ticket__hang" aria-hidden="true" />
          <span>주문번호</span>
          <strong>1225</strong>
          <hr />
          <ul>
            {LINES.map((line) => (
              <li key={line.name}>
                <span>{line.name}</span>
                <b>{formatWon(line.price)}</b>
              </li>
            ))}
          </ul>
          <hr />
          <p className="receipt-ticket__total">
            <span>합계</span>
            <b>{formatWon(16800)}</b>
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
          {viewState === "printing" ? "인쇄 중…" : "닫기"}
        </button>
      </footer>
    </div>
  );
}
