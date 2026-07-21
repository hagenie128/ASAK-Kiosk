// SCR-005 / Cart — Figma 134:7835
// store 장바구니 기준. 가격·수량 제한은 utils 단일 기준.
import { useState } from "react";
import Header from "@/components/common/Header";
import CartItem from "@/components/kiosk/CartItem";
import KioskConfirmDialog from "@/components/kiosk/KioskConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { calculateCartTotal, priceCalculation } from "@/utils/priceCalculation";
import {
  canIncreaseCartItemQuantity,
  getCartTotalQuantity,
} from "@/utils/quantityLimits";
import Footer from "@/components/common/Footer";

function enrichCartItem(item) {
  return {
    ...item,
    lineTotal:
      item.lineTotal ??
      priceCalculation({
        unitPrice: item.unitPrice,
        optionItems: item.optionItems,
        quantity: item.quantity,
      }),
    kcal: item.kcal ?? item.baseKcal,
    optionSummary:
      item.optionSummary ??
      item.optionItems?.map((option) => option.name).join(", "),
  };
}

export default function CartPage() {
  // 페이지 이동
  const navigate = useNavigate();

  const handleGoMenuList = () => {
    navigate("/menu");
  }
  const handleGoPayment = () => {
    navigate("/payment");
  }



  const storedItems = useCartStore((state) => state.items);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearItems = useCartStore((state) => state.clearItems);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const items = storedItems.map(enrichCartItem);
  const empty = items.length === 0;
  const itemCount = items.length;
  const totalPrice = calculateCartTotal(items);
  const quantityTotal = getCartTotalQuantity(items);

  const handleIncrease = (item) => {
    const result = canIncreaseCartItemQuantity({
      items,
      menuId: item.menuId,
    });
    if (result.allowed) {
      updateItemQuantity(item.cartItemId, item.quantity + 1);
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateItemQuantity(item.cartItemId, item.quantity - 1);
    }
  };

  const handleDelete = (cartItemId) => {
    removeItem(cartItemId);
  };

  const handleClearConfirm = () => {
    clearItems();
    setShowClearConfirm(false);
  };

  return (
    <div className="cart-page">
      <Header />

      <div className="kiosk-step-indicator" aria-label="주문 4단계 중 장바구니">
        <span className="is-done" />
        <span />
        <span />
        <span />
      </div>
      <main className="page_content">

        <h1 className="cart-page__title">장바구니</h1>

        <div className="cart-page__toolbar">
          <span>{itemCount}개 항목</span>
          <button
            type="button"
            disabled={empty}
            onClick={() => setShowClearConfirm(true)}
          >
            장바구니 비우기
          </button>
        </div>

        {empty ? (
          <p className="cart-page__empty">장바구니가 비어 있습니다.</p>
        ) : (
          <>
            <ul className="cart-page__items">
              {items.map((item) => (
                <li key={item.cartItemId}>
                  <CartItem
                    item={item}
                    onDecrease={() => handleDecrease(item)}
                    onIncrease={() => handleIncrease(item)}
                    onDelete={() => handleDelete(item.cartItemId)}
                  />
                </li>
              ))}
            </ul>

          </>
        )}
      </main>

      {/* 합산 하단 금액창 */}
      <section className="cart-page__summary">
        <div className="cart-page__summary-row">
          <span>합계</span>
          <div className="cart-page__summary-values">
            <span>{quantityTotal}개</span>
            <b>{formatCurrency(totalPrice)}</b>
          </div>
        </div>
        <div className="cart-page__summary-total">
          <span>총 금액 결제</span>
          <strong>{formatCurrency(totalPrice)}</strong>
        </div>
      </section>

      <Footer leftText="+ 메뉴 더 담기"
        rightText={`주문하기 · ${formatCurrency(totalPrice)}`}
        onLeftClick={handleGoMenuList}
        onRightClick={handleGoPayment} />

      {showClearConfirm ? (
        <KioskConfirmDialog
          title="장바구니를 비울까요?"
          description="담아둔 모든 메뉴와 옵션이 삭제됩니다."
          secondaryLabel="취소"
          primaryLabel="모두 비우기"
          tone="danger"
          onSecondary={() => setShowClearConfirm(false)}
          onPrimary={handleClearConfirm}
        />
      ) : null}
    </div>
  );
}
