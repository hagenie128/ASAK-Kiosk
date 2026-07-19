// SCR-007 / Payment — Figma 134:7861 계열
import Header from "@/components/kiosk/Header";
import cardIcon from "@/assets/figma/icon-kiosk-card.svg";
import kakaoPayLogo from "@/assets/figma/logo-kakaopay.png";
import paymentIllustration from "@/assets/figma/payment-processing-illustration.png";
import { formatWon, STATIC_CART, STATIC_PAYMENT } from "@/data/staticUi";

const METHODS = [
  [cardIcon, "카드/삼성페이 결제", "신용·체크카드", "payment-page__method-icon--card"],
  [kakaoPayLogo, "카카오페이 결제", "모바일 간편결제", "payment-page__method-icon--kakao"],
];

export default function PaymentPage({ viewState = "default" } = {}) {
  const selected =
    viewState === "selected" ||
    viewState === "selection" ||
    viewState === "expanded" ||
    viewState === "processing" ||
    viewState === "progress";
  const expanded = viewState === "expanded";
  const processing = viewState === "processing" || viewState === "progress";
  const loading = viewState === "loading";
  const disabledAll = viewState === "disabled";
  const networkError = viewState === "error" || viewState === "network-error" || viewState === "load-error";
  const canPay = selected && !processing && !disabledAll && !loading && !networkError;

  if (loading) {
    return (
      <div className="payment-page" data-figma-node="134:8091" data-view-state={viewState}>
        <Header />
        <main className="payment-page__content payment-page__content--loading">
          <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제">
            <span className="is-done" />
            <span className="is-done" />
            <span className="is-done" />
            <span className="is-current" />
          </div>
          <p className="payment-page__loading">결제 수단을 불러오는 중…</p>
        </main>
        <footer className="payment-page__footer" style={{ opacity: 0.4 }}>
          <button type="button" disabled>
            뒤로가기
          </button>
          <button type="button" disabled className="is-primary">
            결제하기
          </button>
        </footer>
      </div>
    );
  }

  if (networkError) {
    return (
      <div className="payment-page" data-figma-node="226:6374" data-view-state={viewState}>
        <Header />
        <main className="payment-page__content payment-page__content--error">
          <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제">
            <span className="is-done" />
            <span className="is-done" />
            <span className="is-done" />
            <span className="is-current" />
          </div>
          <section className="payment-page__error-panel" role="alert">
            <h2>결제 수단을 불러오지 못했습니다</h2>
            <p>
              네트워크 연결을 확인한 뒤
              <br />
              다시 시도해 주세요.
            </p>
            <button type="button" disabled className="is-primary">
              다시 시도
            </button>
          </section>
        </main>
        <footer className="payment-page__footer">
          <button type="button" disabled>
            뒤로가기
          </button>
          <button type="button" disabled className="is-primary" style={{ opacity: 0.4 }}>
            결제하기
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div
      className={`payment-page${processing ? " is-processing" : ""}${expanded ? " is-expanded" : ""}`}
      data-figma-node={processing ? "134:7889" : expanded ? "134:7875" : selected ? "226:4014" : "134:7861"}
      data-view-state={viewState}
    >
      <Header />
      <main className="payment-page__content">
        <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제">
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-current" />
        </div>
        <section className="payment-page__hero">
          <span>총 결제금액</span>
          <strong>{formatWon(STATIC_PAYMENT.totalPrice)}</strong>
          <p>
            {processing ? (
              <>
                승인 요청중입니다
                <br />
                잠시만 기다려 주세요
              </>
            ) : (
              "결제 수단을 확인해주세요"
            )}
          </p>
        </section>

        {processing ? (
          <div className="payment-page__illustration" aria-hidden="true">
            <img src={paymentIllustration} alt="" />
          </div>
        ) : (
          <>
            <div className="payment-page__methods" aria-label="결제 수단">
              {METHODS.map(([icon, title, description, tone], index) => (
                <button
                  key={title}
                  type="button"
                  disabled
                  className={selected && index === 0 ? "is-selected" : ""}
                  style={disabledAll ? { opacity: 0.45 } : undefined}
                >
                  <img className={`payment-page__method-icon ${tone}`} alt="" src={icon} />
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                </button>
              ))}
            </div>
            <section
              className={`payment-page__summary${expanded ? " is-expanded" : ""}`}
              aria-label="주문 정보 미리보기"
              aria-expanded={expanded}
            >
              <div className="payment-page__summary-head">
                <strong>주문정보 확인</strong>
                <span className="payment-page__summary-meta">
                  {STATIC_PAYMENT.itemCount}개 메뉴 / 총 {formatWon(STATIC_PAYMENT.totalPrice).replace("원", "")} 원
                  <i className="payment-page__summary-chevron" aria-hidden="true" />
                </span>
              </div>
              {expanded ? (
                <ul className="payment-page__summary-lines">
                  {STATIC_CART.items.map((item) => (
                    <li key={item.cartItemId}>
                      <span>
                        {item.menuName} ×{item.quantity}
                      </span>
                      <b>{formatWon(item.lineTotal)}</b>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          </>
        )}
      </main>
      <footer className="payment-page__footer" style={processing || disabledAll ? { opacity: 0.3 } : undefined}>
        <button type="button" disabled>
          뒤로가기
        </button>
        <button type="button" disabled className={`is-primary${canPay ? " is-ready" : ""}`}>
          {processing ? "결제하기" : "결제하기"}
        </button>
      </footer>
    </div>
  );
}
