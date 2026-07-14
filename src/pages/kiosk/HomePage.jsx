// SCR-001 홈·매장/포장 선택 화면
//주문 시작	SCR-001	매장/포장 선택, 주문 초안에 orderType 저장
import OrderTypeSelector from "../../components/kiosk/OrderTypeSelector";
import "../../styles/commonStyle.css";

export default function HomePage() {
  return (
    <section className="kiosk-viewport">
      <p className="screen-id">SCR-001</p>
      <h1>주문을 시작할까요?</h1>
      <p>매장 식사 또는 포장하기를 선택하고 다음 화면으로 이동합니다.</p>
      <OrderTypeSelector />
    </section>
  );
}
