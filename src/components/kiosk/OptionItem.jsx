// 학습용 자리표시자: 메뉴 상세에서 옵션 그룹과 항목을 고르는 UI입니다.

//1) OptionItem (그룹 안의 옵션 선택 카드 한 장) json menuOptions -> data ->  optionGroupId -> items

import React from "react";
import { formatCurrency } from '@/utils/currency';

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

  return (
    <label className={optionItemClassName}>
      <img className="option-item__image" src={iconUrl} alt={name} />

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
        <p className="option-item__name">
          {name}

          {isRecommended && (
            <span className="option-item__badge option-item__badge--recommended">
              추천
            </span>
          )}

          {isSoldOut && (
            <span className="option-item__badge option-item__badge--sold-out">
              SOLD OUT
            </span>
          )}
        </p>

        {(servingAmount != null || extraKcal != null || proteinG != null) && (
          <p className="option-item__description">
            {servingAmount != null && `${servingAmount}${servingUnit ?? ""}`}

            {extraKcal != null && ` · ${extraKcal}kcal`}

            {proteinG != null && ` · 단백질 ${proteinG}g`}
          </p>
        )}

        {extraPrice > 0 && (
          <p className="option-item__price">+{formatCurrency(extraPrice)}</p>
        )}
      </div>
    </label>
  );
}
