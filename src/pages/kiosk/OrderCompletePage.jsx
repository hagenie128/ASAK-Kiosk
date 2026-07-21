// SCR-008 / Order Complete — Figma 134:7926 (WBS2-028)
// UI OK · 남은 연결: 결제 성공 응답 → 주문번호/금액/대기 · 홈 타이머 · cart reset
//
// mock: paymentScenarios.approve.data 또는 orderCompleteSamples[]
//   orderNo → props orderNumber
//   amount | totalPrice → 금액 (정본명 totalAmount)
//   waitingCount → waitingOrderCount
// store: order.orderNo, payment.amount, paymentStatus=APPROVED 후 clearItems
// 표: public/mocks/README.md §3
//
// Props: orderNumber, toastMessage?, toastTone?
// 추가 후보: totalAmount, waitingOrderCount, returnInSec
// 금지: 주문번호 하드코딩

// --- 해당 페이지는 백단에서 데이터를 받은 후 orderId만 연결해서 화면 출력 예정 (임시 주문 번호 삽입)
import Header from "@/components/common/Header";
import ticketShape from "@/assets/figma/order-complete-ticket.svg";
import asakSLogo from "@/assets/svg/logo-S.svg";
import barcodeMark from "@/assets/figma/order-complete-barcode.svg";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderCompletePage() {

  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {

    if (countdown <= 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000);

    return () => clearTimeout(timer);


  }, [countdown, navigate]);




  return (
    <>
      <Header />
      <div
        className="kiosk-step-indicator"
        aria-label="주문 4단계 중 완료"
      >
        <span className="is-done" />
        <span className="is-done" />
        <span className="is-done" />
        <span className="is-current" />
      </div>

      <main className="page_content_emptyArea order_complete_contents">

        <h1>주문이 완료되었습니다!</h1>

        <p className="order-complete-page__label">주문번호</p>
        <p className="order-complete-page__order-no">1225</p>

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
          <span>{countdown}</span> 초 후 초기화면으로 돌아갑니다
        </p>
      </main>


      {/* 결제하기 하단  */}
      <Footer
        leftText="주문 번호만 출력"
        rightText="영수증 출력" />

    </>
  );
}
