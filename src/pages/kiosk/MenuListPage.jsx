// SCR-003 / Menu List / Default — Figma 134:7792
// 정적 mock만 표시. store 네비게이션·결제 흐름 없음.
/**
 * [FIGMA-AI] Figma SCR-003 레이아웃, sold-out/loading/error/empty 미리보기 상태를 옮긴 화면입니다.
 * [AI-LOGIC] viewState와 TOAST_BY_STATE는 화면 QA를 위한 목업 상태 제어입니다.
 * [KIM-RESTORED] 카테고리 query 유지, 메뉴 상세 이동, 장바구니 수량·금액 계산과 /cart 이동을 복구했습니다.
 */
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/kiosk/Header";
import CategoryTabs from "@/components/kiosk/CategoryTabs";
import MenuCard from "@/components/kiosk/MenuCard";
import MenuListFooter from "@/components/kiosk/MenuListFooter";
import KioskToast from "@/components/kiosk/KioskToast";
import kioskMock from "../../../public/mocks/kiosk.json";
import { useCartStore } from "@/store/cartStore";
import { getCartTotalQuantity } from "@/utils/quantityLimits";
import { calculateCartTotal } from "@/utils/priceCalculation";

const TOAST_BY_STATE = {
  "empty-cart": "장바구니에 메뉴를 담아주세요",
  "cart-empty": "장바구니에 메뉴를 담아주세요",
  "item-added": "장바구니에 담았습니다",
  success: "장바구니에 담았습니다",
};

export default function MenuListPage({ viewState = "default" } = {}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = kioskMock.categories.data;
  const selectedCategoryId =
    Number(searchParams.get("category")) || categories[0]?.categoryId;
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const items = useCartStore((state) => state.items);

  const menus =
    viewState === "empty"
      ? []
      : (kioskMock.menusByCategory[String(selectedCategoryId)]?.data ?? []);

  const toastMessage = TOAST_BY_STATE[viewState] ?? null;
  const previewHasCart =
    viewState === "with-cart" || viewState === "item-added" || viewState === "success";
  const itemCount = getCartTotalQuantity(items);
  const totalPrice = calculateCartTotal(items);
  const displayedItemCount = viewState === "default" ? itemCount : previewHasCart ? 2 : 0;
  const displayedTotalPrice = viewState === "default" ? totalPrice : previewHasCart ? 16800 : 0;

  const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: String(categoryId) });
  };

  const handleSelectMenu = (menuId) => {
    setSelectedMenuId(menuId);
    navigate(`/menu/${menuId}?category=${selectedCategoryId}`);
  };

  return (
    <div className="menu-list-page" data-figma-node="134:7792" data-view-state={viewState}>
      <Header />

      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      <main className="menu-grid-scroll-area">
        {viewState === "loading" ? (
          <p className="empty-state">불러오는 중…</p>
        ) : viewState === "error" ? (
          <p className="empty-state">메뉴를 불러오지 못했습니다.</p>
        ) : menus.length === 0 ? (
          <p className="empty-state">이 카테고리에는 메뉴가 없습니다.</p>
        ) : (
          <ul className="menuGrid">
            {menus.map((menu) => (
              <li key={menu.menuId}>
                <MenuCard
                  menu={{
                    ...menu,
                    isSoldOut: viewState === "sold-out" ? true : menu.isSoldOut,
                  }}
                  isSelected={selectedMenuId === menu.menuId}
                  onSelect={handleSelectMenu}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <MenuListFooter
        itemCount={displayedItemCount}
        totalPrice={displayedTotalPrice}
        onCheckout={() => navigate("/cart")}
      />

      <KioskToast
        message={toastMessage}
        tone={viewState === "item-added" || viewState === "success" ? "success" : "warning"}
      />
    </div>
  );
}
