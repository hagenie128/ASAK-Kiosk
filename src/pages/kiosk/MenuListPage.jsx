// SCR-003 메뉴 목록 — Loading / Empty / Error / 품절 카드

import Header from "@/components/kiosk/Header";
import CategoryTabs from "@/components/kiosk/CategoryTabs";
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MenuCard from "@/components/kiosk/MenuCard";
import OrderList from "@/components/kiosk/OrderList";
import MenuListFooter from "@/components/kiosk/MenuListFooter";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useCartStore } from "@/store/cartStore";
import { getCartTotalQuantity } from "@/utils/quantityLimits";
import { calculateCartTotal } from "@/utils/priceCalculation";
import { useMenuCategories, useMenuList } from "@/hooks/useMenu";

export default function MenuListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    status: categoryStatus,
    categories,
    reload: reloadCategories,
  } = useMenuCategories();

  const selectedCategoryId =
    Number(searchParams.get("category")) || categories[0]?.categoryId;

  const {
    status: menuStatus,
    menus,
    reload: reloadMenus,
  } = useMenuList(selectedCategoryId);

  const [selectedMenuId, setSelectedMenuId] = useState(null);

  const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: String(categoryId) });
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

  const showCategoryLoading = categoryStatus === "loading";
  const showCategoryError = categoryStatus === "error";
  const showMenuLoading = menuStatus === "loading";
  const showMenuError = menuStatus === "error";
  const showMenuEmpty = menuStatus === "empty";

  return (
    <div className="menu-list-page">
      <Header />

      {showCategoryLoading ? (
        <div className="category-tabs category-tabs--loading">
          <LoadingSpinner label="카테고리 불러오는 중…" />
        </div>
      ) : showCategoryError ? (
        <div className="category-tabs category-tabs--error">
          <ErrorMessage
            title="카테고리를 불러오지 못했어요"
            onRetry={reloadCategories}
          />
        </div>
      ) : (
        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
      )}

      <main className="menu-grid-scroll-area">
        {showMenuLoading || showCategoryLoading ? (
          <LoadingSpinner label="메뉴 불러오는 중…" />
        ) : showMenuError ? (
          <ErrorMessage onRetry={reloadMenus} />
        ) : showMenuEmpty ? (
          <EmptyState
            title="표시할 메뉴가 없어요"
            description="다른 카테고리를 선택해 보세요."
            actionLabel="새로고침"
            onAction={reloadMenus}
          />
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
