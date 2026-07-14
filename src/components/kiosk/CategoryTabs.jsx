// 학습용 자리표시자: 카테고리를 고르는 탭 UI입니다.
import React, { useState } from "react";

export default function CategoryTabs({ categories, onSelectCategory }) {
  const [selectedId, setSelectedId] = useState(categories[0]?.categoryId);

  const handleSelect = (categoryId) => {
    setSelectedId(categoryId);
    onSelectCategory(categoryId); // 부모에 알림
  };

  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat.categoryId}
          className={selectedId === cat.categoryId ? "active" : ""}
          onClick={() => handleSelect(cat.categoryId)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
