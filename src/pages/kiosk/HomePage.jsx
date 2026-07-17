// SCR-001 홈·매장/포장 선택 화면
import OrderTypeSelector from "../../components/kiosk/OrderTypeSelector";

export default function HomePage() {
  return (
    <section className="home-page">
      <p className="screen-id">SCR-001</p>
      <h1>주문을 시작할까요?</h1>
      <p>매장 식사 또는 포장하기를 선택하고 다음 화면으로 이동합니다.</p>
      <OrderTypeSelector />
    </section>
  );
}
