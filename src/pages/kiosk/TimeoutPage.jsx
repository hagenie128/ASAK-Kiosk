// SCR-013 / Timeout — Figma 134:7913
// UI 뼈대: 무조작 타임아웃 Confirm (경고/만료)
// 연결 예정: 카운트다운 · 세션 초기화 · 연장
// 금지: 금액 목업, 화면 전체 자동생성 React
import Header from "@/components/common/Header";
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
