// SCR-012 / Payment Error — Figma 134:7900 계열
/**
 * [FIGMA-AI] Figma 결제 실패 모달과 오류 문구 상태를 옮긴 화면입니다.
 * [AI-LOGIC] COPY와 viewState는 거절/네트워크 등 오류 상태 QA 미리보기용입니다.
 * 실제 결제 실패 응답과 재시도 요청은 아직 연결하지 않은 상태입니다.
 */
import Header from "@/components/kiosk/Header";
import { formatWon, STATIC_PAYMENT } from "@/data/staticUi";

const COPY = {
  declined: {
    title: "결제 실패",
    lines: ["결제 중 오류가 발생했습니다.", "다시 시도해 주세요."],
    secondary: "취소",
    primary: "다시 시도",
  },
  "network-failure": {
    title: "네트워크 오류",
    lines: ["네트워크 연결을 확인한 뒤", "다시 시도해 주세요."],
    secondary: "취소",
    primary: "다시 시도",
  },
  network: {
    title: "네트워크 오류",
    lines: ["네트워크 연결을 확인한 뒤", "다시 시도해 주세요."],
    secondary: "취소",
    primary: "다시 시도",
  },
  retry: {
    title: "재시도 중",
    lines: ["결제를 다시 요청하고 있습니다.", "잠시만 기다려 주세요."],
    secondary: "취소",
    primary: "확인",
  },
  error: {
    title: "결제 실패",
    lines: ["결제 중 오류가 발생했습니다.", "다시 시도해 주세요."],
    secondary: "취소",
    primary: "다시 시도",
  },
};

export default function PaymentErrorPage({ viewState = "declined" } = {}) {
  const copy = COPY[viewState] ?? COPY.declined;

  return (
    <div className="kiosk-modal-page" data-figma-node="134:7900" data-view-state={viewState}>
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
          <strong>{formatWon(STATIC_PAYMENT.totalPrice)}</strong>
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
      <div className="kiosk-modal" role="dialog" aria-modal="true" aria-labelledby="payment-error-title">
        <h2 id="payment-error-title">{copy.title}</h2>
        <p>
          {copy.lines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <div className="kiosk-modal__actions">
          <button type="button" disabled>
            {copy.secondary}
          </button>
          <button type="button" disabled className="is-primary">
            {copy.primary}
          </button>
        </div>
      </div>
    </div>
  );
}
