// 주문 목록에 들어갈  주문 1건을 이루는 컴포넌트


import React from "react";
import QuantityStepper from "./QuantityStepper";
import { priceCalculation } from "@/utils/priceCalculation";
import { formatCurrency } from "@/utils/currency";

export default function OrderListItem({
  item,
  limitReason,
  onDecrease,
  onIncrease,
  onRemove,
}) {
  const {
    menuName,
    imageUrl,
    unitPrice,
    quantity,
    optionItems = [],
  } = item;

  const itemTotalPrice = priceCalculation({
    unitPrice,
    optionItems,
    quantity,
  });

  const optionSummary = optionItems
    .map((optionItem) => optionItem.name)
    .join(" · ");

  return (
    <article className="order-list-item">
      <div className="order-list-item__menu">
        {imageUrl ? (
          <img
            className="order-list-item__image"
            src={imageUrl}
            alt={`${menuName} 메뉴`}
          />
        ) : (
          <div
            className="order-list-item__image-placeholder"
            aria-hidden="true"
          />
        )}

        <div className="order-list-item__information">
          <h3 className="order-list-item__name">
            {menuName}
          </h3>

          {optionSummary && (
            <p className="order-list-item__options">
              {optionSummary}
            </p>
          )}
        </div>
      </div>

      <QuantityStepper
        quantity={quantity}
        minQuantity={1}
        limitReason={limitReason}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
      />

      <strong
        className="order-list-item__price"
        aria-live="polite"
      >
        {formatCurrency(itemTotalPrice)}
      </strong>

      <button
        className="order-list-item__remove"
        type="button"
        onClick={onRemove}
        aria-label={`${menuName} 삭제`}
      >
        <span aria-hidden="true">🗑</span>
      </button>
    </article>
  );
}