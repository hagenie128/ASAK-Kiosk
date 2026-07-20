// SCR-013 / Timeout — Figma 134:7913 (WBS2-029~030)
// UI OK · 남은 연결: useKioskTimeout · 연장/초기화 · PROCESSING 중 정지
//
// 타이머: idleMs, enabled=!isPaying, onTimeout → TimeoutPage 또는 모달
// 확정 시: resetSession (orderFlow TIMEOUT_CONFIRMED)
// 표: public/mocks/README.md §5 · useKioskTimeout.js
//
// Props: title, lines, secondaryLabel?, primaryLabel?
// 추가 후보: countdownSec, onExtend, onReset
import Header from "@/components/kiosk/Header";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { calculateCartTotal } from "@/utils/priceCalculation";

export default function TimeoutPage({
  title = "시간 초과",
  lines = ["일정 시간 동안 조작이 없어", "주문이 취소되었습니다."],
  secondaryLabel = "처음으로",
  primaryLabel = "확인",
} = {}) {
  const items = useCartStore((state) => state.items);
  const totalPrice = calculateCartTotal(items);

  return (
    <div className="kiosk-modal-page">
      <Header />
      <main className="kiosk-modal-page__content">
        <div className="kiosk-step-indicator" aria-label="주문 단계">
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-current" />
        </div>
        <section className="kiosk-modal-page__hero">
          <span>총 결제금액</span>
          <strong>{formatCurrency(totalPrice)}</strong>
          <p>
            카드를 투입구에
            <br />
            끝까지 넣어주세요
          </p>
        </section>
      </main>
      <footer className="kiosk-modal-page__footer">
        <button type="button" disabled>
          뒤로가기
        </button>
        <button type="button" disabled className="is-primary">
          결제하기
        </button>
      </footer>

      <div className="kiosk-modal-overlay" aria-hidden="true" />
      <div
        className="kiosk-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="timeout-title"
      >
        <h2 id="timeout-title">{title}</h2>
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
