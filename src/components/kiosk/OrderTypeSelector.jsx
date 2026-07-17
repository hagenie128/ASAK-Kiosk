import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/orderStore";

export default function OrderTypeSelector() {
  const setOrderType = useOrderStore((state) => state.setOrderType);
  const navigate = useNavigate();

  const selectOrderType = (type) => {
    setOrderType(type);
    navigate("/menu");
  };

  return (
    <div className="order-type-selector">
      <button
        type="button"
        className="order-type-selector__btn"
        onClick={() => selectOrderType("EAT_IN")}
      >
        매장 식사
      </button>
      <button
        type="button"
        className="order-type-selector__btn"
        onClick={() => selectOrderType("TAKE_OUT")}
      >
        포장하기
      </button>
    </div>
  );
}
