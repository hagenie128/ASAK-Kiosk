// /ui-preview/:screen/:state — Figma 상태 화면을 실제 페이지 컴포넌트로 표시
import { useParams } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import MenuListPage from "./MenuListPage.jsx";
import MenuDetailPage from "./MenuDetailPage.jsx";
import CartPage from "./CartPage.jsx";
import PaymentPage from "./PaymentPage.jsx";
import OrderCompletePage from "./OrderCompletePage.jsx";
import AccessibilityPage from "./AccessibilityPage.jsx";
import PaymentErrorPage from "./PaymentErrorPage.jsx";
import TimeoutPage from "./TimeoutPage.jsx";
import ReceiptPage from "./ReceiptPage.jsx";

const SCREEN_MAP = {
  home: HomePage,
  menu: MenuListPage,
  detail: MenuDetailPage,
  cart: CartPage,
  payment: PaymentPage,
  complete: OrderCompletePage,
  accessibility: AccessibilityPage,
  "payment-error": PaymentErrorPage,
  timeout: TimeoutPage,
  receipt: ReceiptPage,
};

export default function UiStatePreviewPage() {
  const { screen = "menu", state = "default" } = useParams();
  const Page = SCREEN_MAP[screen];

  if (!Page) {
    return (
      <main className="kiosk-state-preview">
        <p>알 수 없는 화면: {screen}</p>
      </main>
    );
  }

  return <Page viewState={state} />;
}
