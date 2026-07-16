// 메뉴 디테일 & 장바구니에서 수량 카운터링 컴포넌트 ui

import React from 'react'

//quantity : 수량 minQuantity: 최소 수량

export default function QuantityStepper({ quantity, minQuantity = 1, limitReason, onDecrease, onIncrease }) {

    const isMinusDisabled = quantity <= minQuantity;

    //     const state =
    // limitReason === "MENU_LIMIT" ? "MenuLimitReached" :
    // limitReason === "CART_LIMIT" ? "CartLimitReached" :
    // isMinusDisabled ? "MinusDisabled" : "Default";


  return (
    <>
      <div>
        <button type="button" onClick={onDecrease} disabled={isMinusDisabled}>
          -
        </button>
        <span>{quantity}</span>
        <button type="button" onClick={onIncrease}>
          +
        </button>
        {limitReason && <p role="alert">{limitReason}</p>}
      </div>
    </>
  );
}
