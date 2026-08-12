// OptionItem — Figma OptionCard 방향 (3열·Lime selected·이름 2줄)
import React from "react";
import { formatCurrency } from "@/utils/currency";

export default function OptionItem({
  item,
  groupName,
  isSelected,
  isSingleSelect,
  onSelect,
}) {
  const {
    optionItemId,
    name,
    extraPrice,
    extraKcal,
    servingAmount,
    servingUnit,
    proteinG,
    iconUrl,
    isRecommended,
    isSoldOut,
  } = item;

  const optionItemClassName = [
    "option-item",
    isSelected && "option-item--selected",
    isSoldOut && "option-item--sold-out",
  ]
    .filter(Boolean)
    .join(" ");

  const hasSecondary =
    servingAmount != null || extraKcal != null || proteinG != null;

  return (
    <label className={optionItemClassName}>
      {iconUrl ? (
        <img className="option-item__image" src={iconUrl} alt="" />
      ) : null}

      <input
        className="option-item__input"
        type={isSingleSelect ? "radio" : "checkbox"}
        name={isSingleSelect ? groupName : undefined}
        value={optionItemId}
        checked={isSelected}
        disabled={isSoldOut}
        onChange={() => {
          if (!isSoldOut) {
            onSelect();
          }
        }}
      />

      <div className="option-item__content">
        <div className="option-item__top">
          <div className="option-item__info">
            <p className="option-item__name">{name}</p>
            {hasSecondary && (
              <p className="option-item__description">
                {servingAmount != null &&
                  `${servingAmount}${servingUnit ?? ""}`}
                {extraKcal != null && ` · ${extraKcal}kcal`}
                {proteinG != null && ` · 단백질 ${proteinG}g`}
              </p>
            )}
          </div>

          {isRecommended && !isSoldOut && (
            <span className="option-item__badge option-item__badge--recommended">
              추천
            </span>
          )}
          {isSoldOut && (
            <span className="option-item__badge option-item__badge--sold-out">
              품절
            </span>
          )}
        </div>

        {extraPrice > 0 && (
          <p className="option-item__price">+{formatCurrency(extraPrice)}</p>
        )}
      </div>
    </label>
  );
}
