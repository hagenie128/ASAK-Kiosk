// 학습용 자리표시자: 장바구니의 메뉴·수량·옵션 한 줄 UI입니다.
// 주문한 메뉴 1개의 표시 card
import React from 'react';
import { formatCurrency } from '@/utils/currency';
import { priceCalculation } from '@/utils/priceCalculation';
import QuantityStepper from './QuantityStepper';
import { useCartStore } from '@/store/cartStore';

export default function CartItem({ item }) {

  if (!item) return null;

  const itemPrice = priceCalculation({
  unitPrice: item.unitPrice,
  optionItems: item.optionItems,
  quantity: item.quantity,
    });

    const updateItemQuantity = useCartStore(
        (state) => state.updateItemQuantity
    );

    const handleIncrease = () => {
        updateItemQuantity(
            item.cartItemId,
            item.quantity + 1
        );
    };

    const handleDecrease = () => {
        if (item.quantity <= 1) return;

        updateItemQuantity(
            item.cartItemId,
            item.quantity - 1
        );
    };


  return (
    <>
      <div>
        <img src={item.imageUrl} alt={item.menuName} />
      </div>
        <ul>
            <li>
                <h2>{item.menuName}</h2>
                <strong>{formatCurrency(item.unitPrice)}</strong>
            </li>
            <li>
                <span>옵션 추가 항목</span>
                {
                    item.optionItems?.map((option)=>
                     <div key={option.optionItemId}>
                        <span>{option.name}</span>
                        <span>+{formatCurrency(option.extraPrice)}</span>
                     </div>
                    
                    )
                }
            </li>
            <li>
                <span>수량</span>
                <QuantityStepper quantity={item.quantity} onDecrease={handleDecrease} onIncrease={handleIncrease} ></QuantityStepper> 개
            </li>
        </ul>

      <div>
        <span>
            상품별 합계
        </span>
        <span>
            {formatCurrency(itemPrice)}
        </span>
        <span>{item.baseKcal} kcal</span>
      </div>
    </>
  );
}

