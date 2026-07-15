//디테일 페이지의 메뉴 상세 요약 페이지
import React from 'react'

export default function MenuDetailSummary({ menu, quantity, onDecrease, onIncrease }) {

    const { name, price, imageUrl, description  } = menu;


  return (
    <>
      <div className="flexBoxWrap">
        <div>
          <p>{name}</p>
          <p>{description}</p>
          <p>{price.toLocaleString()}원</p>
          {/* 수량 카운팅 */}
          <div>
            <button type="button" onClick={onDecrease} disabled={quantity <= 1}>
              -
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={onIncrease}>
              +
            </button>
          </div>
        </div>
        <img src={imageUrl} alt={name} />
      </div>
    </>
  );
}
