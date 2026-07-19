// SCR-005 / Cart — Figma 134:7835 + Clear Cart Confirm 272:19493
/**
 * [FIGMA-AI] Figma SCR-005 레이아웃, 확인 다이얼로그·토스트와 viewState 미리보기 상태를 옮긴 화면입니다.
 * [AI-LOGIC] STATIC_CART는 미리보기용 목업 데이터이며 기본 화면에서는 사용하지 않습니다.
 * [KIM-RESTORED] 실제 장바구니 조회, 수량 증감·삭제, 합계 계산, 메뉴/결제 이동을 복구했습니다.
 */
import Header from "@/components/kiosk/Header";
import CartItem from "@/components/kiosk/CartItem";
import KioskToast from "@/components/kiosk/KioskToast";
import KioskConfirmDialog from "@/components/kiosk/KioskConfirmDialog";
import { STATIC_CART, formatWon } from "@/data/staticUi";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { calculateCartTotal, priceCalculation } from "@/utils/priceCalculation";
import { canIncreaseCartItemQuantity, getCartTotalQuantity } from "@/utils/quantityLimits";

const TOAST_BY_STATE = {
  success: "장바구니를 비웠어요",
  "quantity-changed": "수량이 변경되었습니다",
  "option-updated": "옵션이 수정되었습니다",
  "item-deleted": "메뉴를 삭제했습니다",
};

export default function CartPage({ viewState = "default" } = {}) {
  const navigate = useNavigate();
  const storedItems = useCartStore((state) => state.items);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const isPreview = viewState !== "default";
  const empty = isPreview && (viewState === "empty" || viewState === "success");
  const sourceItems = isPreview ? (empty ? [] : STATIC_CART.items) : storedItems;
  const items = sourceItems.map((item) => ({
    ...item,
    lineTotal: item.lineTotal ?? priceCalculation({
      unitPrice: item.unitPrice,
      optionItems: item.optionItems,
      quantity: item.quantity,
    }),
    kcal: item.kcal ?? item.baseKcal,
    optionSummary: item.optionSummary ?? item.optionItems?.map((option) => option.name).join(", "),
  }));
  const itemCount = isPreview ? (empty ? 0 : STATIC_CART.itemCount) : items.length;
  const totalPrice = isPreview ? (empty ? 0 : STATIC_CART.totalPrice) : calculateCartTotal(items);
  const quantityTotal = isPreview ? (empty ? 0 : STATIC_CART.quantityTotal) : getCartTotalQuantity(items);
  const showClearConfirm = viewState === "confirm" || viewState === "clear-confirm";
  const showDeleteConfirm = viewState === "delete-confirm";
  const toastMessage = TOAST_BY_STATE[viewState] ?? null;

  const handleIncrease = (item) => {
    const result = canIncreaseCartItemQuantity({ items, menuId: item.menuId });
    if (result.allowed) {
      updateItemQuantity(item.cartItemId, item.quantity + 1);
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateItemQuantity(item.cartItemId, item.quantity - 1);
    }
  };

  return (
    <div className="cart-page" data-figma-node="134:7835" data-view-state={viewState}>
      <Header />

      <main className="cart-page__content">
        <div className="kiosk-step-indicator" aria-label="주문 3단계 중 장바구니">
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-current" />
          <span />
        </div>

        <h1 className="cart-page__title">장바구니</h1>

        <div className="cart-page__toolbar">
          <span>{itemCount}개 항목</span>
          <button type="button" disabled>
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
                    onDelete={() => removeItem(item.cartItemId)}
                  />
                </li>
              ))}
            </ul>

            <section className="cart-page__summary">
              <div className="cart-page__summary-row">
                <span>합계</span>
                <div className="cart-page__summary-values">
                  <span>{quantityTotal}개</span>
                  <b>{formatWon(totalPrice)}</b>
                </div>
              </div>
              <div className="cart-page__summary-total">
                <span>총 금액 결제</span>
                <strong>{formatWon(totalPrice)}</strong>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="cart-page__footer">
        <button type="button" onClick={() => navigate("/menu")}>
          + 메뉴 더 담기
        </button>
        <button
          type="button"
          disabled={items.length === 0}
          onClick={() => navigate("/payment")}
          className="is-primary"
        >
          주문하기 · {formatWon(totalPrice)}
        </button>
      </footer>

      <KioskToast
        message={toastMessage}
        tone={viewState === "success" || viewState === "item-deleted" ? "success" : "warning"}
      />

      {showClearConfirm ? (
        <KioskConfirmDialog
          title="장바구니를 비울까요?"
          description="담아둔 모든 메뉴와 옵션이 삭제됩니다."
          secondaryLabel="취소"
          primaryLabel="모두 비우기"
          tone="danger"
        />
      ) : null}

      {showDeleteConfirm ? (
        <KioskConfirmDialog
          title="이 메뉴를 삭제할까요?"
          description="선택한 메뉴가 장바구니에서 제거됩니다."
          secondaryLabel="취소"
          primaryLabel="삭제"
          tone="danger"
        />
      ) : null}
    </div>
  );
}
