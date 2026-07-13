import { Link } from "react-router-dom";
import { menuDetailPath } from "../../constants/routes";

export default function MenuCard({ menu }) {
  const disabled = menu.isSoldOut;

  return (
    <Link
      to={disabled ? "#" : menuDetailPath(menu.menuId)}
      className={disabled ? "menu-card menu-card--sold-out" : "menu-card"}
      aria-disabled={disabled}
    >
      <img src={menu.imageUrl} alt={menu.name} className="menu-card__image" />
      <p className="menu-card__name">{menu.name}</p>
      <p className="menu-card__price">{menu.price.toLocaleString()}원</p>
      {disabled && <span className="menu-card__badge">품절</span>}
      {!disabled && menu.hasSoldOutIngredient && (
        <span className="menu-card__badge menu-card__badge--warn">일부 재료 품절</span>
      )}
    </Link>
  );
}
