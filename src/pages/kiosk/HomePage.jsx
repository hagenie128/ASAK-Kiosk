// SCR-001 홈·매장/포장 선택 화면
import OrderTypeSelector from "../../components/kiosk/OrderTypeSelector";
import asakLogoLight from "../../assets/figma/asak-logo-home-light.png";

export default function HomePage() {
  return (
    <section className="home-page">
      <div className="home-page__scrim" aria-hidden="true" />
      <div className="home-page__content">
        <p className="screen-id">SCR-001</p>
        <img className="home-page__logo" src={asakLogoLight} alt="ASAK — A Salad A Kiosk" />
        <div className="home-page__intro">
          <h1>신선한 샐러드 지금 주문하세요</h1>
          <p>주문 방식을 선택해주세요.</p>
        </div>
        <OrderTypeSelector />
      </div>
    </section>
  );
}
