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
    <>
      <Header />

      <main>

        <ul>
            {items.map((item) => (
                <li key={item.cartItemId}>
                    <CartItem item={item} />
                </li>
            ))}
        </ul>

      </main>

      <section>
        <div>
          <span>합계</span>
          <span>{totalQuantity}개</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </section>


        {/* 추후 footer추가 예정 */}

    </>
  );
}
