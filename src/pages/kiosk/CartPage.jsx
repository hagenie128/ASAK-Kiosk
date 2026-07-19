// SCR-005 / Cart — Figma 134:7835 + Clear Cart Confirm 272:19493
import Header from "@/components/kiosk/Header";
import CartItem from "@/components/kiosk/CartItem";
import KioskToast from "@/components/kiosk/KioskToast";
import KioskConfirmDialog from "@/components/kiosk/KioskConfirmDialog";
import { STATIC_CART, formatWon } from "@/data/staticUi";

const TOAST_BY_STATE = {
  success: "장바구니를 비웠어요",
  "quantity-changed": "수량이 변경되었습니다",
  "option-updated": "옵션이 수정되었습니다",
  "item-deleted": "메뉴를 삭제했습니다",
};

export default function CartPage({ viewState = "default" } = {}) {
  const empty = viewState === "empty" || viewState === "success";
  const items = empty ? [] : STATIC_CART.items;
  const itemCount = empty ? 0 : STATIC_CART.itemCount;
  const totalPrice = empty ? 0 : STATIC_CART.totalPrice;
  const quantityTotal = empty ? 0 : STATIC_CART.quantityTotal;
  const showClearConfirm = viewState === "confirm" || viewState === "clear-confirm";
  const showDeleteConfirm = viewState === "delete-confirm";
  const toastMessage = TOAST_BY_STATE[viewState] ?? null;

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
                  <CartItem item={item} />
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
        <button type="button" disabled>
          + 메뉴 더 담기
        </button>
        <button type="button" disabled className="is-primary">
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
