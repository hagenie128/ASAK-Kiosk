// 학습용 자리표시자: SCR-008 주문 완료 화면입니다.
import Header from "@/components/kiosk/Header";

// UI-only preview: order number, queue, and auto-return are not implemented.
export default function OrderCompletePage() {
  return (
    <div className="order-complete-page">
      <Header />
      <main className="order-complete-page__content">
        <div className="kiosk-step-indicator" aria-label="주문 4단계 중 완료">
          <span />
          <span />
          <span />
          <span className="is-current" />
        </div>
        <h1>주문이 완료되었어요.</h1>
        <section className="order-complete-page__number">
          <span>주문번호</span>
          <strong>----</strong>
        </section>
        <section className="order-complete-page__amount">
          <span>결제 금액</span>
          <strong>0원</strong>
        </section>
        <p>주문 대기 정보는 결제 기능 연결 후 표시됩니다.</p>
        <p>잠시 후 홈 화면으로 돌아갑니다.</p>
      </main>
      <footer className="order-complete-page__footer">
        <button type="button" disabled>홈으로 이동하기</button>
      </footer>
    </div>
  );
}
