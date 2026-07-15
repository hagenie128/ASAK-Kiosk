// 학습용 자리표시자: 메뉴 한 개를 보여 주는 카드 UI입니다.
import React from "react";

// menu 객체, isSelected 클릭시 스타일용(클릭이벤트), onSelect 상세페이지 이동
export default function MenuCard({ menu, isSelected, onSelect }) {
  const {
    menuId,
    categoryId,
    name,
    price,
    imageUrl,
    baseKcal,
    isSoldOut,
    hasSoldOutIngredient,
    soldOutBadges = [],
  } = menu;

  // 메뉴 자체 품절 또는 핵심 재료 품절 → 주문 자체가 불가능
  const isUnorderable = isSoldOut || hasSoldOutIngredient;

  return (
    <>
      <button
        type="button"
        className={`menu-card ${isSelected ? "isSelected" : ""} ${isUnorderable ? "isSoldOut" : ""}`}
        onClick={() => !isUnorderable && onSelect(menuId)}
        disabled={isUnorderable}
      >
        {isUnorderable && <span className="soldOutBadge">SOLD OUT</span>}

        <img src={imageUrl} alt={name} />
        <p className="menuName">{name}</p>
        <p className="menuPrice">{price.toLocaleString()}원</p>
        <p className="menuKcal">{baseKcal} kcal</p>

        {/* 일반 재료 품절은 카드 비활성화가 아니라 뱃지만 표시 */}
        {!isUnorderable && soldOutBadges.length > 0 && (
          <ul className="sold-out-notice">
            {soldOutBadges.map((badge, i) => (
              <li key={i}>{badge}</li>
            ))}
          </ul>
        )}
      </button>
    </>
  );
}
