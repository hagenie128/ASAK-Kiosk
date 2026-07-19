// 메뉴 디테일 & 장바구니에서 수량 카운터링 컴포넌트 ui
import React from "react";

export default function QuantityStepper({
  quantity,
  minQuantity = 1,
  limitReason,
  onDecrease,
  onIncrease,
}) {
  const isMinusDisabled = quantity <= minQuantity;

  return (
    <div className="quantity-stepper">
      <button
        type="button"
        className="quantity-stepper__btn quantity-stepper__btn--minus"
        onClick={onDecrease}
        disabled={isMinusDisabled}
        aria-label="수량 감소"
      >
        −
      </button>
      <span className="quantity-stepper__value">{quantity}</span>
      <button
        type="button"
        className="quantity-stepper__btn quantity-stepper__btn--plus"
        onClick={onIncrease}
        aria-label="수량 증가"
      >
        +
      </button>
      {limitReason && (
        <p className="quantity-stepper__alert" role="alert">
          {limitReason}
        </p>
      )}
    </div>
  );
}
