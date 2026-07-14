// 학습용 자리표시자: SCR-002 메뉴 목록 화면입니다.

import Header from "@/components/kiosk/Header";
import CategoryTabs from "@/components/kiosk/CategoryTabs";
import React, { useState } from "react";
import kioskMock from "../../../public/mocks/kiosk.json";
import { useSearchParams } from "react-router-dom";

export default function MenuListPage() {
  //카테고리 데이터 연결
  const categories = kioskMock.categories.data;


  //페이지 이동시, 카테고리 초기화 방지
  const [ searchParams , setSearchParams ] = useSearchParams();
  const selectedCategoryId = Number(searchParams.get("category")) || categories[0]?.categoryId;

   const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: categoryId });
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
    </>
  );
}
