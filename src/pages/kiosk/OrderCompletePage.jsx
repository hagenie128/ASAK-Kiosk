// SCR-008 / Order Complete — Figma 134:7926
import Header from "@/components/kiosk/Header";
import { formatWon, STATIC_CART, STATIC_COMPLETE } from "@/data/staticUi";

export default function OrderCompletePage({ viewState = "default" } = {}) {
  return (
    <div className="order-complete-page" data-figma-node="134:7926" data-view-state={viewState}>
      <Header />
      <main className="order-complete-page__content">
        <div className="kiosk-step-indicator" aria-label="주문 4단계 중 완료">
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-current" />
        </div>
        <h1>주문이 완료되었어요.</h1>
        <article className="receipt-card" aria-label="주문 영수증 정적 미리보기">
          <i />
          <span>주문번호</span>
          <strong>{STATIC_COMPLETE.orderNumber}</strong>
          <hr />
          <ul>
            {STATIC_CART.items.map((item) => (
              <li key={item.cartItemId}>
                <span>
                  {item.menuName} x{item.quantity}
                </span>
                <b>{formatWon(item.lineTotal)}</b>
              </li>
            ))}
          </ul>
          <hr />
          <p>
            <span>합계</span>
            <b>{formatWon(STATIC_COMPLETE.totalPrice)}</b>
          </p>
          <em aria-hidden="true" />
          <small>ASALADAKIOSK</small>
        </article>
        <p className="order-complete-page__queue">
          현재 앞에 {STATIC_COMPLETE.waitingCount}개의 주문이 있어요.
        </p>
        <p className="order-complete-page__return">5 초 후 초기화면으로 돌아갑니다</p>
      </main>
      <footer className="order-complete-page__footer">
        <button type="button" disabled>
          홈으로
        </button>
        <button type="button" disabled>
          영수증 보기
        </button>
      </footer>
    </div>
  );
}
