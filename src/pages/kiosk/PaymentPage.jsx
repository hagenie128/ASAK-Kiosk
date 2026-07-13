import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/common/Button";
import { useCartStore } from "../../store/cartStore";
import { useOrderStore } from "../../store/orderStore";
import { ROUTES } from "../../constants/routes";

// SCR-007 결제 — API-005(주문 생성), API-006(가상 결제) 연동 전까지는 자리만 잡아둠
// TODO: 백엔드 준비되면 createOrder → requestPayment 순서로 연결
export default function PaymentPage() {
  const navigate = useNavigate();
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clear);
  const setLastOrder = useOrderStore((s) => s.setLastOrder);

  function handlePay() {
    // TODO: 실제 API-005/006 연동. 지금은 완료 화면으로만 이동.
    setLastOrder({ totalPrice, paidAt: new Date().toISOString() });
    clearCart();
    navigate(ROUTES.KIOSK_ORDER_COMPLETE);
  }

  return (
    <section className="payment-page">
      <Header title="결제" onBack={() => navigate(-1)} />
      <p>결제 금액: {totalPrice.toLocaleString()}원</p>
      <Footer>
        <Button onClick={handlePay}>결제하기</Button>
      </Footer>
    </section>
  );
}
