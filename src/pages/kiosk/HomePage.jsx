// SCR-001 홈·매장/포장 선택 화면
import OrderTypeSelector from "../../components/kiosk/OrderTypeSelector";

export default function HomePage() {
  return (
    <section className="home-page">
      <div className="home-page__scrim" aria-hidden="true" />
      <div className="home-page__content">
        <p className="screen-id">SCR-001</p>
        <p className="home-page__logo" aria-label="ASAK">ASAK</p>
        <div className="home-page__intro">
          <h1>신선한 샐러드 지금 주문하세요</h1>
          <p>주문 방식을 선택해주세요.</p>
        </div>
        <OrderTypeSelector />
      </div>
    </section>
  );
}
