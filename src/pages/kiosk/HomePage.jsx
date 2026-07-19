// SCR-001 / Home — Figma 134:7721
// 주문 방식 선택·/menu 이동은 OrderTypeSelector가 담당한다.
import OrderTypeSelector from "../../components/kiosk/OrderTypeSelector";
import asakLogoLight from "../../assets/figma/asak-logo-home-light.png";
import heroBg from "../../assets/figma/hero-home-export.png";

export default function HomePage() {
  return (
    <section className="home-page">
      <div className="home-page__hero" aria-hidden="true">
        <img src={heroBg} alt="" className="home-page__hero-img" />
      </div>
      <div className="home-page__scrim" aria-hidden="true" />

      <div className="home-page__content">
        <img className="home-page__logo" src={asakLogoLight} alt="ASAK — A Salad A Kiosk" />
        <h1 className="home-page__headline">신선한 샐러드 지금 주문하세요</h1>
        <OrderTypeSelector />
      </div>
    </section>
  );
}
