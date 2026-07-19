// Kiosk/CartItemCard — Figma 150:404 / SCR-005
// 수량·옵션 수정·삭제는 표시만. store/API 없음.
import { formatWon } from "@/data/staticUi";

function MinusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3.375 9H14.625" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 3.375V14.625M3.375 9H14.625" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function CartItem({ item, onDecrease, onIncrease, onDelete }) {
  if (!item) return null;

  return (
    <article className="cart-item">
      <div className="cart-item__main">
        <div className="cart-item__image-wrap">
          <img className="cart-item__image" src={item.imageUrl} alt="" />
        </div>

        <div className="cart-item__body">
          <div className="cart-item__title-row">
            <p className="cart-item__name">{item.menuName}</p>
            <strong className="cart-item__price">{formatWon(item.unitPrice)}</strong>
          </div>

          {item.optionSummary ? <p className="cart-item__summary">{item.optionSummary}</p> : null}

          <div className="cart-item__quantity">
            <span>수량</span>
            <div className="cart-item__stepper">
              <button
                type="button"
                className={`cart-item__step${item.minusDisabled ? " is-disabled" : ""}`}
                disabled={item.quantity <= 1}
                onClick={onDecrease}
                aria-label="수량 감소"
              >
                <MinusIcon />
              </button>
              <span className="cart-item__qty">{item.quantity}</span>
              <button type="button" className="cart-item__step" onClick={onIncrease} aria-label="수량 증가">
                <PlusIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="cart-item__footer">
        <div className="cart-item__actions">
          <button type="button" disabled>
            옵션 수정
          </button>
          <button type="button" onClick={onDelete} className="is-delete">
            삭제
          </button>
        </div>
        <div className="cart-item__total">
          <span className="cart-item__total-label">상품별 합계</span>
          <div className="cart-item__total-values">
            <b>{formatWon(item.lineTotal)}</b>
            <i aria-hidden="true" />
            <span>{item.kcal}kcal</span>
          </div>
        </div>
      </footer>
    </article>
  );
}
