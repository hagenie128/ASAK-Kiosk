export default function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <nav className="category-tabs">
      {categories.map((c) => (
        <button
          type="button"
          key={c.categoryId}
          className={c.categoryId === activeId ? "category-tabs__item is-active" : "category-tabs__item"}
          onClick={() => onSelect(c.categoryId)}
        >
          {c.name}
        </button>
      ))}
    </nav>
  );
}
