// 학습용 자리표시자: SCR-002 메뉴 목록 화면입니다.

import Header from "@/components/kiosk/Header";
import CategoryTabs from "@/components/kiosk/CategoryTabs";
import React, { useState } from "react";
import kioskMock from "../../../public/mocks/kiosk.json";
import { useSearchParams, useNavigate } from "react-router-dom";
import MenuCard from "@/components/kiosk/MenuCard";


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
    <>
      {/* 해더영역 */}
      <Header></Header>
      {/* 카테고리 영역 */}
      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId} // 선택한 카테고리
        onSelectCategory={handleSelectCategory}
      ></CategoryTabs>

      {/* 메뉴 카드 영역 */}
      {/* 나열된 항목 구조라 ul > li 구조로 변경 */}
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




    </>
  );
}
