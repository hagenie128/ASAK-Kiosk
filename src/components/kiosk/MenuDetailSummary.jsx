// 디테일 페이지의 메뉴 상세 요약
// Figma: SCR-004 / MenuDetailSummary (134:7814) — 1080×320, 이미지 좌 260px / 본문 우 668px.
import React from "react";
import QuantityStepper from "./QuantityStepper";
import { formatCurrency } from "@/utils/currency";

// Figma badges 프레임(136:3956)의 3종 색상. 값이 없는 배지는 중립 스타일로 떨어진다.
const BADGE_MODIFIERS = {
  BEST: "best",
  NEW: "new",
  VEGAN: "vegan",
};

export default function MenuDetailSummary({
  menu,
  quantity,
  limitReason,
  onDecrease,
  onIncrease,
}) {
  const { name, price, imageUrl, description, baseKcal, badges = [] } = menu;

  return (
    <section className="menu-detail-summary">
      <img className="menu-detail-summary__image" src={imageUrl} alt={name} />

      <div className="menu-detail-summary__content">
        <div className="menu-detail-summary__top">
          {badges.length > 0 && (
            <ul className="menu-detail-summary__badges">
              {badges.map((badge) => (
                <li
                  key={badge}
                  className={`menu-badge menu-badge--${BADGE_MODIFIERS[badge.toUpperCase()] ?? "neutral"}`}
                >
                  {badge}
                </li>
              ))}
            </ul>
          )}
          <p className="menu-detail-summary__name">{name}</p>
          <p className="menu-detail-summary__desc">{description}</p>
          {baseKcal != null && (
            <p className="menu-detail-summary__kcal">{baseKcal}kcal</p>
          )}
        </div>

        <div className="menu-detail-summary__bottom">
          <p className="menu-detail-summary__price">{formatCurrency(price)}</p>
          <QuantityStepper
            quantity={quantity}
            limitReason={limitReason}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
        </div>
      </div>
    </section>
  );
}
