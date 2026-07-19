// SCR-008 / Order Complete — 0718 `134:7926` (0714 레이아웃을 0718 스타일로 녹임)
import Header from "@/components/kiosk/Header";
import KioskToast from "@/components/kiosk/KioskToast";
import ticketShape from "@/assets/figma/order-complete-ticket.svg";
import asakSLogo from "@/assets/figma/asak-s-logo.svg";
import barcodeMark from "@/assets/figma/order-complete-barcode.svg";
import { STATIC_COMPLETE } from "@/data/staticUi";

const TOAST_BY_STATE = {
  receiptPrint: "영수증을 출력하고 있습니다",
  "receipt-print": "영수증을 출력하고 있습니다",
  receiptError: "영수증 출력에 실패했습니다",
  "receipt-error": "영수증 출력에 실패했습니다",
};

export default function OrderCompletePage({ viewState = "default" } = {}) {
  const toastMessage = TOAST_BY_STATE[viewState] ?? null;
  const toastTone =
    viewState === "receiptError" || viewState === "receipt-error" ? "warning" : "success";

  return (
    <div
      className="order-complete-page"
      data-figma-file="yHhvn5RKjBd91U8BJUQz7F"
      data-figma-node="134:7926"
      data-view-state={viewState}
    >
      <Header />
      <main className="order-complete-page__content">
        <div className="kiosk-step-indicator order-complete-page__steps" aria-label="주문 4단계 중 완료">
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-current" />
        </div>

        <h1>주문이 완료되었습니다!</h1>

        <p className="order-complete-page__label">주문번호</p>
        <p className="order-complete-page__order-no">{STATIC_COMPLETE.orderNumber}</p>

        <div className="order-complete-page__ticket" aria-hidden="true">
          <i className="order-complete-page__rail" />
          <div className="order-complete-page__ticket-body">
            <img className="order-complete-page__ticket-shape" src={ticketShape} alt="" />
            <img className="order-complete-page__ticket-logo" src={asakSLogo} alt="" />
            <img className="order-complete-page__barcode" src={barcodeMark} alt="" />
          </div>
        </div>

        <p className="order-complete-page__hint">영수증이 필요하신 경우 하단 출력 버튼을 눌러주세요</p>
        <p className="order-complete-page__return">
          <em>5</em> 초 후 초기화면으로 돌아갑니다
        </p>
      </main>

      <footer className="order-complete-page__footer">
        <button type="button" disabled>
          주문 번호만 출력
        </button>
        <button type="button" disabled className="is-primary">
          영수증 출력
        </button>
      </footer>

      <KioskToast message={toastMessage} tone={toastTone} />
    </div>
  );
}
