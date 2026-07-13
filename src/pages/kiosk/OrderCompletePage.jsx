import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { useOrderStore } from "../../store/orderStore";
import { ROUTES } from "../../constants/routes";

// SCR-008 주문 완료
export default function OrderCompletePage() {
  const navigate = useNavigate();
  const lastOrder = useOrderStore((s) => s.lastOrder);
  const reset = useOrderStore((s) => s.reset);

  function handleDone() {
    reset();
    navigate(ROUTES.KIOSK_HOME);
  }

  return (
    <section className="order-complete-page">
      <h1>주문이 완료되었습니다</h1>
      {lastOrder && <p>결제 금액: {lastOrder.totalPrice.toLocaleString()}원</p>}
      <Button onClick={handleDone}>처음으로</Button>
    </section>
  );
}
