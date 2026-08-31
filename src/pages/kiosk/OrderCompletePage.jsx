// SCR-008 / Order Complete — Figma 134:7926 (WBS2-028)
// Props: orderNo, toastMessage?, toastTone?

import Header from "@/components/common/Header";
import ticketShape from "@/assets/figma/order-complete-ticket.svg";
import asakSLogo from "@/assets/svg/logo-S.svg";
import barcodeMark from "@/assets/figma/order-complete-barcode.svg";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { requestReceiptPrint, requestWaitingNumberPrint , getDeviceEvent} from "@/api/receipt";
import KioskToast from "@/components/kiosk/KioskToast";

export default function OrderCompletePage() {

  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const payment = useCartStore((state) => state.payment);
  const resetSession = useCartStore((state) => state.resetSession);
  const [ toastMessage , setToastMessage ] = useState(null);
  const [ toastTone , setToastTone ] = useState("success")

  useEffect(() => {

    if (countdown <= 0) {
      resetSession();
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000);

    return () => clearTimeout(timer);


  }, [countdown, navigate, resetSession]);

  // 영수증 출력 관련 결과 유무
  const handleDeviceEventResult = (deviceEvent) => {

    const {eventType , status } = deviceEvent;

    if(status === "COMPLETED"){
      setToastTone("success")

      if(eventType === "PRINT_RECEIPT"){
        setToastMessage("영수증 출력 완료");
        return;
      }
      if(eventType === "PRINT_WAITING_NUMBER"){
        setToastMessage("주문 번호 출력 완료");
        return;
      }

    }

    if(status === "FAILED"){
       setToastTone("error");

      if (eventType === "PRINT_RECEIPT") {
        setToastMessage("영수증 출력에 실패했습니다.");
        return;
      }

      if (eventType === "PRINT_WAITING_NUMBER") {
        setToastMessage("주문번호 출력에 실패했습니다.");
      }
    }

  }


  // 영수증 출력 & 주문번호 출력
  const handleReceiptPrint = async () =>{

    try{
      setToastMessage(null);
      
      const printResoinse = await requestReceiptPrint({
        orderId : payment.orderId,
        receiptPayload,
      });

      const deviceEvent = await getDeviceEvent(printResoinse.eventId);
      
      handleDeviceEventResult(deviceEvent);

    }catch(error){
      setToastTone("error")
      setToastMessage("영수증 출력 요청을 실패했습니다.");
    }
    
  }
  
  const handleWaitingNumberPrint  = async () =>{
    
    try{
      setToastMessage(null);
      
      const printReponse = await requestWaitingNumberPrint({
        orderId: payment.orderId,
      })
      
      const deviceEvent = await getDeviceEvent(printReponse.eventId);
      
      handleDeviceEventResult(deviceEvent);
    } catch(error){

      setToastTone("error")
      setToastMessage("주문번호 출력 요청을 실패했습니다.")
    }

  }


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

        <p className="order-complete-page__label">주문 대기번호</p>
        <p className="order-complete-page__order-no">
          {payment.paymentStatus === "APPROVED"
            ? payment.waitingOrderNo
            : "-"}
        </p>



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

        {
          toastMessage && (
            <KioskToast
              message={toastMessage}
              tone={toastTone}
            />
          )
        }

      {/* 결제하기 하단  */}
      <Footer
        leftText="주문 번호만 출력"
        rightText="영수증 출력" 
        onLeftClick = {handleWaitingNumberPrint}
        onRightClick = {handleReceiptPrint}
        />

    </>
  );
}
