//디테일 페이지의 메뉴 상세 요약 페이지
import React from 'react'
import QuantityStepper from './QuantityStepper';

export default function MenuDetailSummary({ menu, quantity, limitReason, onDecrease, onIncrease }) {

    const { name, price, imageUrl, description  } = menu;


  return (
    <>
      <div className="flexBoxWrap">
        <div>
          <p>{name}</p>
          <p>{description}</p>
          <p>{price.toLocaleString()}원</p>
          {/* 수량 카운팅 */}
          <QuantityStepper
            quantity={quantity}
            limitReason={limitReason}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
        </div>
        <img src={imageUrl} alt={name} />
      </div>
    </>
  );
}
