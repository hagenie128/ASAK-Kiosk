import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/common/Button";
import { getMenuDetail, getMenuOptions } from "../../api/menu";
import { useCartStore } from "../../store/cartStore";
import { ROUTES } from "../../constants/routes";

// SCR-004 메뉴 상세 / 옵션 선택 — API-003(상세), API-004(옵션)
// TODO: 기본 재료 제외(excludedIngredientIds), 옵션 그룹별 선택(selectType SINGLE/MULTI) UI
export default function MenuDetailPage() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const [menu, setMenu] = useState(null);
  const [optionGroups, setOptionGroups] = useState([]);

  useEffect(() => {
    getMenuDetail(menuId).then(setMenu);
    getMenuOptions(menuId).then(setOptionGroups);
  }, [menuId]);

  if (!menu) return <p>불러오는 중...</p>;

  function handleAddToCart() {
    addItem({
      menuId: menu.menuId,
      name: menu.name,
      price: menu.price,
      quantity: 1,
      options: [], // TODO: 선택한 옵션 반영
    });
    navigate(ROUTES.KIOSK_CART);
  }

  return (
    <section className="menu-detail-page">
      <Header title={menu.name} onBack={() => navigate(-1)} />
      <img src={menu.imageUrl} alt={menu.name} />
      <p>{menu.description}</p>
      <p>{menu.price.toLocaleString()}원 · {menu.baseKcal}kcal</p>

      {optionGroups.map((group) => (
        <div key={group.optionGroupId} className="option-group">
          <h3>{group.name}{group.isRequired && " *"}</h3>
          {group.items.map((item) => (
            <label key={item.optionItemId}>
              <input type={group.selectType === "SINGLE" ? "radio" : "checkbox"} name={`group-${group.optionGroupId}`} disabled={item.isSoldOut} />
              {item.name} {item.extraPrice > 0 && `(+${item.extraPrice.toLocaleString()}원)`}
            </label>
          ))}
        </div>
      ))}

      <Footer>
        <Button onClick={handleAddToCart}>장바구니 담기</Button>
      </Footer>
    </section>
  );
}
