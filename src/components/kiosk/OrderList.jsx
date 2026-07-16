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

      {items.length === 0 ? (
        <div className="order-list__empty">
          <p>담긴 메뉴가 없습니다.</p>
        </div>
      ) : (
        <ul className="order-list__items">
          {items.map((item) => (
            <li
              className="order-list__list-item"
              key={item.cartItemId}
            >
              <OrderListItem
                item={item}
                limitReason={
                  limitMessages[item.cartItemId] ??
                  null
                }
                onDecrease={() =>
                  handleDecrease(item)
                }
                onIncrease={() =>
                  handleIncrease(item)
                }
                onRemove={() =>
                  handleRemove(item.cartItemId)
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}