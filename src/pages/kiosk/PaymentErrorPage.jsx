// SCR-012 / Payment Error — Figma 134:7900
// UI 뼈대: 결제 화면 위 Confirm 모달 (거절/네트워크)
// 연결 예정: 결제 실패 응답 · 재시도 · 장바구니 복귀
// 금지: 금액 목업, 화면 전체 자동생성 React
import Header from "@/components/kiosk/Header";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { calculateCartTotal } from "@/utils/priceCalculation";

export default function PaymentErrorPage({
  title = "결제 실패",
  lines = ["결제 중 오류가 발생했습니다.", "다시 시도해 주세요."],
  secondaryLabel = "취소",
  primaryLabel = "다시 시도",
} = {}) {
  const items = useCartStore((state) => state.items);
  const totalPrice = calculateCartTotal(items);

  return (
    <div className="kiosk-modal-page">
      <Header />
      <main className="kiosk-modal-page__content">
        <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제">
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-current" />
        </div>
        <section className="kiosk-modal-page__hero">
          <span>총 결제금액</span>
          <strong>{formatCurrency(totalPrice)}</strong>
          <p>
            승인 요청중입니다
            <br />
            잠시만 기다려 주세요
          </p>
        </section>
      </main>
      <footer className="kiosk-modal-page__footer">
        <button type="button" disabled>
          장바구니로 돌아가기
        </button>
        <button type="button" disabled className="is-primary">
          다시 결제하기
        </button>
      </footer>

      <div className="kiosk-modal-overlay" aria-hidden="true" />
      <div
        className="kiosk-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-error-title"
      >
        <h2 id="payment-error-title">{title}</h2>
        <p>
          {lines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <div className="kiosk-modal__actions">
          <button type="button" disabled>
            {secondaryLabel}
          </button>
          <button type="button" disabled className="is-primary">
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
