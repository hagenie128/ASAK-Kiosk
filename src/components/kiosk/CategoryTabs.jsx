// 학습용 자리표시자: 카테고리를 고르는 탭 UI입니다.
import React from "react";

export default function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) {
  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category.categoryId}
          type="button"
          className={selectedCategoryId === category.categoryId ? "active" : ""}
          onClick={() => onSelectCategory(category.categoryId)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
