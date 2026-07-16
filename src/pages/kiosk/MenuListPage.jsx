// 학습용 자리표시자: SCR-002 메뉴 목록 화면입니다.

import Header from "@/components/kiosk/Header";
import CategoryTabs from "@/components/kiosk/CategoryTabs";
import React, { useState } from "react";
import kioskMock from "../../../public/mocks/kiosk.json";
import { useSearchParams, useNavigate } from "react-router-dom";
import MenuCard from "@/components/kiosk/MenuCard";
import OrderList from "@/components/kiosk/OrderList";

export default function MenuListPage() {
  const navigate = useNavigate();

  //-----카테고리-----

  //카테고리 데이터 연결
  const categories = kioskMock.categories.data;

  //페이지 이동시, 카테고리 초기화 방지
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId =
    Number(searchParams.get("category")) || categories[0]?.categoryId;

  const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: categoryId });
  };

  //-----메뉴-----
  // json에 해당 데이터 없으면, undefined 에러 발생 방지 차원, 빈 배열 값 반환
  const menus =
    kioskMock.menusByCategory[String(selectedCategoryId)]?.data ?? [];

  const [selectedMenuId, setSelectedMenuId] = useState(null);

  //menuId에 따른 상세 페이지 이동
  const handleSelectMenu = (menuId) => {
    setSelectedMenuId(menuId);
    navigate(`/menu/${menuId}?category=${selectedCategoryId}`);
  };

  return (
    <div className="menu-list-page">
      {/* 헤더: 고정 영역 */}
      <Header />

      {/* 카테고리: 고정 영역 */}
      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* 메뉴 카드만 스크롤 */}
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

      {/* 주문 목록 */}
      <OrderList />

      {/* 추후 Footer */}
      {/* <MenuListFooter /> */}
    </div>
  );
}
