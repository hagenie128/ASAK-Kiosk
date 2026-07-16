// 학습용 자리표시자: 메뉴 상세에서 옵션 그룹과 항목을 고르는 UI입니다.

//1) OptionItem (그룹 안의 옵션 선택 카드 한 장) json menuOptions -> data ->  optionGroupId -> items

import React from 'react'

export default function OptionItem({ item,
  groupName,
  isSelected,
  isSingleSelect,
  onSelect }) {

  const {
    name,
    extraPrice,
    extraKcal,
    servingAmount, //섭취량 기준
    servingUnit,
    proteinG,
    iconUrl,
    isRecommended,
    isSoldOut,
  } = item;

  return (
    <>
      <label
        className={[
          "option-item",
          isSelected && "option-item--selected",
          isSoldOut && "option-item--sold-out",
        ]
          .filter(Boolean)
          .join(" ")}
        >
        <img src={iconUrl} alt={name} />
        <input
          type={isSingleSelect ? "radio" : "checkbox"}
          checked={isSelected}
          disabled={isSoldOut}
          onChange={() => !isSoldOut && onSelect()}
        />

        <p>
          {name}
          {isRecommended && <span>추천</span>}
          {isSoldOut && <span>SOLD OUT</span>}
        </p>

        {(servingAmount != null || extraKcal != null) && (
          <p>
            {servingAmount != null && `${servingAmount}${servingUnit ?? ""}`}
            {extraKcal != null && ` ${extraKcal}kcal`}
            {proteinG != null && ` · 단백질 ${proteinG}g`}
          </p>
        )}

        {extraPrice > 0 && <p>{extraPrice.toLocaleString()}원 추가</p>}
      </label>
    </>
  );
}
