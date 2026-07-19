// SCR-013 / Timeout — Figma 134:7913 계열
/**
 * [FIGMA-AI] Figma 주문 타임아웃 안내·확인 모달 상태를 옮긴 화면입니다.
 * [AI-LOGIC] COPY, ALIAS, viewState는 timeout QA 미리보기용 상태 제어입니다.
 * 실제 카운트다운·세션 초기화·연장 요청은 아직 연결하지 않은 상태입니다.
 */
import Header from "@/components/kiosk/Header";
import { formatWon, STATIC_PAYMENT } from "@/data/staticUi";

const COPY = {
  expired: {
    title: "시간 초과",
    lines: ["일정 시간 동안 조작이 없어", "주문이 취소되었습니다."],
    secondary: "처음으로",
    primary: "확인",
  },
  warning: {
    title: "곧 시간이 종료됩니다",
    lines: ["30초 안에 조작이 없으면", "주문이 취소됩니다."],
    secondary: "종료",
    primary: "계속하기",
  },
  continue: {
    title: "주문을 이어갈까요?",
    lines: ["이어서 주문하시려면", "계속하기를 눌러 주세요."],
    secondary: "처음으로",
    primary: "계속하기",
  },
};

const ALIAS = {
  error: "expired",
  confirm: "warning",
  progress: "continue",
};

export default function TimeoutPage({ viewState = "expired" } = {}) {
  const resolved = ALIAS[viewState] ?? viewState;
  const copy = COPY[resolved] ?? COPY.expired;

  return (
    <div className="kiosk-modal-page" data-figma-node="134:7913" data-view-state={resolved}>
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
          <strong>{formatWon(STATIC_PAYMENT.totalPrice)}</strong>
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
      <div className="kiosk-modal" role="dialog" aria-modal="true" aria-labelledby="timeout-title">
        <h2 id="timeout-title">{copy.title}</h2>
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
