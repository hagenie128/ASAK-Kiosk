// 메뉴리스트 footer 컴포넌트

import { formatCurrency } from '@/utils/currency';
import React from 'react'

export default function MenuListFooter({ itemCount, totalPrice, onCheckout }) {
    const hasItems = itemCount > 0;


  return (
    <>
        <footer className="menu-list-footer">
            <div>
                <span>
                    담은 메뉴 {itemCount}개
                </span>
                <span className="menu-list-footer__summary">
                    {hasItems ? formatCurrency(totalPrice) : "0원"}
                </span>
            </div>
            <button className="menu-list-footer__cta" type="button" disabled={!hasItems} onClick={onCheckout}>
                결제하기
            </button>
        </footer>
    </>
  )
}
