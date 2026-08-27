import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomePage from "../../pages/kiosk/HomePage.jsx";
import MenuListPage from "../../pages/kiosk/MenuListPage.jsx";
import "../../styles/tokens.css";
import "../../styles/reset.css";
import "../../styles/global.css";
import "../../styles/commonStyle.css";
import MenuDetailPage from "@/pages/kiosk/MenuDetailPage.jsx";
import CartPage from "@/pages/kiosk/CartPage.jsx";
import PaymentPage from "@/pages/kiosk/PaymentPage.jsx";
import OrderCompletePage from "@/pages/kiosk/OrderCompletePage.jsx";
import AccessibilityPage from "@/pages/kiosk/AccessibilityPage.jsx";
import ReceiptPage from "@/pages/kiosk/ReceiptPage.jsx";
import PaymentProcessingPage from "@/pages/kiosk/PaymentProcessingPage.jsx";
import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore.js";
import { useKioskTimeout } from "@/hooks/useKioskTimeout.js";
import{ KIOSK_IDLE_MS ,KIOSK_TIMEOUT_MODAL_MS,KIOSK_TIMEOUT_MODAL  } from "@/utils/kioskTimeout.js"
import Modal from "@/components/common/Modal.jsx";


export default function KioskApp() {

  //**스케일 반영**
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const viewport = window.visualViewport;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;

      // 1080×1920 디자인 캔버스가 어느 방향으로도 잘리지 않게 맞춘다.
      setScale(Math.min(viewportWidth / 1080, viewportHeight / 1920));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.visualViewport?.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      window.visualViewport?.removeEventListener("resize", updateScale);
    };
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const resetSession = useCartStore((state)=>state.resetSession);

  const handleTimeoutExpired = useCallback(()=>{
    resetSession();
    navigate("/", {replace:true});
  }, [navigate , resetSession ]);


  const {
    isTimeoutOpen,
    remainingSeconds,
    dismissTimeout
  } = useKioskTimeout({
    enable :
        location.pathname !== "/" &&
        location.pathname !== "/paymentProcessing"
     ,
    idleMs : KIOSK_IDLE_MS,
    modalMs : KIOSK_TIMEOUT_MODAL_MS,
    onExpired : handleTimeoutExpired,
  });

  const handleTimeoutConfirm = () =>{
    dismissTimeout();
  }


  return (
    <div className="kiosk-screen">
      <div className="kiosk-viewport" style={{ "--kiosk-scale": scale }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuListPage />} />
          <Route path="/menu/:menuId" element={<MenuDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/paymentProcessing" element={<PaymentProcessingPage />} />
          <Route path="/complete" element={<OrderCompletePage />} />
          {/* 접근성 페이지 - 현재는 사용안함 */}
          <Route path="/accessibility" element={<AccessibilityPage />} />
          {/* 영수증 출력 페이지 사용 유무에 따라 추가될 예정 */}
          {/* <Route path="/receipt" element={<ReceiptPage />} /> */}
          {/* /ui-preview 는 AI QA용 — 라우트 제거. 파일은 힌트만 유지 */}
        </Routes>

        {
          isTimeoutOpen && (
            <Modal 
              icon ={KIOSK_TIMEOUT_MODAL.icon}
              modal_title={KIOSK_TIMEOUT_MODAL.title}
              modal_content={KIOSK_TIMEOUT_MODAL.content(remainingSeconds)}
              leftText={KIOSK_TIMEOUT_MODAL.leftText}
              rightText={KIOSK_TIMEOUT_MODAL.rightText}
              onRightClick={handleTimeoutConfirm}
            />
          )
        }


      </div>
    </div>


  );
}
