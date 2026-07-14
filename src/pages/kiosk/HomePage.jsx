// SCR-001 홈·매장/포장 선택 화면
//주문 시작	SCR-001	매장/포장 선택, 주문 초안에 orderType 저장
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/orderStore";
import "../../styles/commonStyle.css";

export default function HomePage() {
  const setOrderType = useOrderStore((state) => state.setOrderType);
  const navigate = useNavigate();

  const selectOrderType = (type) => {
    setOrderType(type);
    navigate("/menu");
  };

  return (
    <section className="kiosk-viewport">
      <p className="screen-id">SCR-001</p>
      <h1>주문을 시작할까요?</h1>
      <p>매장 식사 또는 포장하기를 선택하고 다음 화면으로 이동합니다.</p>
      <div className="action-row">
        <button
          className="primary-action"
          onClick={() => selectOrderType("EAT_IN")}
        >
          매장 식사
        </button>
        <button
          className="secondary-action"
          onClick={() => selectOrderType("TAKE_OUT")}
        >
          포장하기
        </button>
      </div>
    </section>
  );
}
