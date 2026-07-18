import Header from "@/components/kiosk/Header";

// SCR-008 UI-only: 주문 번호·대기열·자동 이동은 API/타이머 연결 전의 정적 표시다.
export default function OrderCompletePage() {
  return <div className="order-complete-page">
    <Header />
    <main className="order-complete-page__content">
      <div className="kiosk-step-indicator" aria-label="주문 4단계 중 완료"><span /><span /><span /><span className="is-current" /></div>
      <h1>주문이 완료되었어요.</h1>
      <article className="receipt-card" aria-label="주문 영수증 정적 미리보기">
        <i /><span>주문번호</span><strong>----</strong><hr />
        <ul><li><span>메뉴 정보는 결제 후 표시됩니다.</span><b>—</b></li></ul>
        <hr /><p><span>합계</span><b>0원</b></p><em aria-hidden="true" /><small>ASALADAKIOSK</small>
      </article>
      <p className="order-complete-page__queue">결제 완료 후 대기 순서를 안내합니다.</p>
      <p className="order-complete-page__return">잠시 후 초기 화면으로 돌아갑니다.</p>
    </main>
    <footer className="order-complete-page__footer"><button type="button" disabled>홈으로</button><button type="button" disabled>영수증 보기</button></footer>
  </div>;
}
