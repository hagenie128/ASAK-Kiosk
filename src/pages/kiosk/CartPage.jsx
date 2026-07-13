import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/common/Button";
import { useCartStore } from "../../store/cartStore";
import { ROUTES } from "../../constants/routes";

// SCR-005 장바구니·주문확인
export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <section className="cart-page">
      <Header title="장바구니" onBack={() => navigate(-1)} />
      {items.length === 0 ? (
        <p>담긴 메뉴가 없습니다.</p>
      ) : (
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              {item.name} x{item.quantity} — {(item.price * item.quantity).toLocaleString()}원
              <button type="button" onClick={() => removeItem(i)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
      <p>총 {totalPrice.toLocaleString()}원</p>
      <Footer>
        <Button disabled={items.length === 0} onClick={() => navigate(ROUTES.KIOSK_PAYMENT)}>
          결제하기
        </Button>
      </Footer>
    </section>
  );
}
