// SCR-008 / Order Complete — Figma 134:7926
// UI 뼈대: 완료 카피 · 티켓/바코드 에셋 · twoCTA · Toast
// 연결 예정: 주문 응답(orderNumber) · 홈 복귀 타이머 · 영수증 출력
// 금지: 주문번호 하드코딩, 화면 전체 자동생성 React
import Header from "@/components/common/Header";
import KioskToast from "@/components/kiosk/KioskToast";
import ticketShape from "@/assets/figma/order-complete-ticket.svg";
import asakSLogo from "@/assets/svg/logo-S.svg";
import barcodeMark from "@/assets/figma/order-complete-barcode.svg";

export default function OrderCompletePage({
  orderNumber = null,
  toastMessage = null,
  toastTone = "success",
} = {}) {
  return (
    <div className="order-complete-page">
      <Header />
      <main className="order-complete-page__content">
        <div
          className="kiosk-step-indicator order-complete-page__steps"
          aria-label="주문 4단계 중 완료"
        >
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-current" />
        </div>

        <h1>주문이 완료되었습니다!</h1>

        <p className="order-complete-page__label">주문번호</p>
        <p className="order-complete-page__order-no">{orderNumber ?? "—"}</p>

        <div className="order-complete-page__ticket" aria-hidden="true">
          <i className="order-complete-page__rail" />
          <div className="order-complete-page__ticket-body">
            <img className="order-complete-page__ticket-shape" src={ticketShape} alt="" />
            <img className="order-complete-page__ticket-logo" src={asakSLogo} alt="" />
            <img className="order-complete-page__barcode" src={barcodeMark} alt="" />
          </div>
        </div>

        <p className="order-complete-page__hint">
          영수증이 필요하신 경우 하단 출력 버튼을 눌러주세요
        </p>
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
