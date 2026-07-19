// 메뉴 카드 — Figma Kiosk/MenuCard 150:678
// onSelect(menuId)로 상세 페이지 이동.
import { formatCurrency } from "@/utils/currency";

export default function MenuCard({ menu, isSelected, onSelect }) {
  if (!menu) return null;

  const {
    menuId,
    name,
    price,
    imageUrl,
    baseKcal,
    isSoldOut,
    hasSoldOutIngredient,
    soldOutBadges = [],
  } = menu;

  const isUnorderable = Boolean(isSoldOut || hasSoldOutIngredient);

  return (
    <button
      type="button"
      className={`menu-card${isSelected ? " isSelected" : ""}${isUnorderable ? " isSoldOut" : ""}`}
      onClick={() => {
        if (!isUnorderable && onSelect) onSelect(menuId);
      }}
      disabled={isUnorderable}
    >
      {isUnorderable ? <span className="soldOutBadge">품절</span> : null}
      <img src={imageUrl} alt={name} />
      <div className="menu-card__info">
        <p className="menuName">{name}</p>
        <p className="menuPrice">{formatCurrency(price)}</p>
        <p className="menuKcal">{baseKcal} kcal</p>
      </div>
      {!isUnorderable && soldOutBadges.length > 0 ? (
        <ul className="sold-out-notice">
          {soldOutBadges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
      ) : null}
    </button>
  );
}
