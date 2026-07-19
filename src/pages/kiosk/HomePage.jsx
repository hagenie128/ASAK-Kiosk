// SCR-001 / Home — Figma 134:7721 (Default) · 224:12713 (High Contrast)
// 로고는 사용자가 별도 이미지로 교체 예정. 기존 로컬 에셋 유지.
import OrderTypeSelector from "../../components/kiosk/OrderTypeSelector";
import asakLogoLight from "../../assets/figma/asak-logo-home-light.png";
import heroBg from "../../assets/figma/hero-home-export.png";

export default function HomePage({ viewState = "default" } = {}) {
  const highContrast =
    viewState === "high-contrast" || viewState === "selected" || viewState === "selection";

  return (
    <section
      className={`home-page${highContrast ? " is-high-contrast" : ""}`}
      data-figma-node={highContrast ? "224:12713" : "134:7721"}
      data-view-state={viewState}
    >
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
