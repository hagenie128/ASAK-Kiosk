// OptionGroup — 옵션 카드 그룹
import React from "react";
import OptionItem from "./OptionItem";

export default function OptionGroup({ group, selectedValue, onSelectItem }) {
  const { name, selectType, minSelect, maxSelect, isRequired, items } = group;
  const isSingleSelect = selectType === "SINGLE";

  const isItemSelected = (optionItemId) => {
    if (isSingleSelect) return selectedValue === optionItemId;
    return (selectedValue ?? []).includes(optionItemId);
  };

  return (
    <section className="option-group">
      <div className="option-group__head">
        <span className="option-group__title">{name}</span>
        {isRequired && <span className="option-group__required">필수</span>}
        <span className="option-group__rule">
          {isRequired
            ? `최소 ${minSelect}개 선택`
            : `최대 ${maxSelect}개 선택`}
        </span>
      </div>

      <ul className="option-group__list">
        {items.map((item) => (
          <li key={item.optionItemId}>
            <OptionItem
              groupName={`option-group-${group.optionGroupId}`}
              item={item}
              isSingleSelect={isSingleSelect}
              isSelected={isItemSelected(item.optionItemId)}
              onSelect={() => onSelectItem(item.optionItemId)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
