// 학습용 자리표시자: SCR-002 메뉴 목록 화면입니다.

import Header from "@/components/kiosk/Header";
import CategoryTabs from "@/components/kiosk/CategoryTabs";
import React, { useState } from "react";
import kioskMock from "../../../public/mocks/kiosk.json";
import { useSearchParams, useNavigate } from "react-router-dom";
import MenuCard from "@/components/kiosk/MenuCard";
import OrderList from "@/components/kiosk/OrderList";
import MenuListFooter from "@/components/kiosk/MenuListFooter";
import { useCartStore } from "@/store/cartStore";
import { getCartTotalQuantity } from "@/utils/quantityLimits";
import { calculateCartTotal } from "@/utils/priceCalculation";

export default function MenuListPage() {
  const navigate = useNavigate();

  // 카테고리 데이터는 현재 임시 목업만 사용합니다.
  const categories = kioskMock.categories.data;

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId =
    Number(searchParams.get("category")) || categories[0]?.categoryId;

  const menus =
    kioskMock.menusByCategory[String(selectedCategoryId)]?.data ?? [];

  const [selectedMenuId, setSelectedMenuId] = useState(null);

  const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: categoryId });
  };

  const handleSelectMenu = (menuId) => {
    setSelectedMenuId(menuId);
    navigate(`/menu/${menuId}?category=${selectedCategoryId}`);
  };

  const items = useCartStore((state) => state.items);
  const itemCount = getCartTotalQuantity(items);
  const totalPrice = calculateCartTotal(items);

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
