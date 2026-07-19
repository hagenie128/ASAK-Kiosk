//주문 목록 컴포넌트
import React, { useMemo, useState } from "react";
import OrderListItem from "./OrderListItem";
import { useOrderSession } from "@/store/orderSessionStore";
import {
  canIncreaseCartItemQuantity,
  TOAST_MESSAGES,
} from "@/utils/quantityLimits";

export default function OrderList() {
  const items = useOrderSession(
    (state) => state.items,
  );

  const updateItemQuantity = useOrderSession(
    (state) => state.updateItemQuantity,
  );

  const removeItem = useOrderSession(
    (state) => state.removeItem,
  );

  const [limitMessages, setLimitMessages] =
    useState({});

  const totalQuantity = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.quantity ?? 0),
        0,
      ),
    [items],
  );

  const clearLimitMessage = (cartItemId) => {
    setLimitMessages((previous) => {
      const next = { ...previous };
      delete next[cartItemId];
      return next;
    });
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      return;
    }

    updateItemQuantity(
      item.cartItemId,
      item.quantity - 1,
    );

    clearLimitMessage(item.cartItemId);
  };

  const handleIncrease = (item) => {
    const result = canIncreaseCartItemQuantity({
      items,
      menuId: item.menuId,
    });

    if (!result.allowed) {
      setLimitMessages((previous) => ({
        ...previous,
        [item.cartItemId]:
          TOAST_MESSAGES[result.reason],
      }));

      return;
    }

    updateItemQuantity(
      item.cartItemId,
      item.quantity + 1,
    );

    clearLimitMessage(item.cartItemId);
  };

  const handleRemove = (cartItemId) => {
    removeItem(cartItemId);
    clearLimitMessage(cartItemId);
  };

  // Figma SCR-003에서 Shared/CartFooterBar는 Default(빈 장바구니)에서 hidden이고
  // Items Added 상태에서만 나타난다. 담긴 메뉴가 없으면 이 영역을 그리지 않는다.
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="order-list"
      aria-labelledby="order-list-title"
    >
      <header className="order-list__header">
        <h2
          id="order-list-title"
          className="order-list__title"
        >
          주문내역
        </h2>

        <strong className="order-list__count">
          총 {totalQuantity}개
        </strong>
      </header>

      <ul className="order-list__items">
        {items.map((item) => (
          <li
            className="order-list__list-item"
            key={item.cartItemId}
          >
            <OrderListItem
              item={item}
              limitReason={
                limitMessages[item.cartItemId] ?? null
              }
              onDecrease={() => handleDecrease(item)}
              onIncrease={() => handleIncrease(item)}
              onRemove={() =>
                handleRemove(item.cartItemId)
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}