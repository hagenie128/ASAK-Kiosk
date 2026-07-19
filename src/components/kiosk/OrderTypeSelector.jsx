// SCR-001 Home 주문 방식 카드 — Figma KioskHomeActionButton
// 선택 시 orderType 저장 후 /menu로 이동.
import iconEatIn from "../../assets/figma/icon-home-eatin.svg";
import iconTakeOut from "../../assets/figma/icon-home-takeout.svg";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/store/orderStore";

const OPTIONS = [
  { id: "eat-in", label: "매장에서 먹기", en: "Eat In", icon: iconEatIn },
  { id: "take-out", label: "포장하기", en: "Take Out", icon: iconTakeOut },
];

export default function OrderTypeSelector() {
  const navigate = useNavigate();
  const setOrderType = useOrderStore((state) => state.setOrderType);

  const handleSelect = (orderType) => {
    setOrderType(orderType);
    navigate("/menu");
  };

  return (
    <div className="order-type-selector" role="group" aria-label="주문 방식">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          className="order-type-selector__btn"
          onClick={() =>
            handleSelect(option.id === "eat-in" ? "EAT_IN" : "TAKE_OUT")
          }
        >
          <span className="order-type-selector__icon" aria-hidden="true">
            <img src={option.icon} alt="" width={80} height={80} />
          </span>
          <span className="order-type-selector__label">{option.label}</span>
          <span className="order-type-selector__en">{option.en}</span>
        </button>
      ))}
    </div>
  );
}
