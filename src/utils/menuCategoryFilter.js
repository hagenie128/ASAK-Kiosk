export function menuBelongsToCategory(menu, categoryId, categories = []) {
  if (!menu || categoryId == null) {
    return false;
  }

  if (menu.categoryId === categoryId) {
    return true;
  }

  const selectedCategory = categories.find(
    (category) => category.categoryId === categoryId,
  );
  if (selectedCategory?.categoryName !== "신메뉴") {
    return false;
  }

  return (menu.tags ?? []).some((tag) => String(tag).toUpperCase() === "NEW");
}
