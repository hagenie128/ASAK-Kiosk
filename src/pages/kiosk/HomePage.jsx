import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { useOrderStore } from "../../store/orderStore";
import { ROUTES } from "../../constants/routes";

// SCR-001 홈 (매장·포장) — 구 SCR-002 먹고가기/포장 선택이 여기 통합됨 (2026-07-06 회의 결정)
export default function HomePage() {
  const navigate = useNavigate();
  const setOrderType = useOrderStore((s) => s.setOrderType);

  function handleSelect(orderType) {
    setOrderType(orderType);
    navigate(ROUTES.KIOSK_MENU_LIST);
  }

  return (
    <section className="home-page">
      <h1>ASAK 키오스크</h1>
      <p>주문 방법을 선택해 주세요</p>
      <div className="home-page__actions">
        <Button onClick={() => handleSelect("EAT_IN")}>매장에서 먹고가기</Button>
        <Button onClick={() => handleSelect("TAKE_OUT")}>포장하기</Button>
      </div>
    </section>
  );
}
