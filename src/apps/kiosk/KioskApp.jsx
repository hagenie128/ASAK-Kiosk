import { Route, Routes } from "react-router-dom";
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
import PaymentErrorPage from "@/pages/kiosk/PaymentErrorPage.jsx";
import TimeoutPage from "@/pages/kiosk/TimeoutPage.jsx";
import ReceiptPage from "@/pages/kiosk/ReceiptPage.jsx";
import UiStatePreviewPage from "@/pages/kiosk/UiStatePreviewPage.jsx";

export default function KioskApp() {
  return (
    <div className="kiosk-viewport">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuListPage />} />
        <Route path="/menu/:menuId" element={<MenuDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/complete" element={<OrderCompletePage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/payment-error" element={<PaymentErrorPage />} />
        <Route path="/timeout" element={<TimeoutPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/ui-preview/:screen/:state" element={<UiStatePreviewPage />} />
      </Routes>
    </div>
  );
}
