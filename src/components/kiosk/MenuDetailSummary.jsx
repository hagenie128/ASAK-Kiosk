//디테일 페이지의 메뉴 상세 요약
import React from "react";
import QuantityStepper from "./QuantityStepper";
import { formatCurrency } from "@/utils/currency";

export default function MenuDetailSummary({
  menu,
  quantity,
  limitReason,
  onDecrease,
  onIncrease,
}) {
  const { name, price, imageUrl, description } = menu;

  return (
    <section className="menu-detail-summary">
      <div className="menu-detail-summary__row flexBoxWrap">
        <div className="menu-detail-summary__info">
          <p className="menu-detail-summary__name">{name}</p>
          <p className="menu-detail-summary__desc">{description}</p>
          <p className="menu-detail-summary__price">{formatCurrency(price)}</p>
          <QuantityStepper
            quantity={quantity}
            limitReason={limitReason}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
        </div>
        <img
          className="menu-detail-summary__image"
          src={imageUrl}
          alt={name}
        />
      </div>
    </section>
  );
}
