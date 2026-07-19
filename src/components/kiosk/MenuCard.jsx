// 메뉴 카드 — Figma Kiosk/MenuCard 150:678
// 클릭은 선택 표시만. 상세 이동·store 없음.
import { formatWon } from "@/data/staticUi";

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
      {isUnorderable ? <span className="soldOutBadge">SOLD OUT</span> : null}
      <img src={imageUrl} alt="" />
      <div className="menu-card__info">
        <p className="menuName">{name}</p>
        <p className="menuPrice">{formatWon(price)}</p>
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
