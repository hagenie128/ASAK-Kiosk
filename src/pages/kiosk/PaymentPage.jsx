// 학습용 자리표시자: SCR-007 결제 화면입니다.
import Header from "@/components/kiosk/Header";

// UI-only preview: payment selection and approval are intentionally not wired here.
export default function PaymentPage() {
  return (
    <div className="payment-page">
      <Header />
      <main className="payment-page__content">
        <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제">
          <span />
          <span />
          <span className="is-current" />
          <span />
        </div>
        <h1>결제 수단을 선택해주세요</h1>
        <section className="payment-page__summary" aria-label="주문 정보 미리보기">
          <div>
            <strong>주문정보 확인</strong>
            <span>메뉴와 결제 금액을 확인해주세요.</span>
          </div>
          <b>0원</b>
        </section>
        <div className="payment-page__methods" aria-label="결제 수단">
          <button type="button" disabled>
            <span className="payment-page__method-icon">▣</span>
            <span>
              <strong>카드 / 삼성페이 결제</strong>
              <small>신용·체크카드</small>
            </span>
          </button>
          <button type="button" disabled>
            <span className="payment-page__method-icon payment-page__method-icon--kakao">K</span>
            <span>
              <strong>카카오페이 결제</strong>
              <small>모바일 간편결제</small>
            </span>
          </button>
        </div>
      </main>
      <footer className="payment-page__footer">
        <button type="button" disabled>결제 요청</button>
      </footer>
    </div>
  );
}
