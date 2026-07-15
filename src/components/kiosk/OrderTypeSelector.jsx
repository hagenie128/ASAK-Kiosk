import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/orderStore";
import "../../styles/commonStyle.css";

export default function OrderTypeSelector() {
    const setOrderType = useOrderStore((state) => state.setOrderType);
    const navigate = useNavigate();

    const selectOrderType = (type) => {
        setOrderType(type);
        navigate("/menu");
    };

    return (
        <div>
            <button
                onClick={() => selectOrderType("EAT_IN")}
            >
                매장 식사
            </button>
            <button
                onClick={() => selectOrderType("TAKE_OUT")}
            >
                포장하기
            </button>
        </div>
    );
}
