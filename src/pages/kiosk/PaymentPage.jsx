import Header from "@/components/kiosk/Header";
import cardIcon from "@/assets/figma/icon-kiosk-card.svg";
import kakaoPayLogo from "@/assets/figma/logo-kakaopay.png";

// SCR-007 UI-only: 결제 승인·수단 선택·주문 금액은 이 화면에서 처리하지 않는다.
const paymentMethods = [
  [cardIcon, "카드/ 삼성페이 결제", "신용·체크카드", "payment-page__method-icon--card"],
  [kakaoPayLogo, "카카오페이 결제", "모바일 간편결제", "payment-page__method-icon--kakao"],
];

export default function PaymentPage() {
  return <div className="payment-page">
    <Header />
    <main className="payment-page__content">
      <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제"><span /><span /><span /><span className="is-current" /></div>
      <section className="payment-page__hero"><span>총 결제금액</span><strong>0원</strong><p>결제 수단을 확인해주세요</p></section>
      <div className="payment-page__methods" aria-label="결제 수단">
        {paymentMethods.map(([icon, title, description, tone]) => <button key={title} type="button" disabled><img className={`payment-page__method-icon ${tone}`} alt="" src={icon} /><span><strong>{title}</strong><small>{description}</small></span></button>)}
      </div>
      <section className="payment-page__summary" aria-label="주문 정보 미리보기"><strong>주문정보 확인</strong><span>0개 메뉴 / 총 0원</span></section>
    </main>
    <footer className="payment-page__footer"><button type="button" disabled>뒤로가기</button><button type="button" disabled>결제하기</button></footer>
  </div>;
}
