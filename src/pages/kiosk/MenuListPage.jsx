// SCR-003 / Menu List — Figma 134:7792
// 나연이 흐름: 카테고리·메뉴 선택·OrderList·장바구니 합계.
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/common/Header";
import CategoryTabs from "@/components/kiosk/CategoryTabs";
import MenuCard from "@/components/kiosk/MenuCard";
import OrderList from "@/components/kiosk/OrderList";
import MenuListFooter from "@/components/kiosk/MenuListFooter";
import kioskMock from "../../../public/mocks/kiosk.json";
import { useCartStore } from "@/store/cartStore";
import { getCartTotalQuantity } from "@/utils/quantityLimits";
import { calculateCartTotal } from "@/utils/priceCalculation";

export default function MenuListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = kioskMock.categories.data;
  const selectedCategoryId =
    Number(searchParams.get("category")) || categories[0]?.categoryId;
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  const items = useCartStore((state) => state.items);
  const itemCount = getCartTotalQuantity(items);
  const totalPrice = calculateCartTotal(items);

  const menus = kioskMock.menusByCategory[String(selectedCategoryId)]?.data ?? [];

  const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: String(categoryId) });
  };

  const handleSelectMenu = (menuId) => {
    setSelectedMenuId(menuId);
    navigate(`/menu/${menuId}?category=${selectedCategoryId}`);
  };

  const handleCheckout = () => {
    navigate("/cart");
  };

  return (
    <div className="menu-list-page">
      <Header />

      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      <main className="menu-grid-scroll-area">
        {menus.length === 0 ? (
          <p className="empty-state">이 카테고리에는 메뉴가 없습니다.</p>
        ) : (
          <ul className="menuGrid">
            {menus.map((menu) => (
              <li key={menu.menuId}>
                <MenuCard
                  menu={menu}
                  isSelected={selectedMenuId === menu.menuId}
                  onSelect={handleSelectMenu}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <OrderList />

      <MenuListFooter
        itemCount={itemCount}
        totalPrice={totalPrice}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
