import React from "react";
import Header from "@/components/kiosk/Header";
import CartItem from "@/components/kiosk/CartItem";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { calculateCartTotal } from '@/utils/priceCalculation';
import { getCartTotalQuantity } from '@/utils/quantityLimits';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const totalQuantity = getCartTotalQuantity(items);
  const totalPrice = calculateCartTotal(items);

  return (
    <div className="cart-page">
      <Header />

      <main className="cart-page__content">

        <div className="kiosk-step-indicator" aria-label="주문 3단계 중 장바구니">
          <span />
          <span />
          <span className="is-current" />
          <span />
        </div>
        <h1 className="cart-page__title">장바구니</h1>

        <ul className="cart-page__items">
            {items.map((item) => (
                <li key={item.cartItemId}>
                    <CartItem item={item} />
                </li>
            ))}
        </ul>

      </main>

      <section className="cart-page__footer">
        <div>
          <span>합계</span>
          <span>{totalQuantity}개</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <button type="button" disabled>
          결제하기
        </button>
      </section>


        {/* 추후 footer추가 예정 */}

    </div>
  );
}
