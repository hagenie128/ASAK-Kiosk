import { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import CategoryTabs from "../../components/kiosk/CategoryTabs";
import MenuCard from "../../components/kiosk/MenuCard";
import { getCategories, getMenus } from "../../api/menu";

// SCR-003 메뉴 선택 — API-001(카테고리), API-002(메뉴 목록)
export default function MenuListPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setActiveCategoryId(data[0]?.categoryId ?? null);
    });
  }, []);

  useEffect(() => {
    if (activeCategoryId == null) return;
    setLoading(true);
    getMenus(activeCategoryId)
      .then(setMenus)
      .finally(() => setLoading(false));
  }, [activeCategoryId]);

  return (
    <section className="menu-list-page">
      <Header title="메뉴 선택" />
      <CategoryTabs categories={categories} activeId={activeCategoryId} onSelect={setActiveCategoryId} />
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <div className="menu-list-page__grid">
          {menus.map((menu) => (
            <MenuCard key={menu.menuId} menu={menu} />
          ))}
        </div>
      )}
    </section>
  );
}
