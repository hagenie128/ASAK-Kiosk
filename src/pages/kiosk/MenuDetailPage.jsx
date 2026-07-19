// SCR-004 / Menu Detail — Figma 134:7810 + Allergy Expanded 230:15336
import Header from "@/components/kiosk/Header";
import MenuDetailSummary from "@/components/kiosk/MenuDetailSummary";
import OptionGroup from "@/components/kiosk/OptionGroup";
import MenuDetailFooter from "@/components/kiosk/MenuDetailFooter";
import AllergenAccordion from "@/components/kiosk/AllergenAccordion";
import KioskToast from "@/components/kiosk/KioskToast";
import KioskConfirmDialog from "@/components/kiosk/KioskConfirmDialog";
import kioskMock from "../../../public/mocks/kiosk.json";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const DEFAULT_MENU_ID = "364";
const STATIC_ALLERGENS = ["우유", "대두"];

const TOAST_BY_STATE = {
  "menu-limit": "이 메뉴는 최대 9개까지 담을 수 있어요",
  "cart-limit": "장바구니에는 최대 30개까지 담을 수 있어요",
  success: "장바구니에 담았습니다",
};

export default function MenuDetailPage({ viewState = "default" } = {}) {
  const { menuId: routeMenuId } = useParams();
  const menuId = routeMenuId || DEFAULT_MENU_ID;
  const menuDetail =
    kioskMock.menuDetail[menuId]?.data ?? kioskMock.menuDetail[DEFAULT_MENU_ID]?.data;
  const optionGroups =
    kioskMock.menuOptions[menuId]?.data ?? kioskMock.menuOptions[DEFAULT_MENU_ID]?.data ?? [];

  const allergyOpen =
    viewState === "allergy" ||
    viewState === "allergy-expanded" ||
    viewState === "confirm";

  useEffect(() => {
    if (!allergyOpen) return;
    const id = window.setTimeout(() => {
      document.querySelector(".allergen-accordion")?.scrollIntoView({ block: "nearest", behavior: "instant" });
    }, 50);
    return () => window.clearTimeout(id);
  }, [allergyOpen]);

  const [quantity] = useState(viewState === "menu-limit" ? 9 : 1);
  const [selectedOptions] = useState(() => {
    const initial = {};
    optionGroups.forEach((group) => {
      const defaultItem = group.items.find((item) => item.isDefault);
      if (!defaultItem) return;
      initial[group.optionGroupId] =
        group.selectType === "SINGLE" ? defaultItem.optionItemId : [defaultItem.optionItemId];
    });
    return initial;
  });

  if (!menuDetail || viewState === "error") {
    return (
      <div className="menu-detail-page" data-view-state={viewState}>
        <Header />
        <p className="empty-state">메뉴를 불러오지 못했습니다.</p>
      </div>
    );
  }

  if (viewState === "loading") {
    return (
      <div className="menu-detail-page" data-view-state={viewState}>
        <Header />
        <p className="empty-state">불러오는 중…</p>
      </div>
    );
  }

  const unit = Number(menuDetail.price ?? 0);
  const totalPrice = unit * quantity;
  const toastMessage = TOAST_BY_STATE[viewState] ?? null;
  const showDiscard =
    viewState === "discard" || viewState === "discard-confirm" || viewState === "confirm";

  return (
    <div className="menu-detail-page" data-figma-node="134:7810" data-view-state={viewState}>
      <Header />
      <MenuDetailSummary
        menu={{
          ...menuDetail,
          isSoldOut: viewState === "sold-out",
        }}
        quantity={quantity}
        onDecrease={() => {}}
        onIncrease={() => {}}
      />

      <main className="menu-detail-options">
        {optionGroups.map((group) => (
          <OptionGroup
            key={group.optionGroupId}
            group={group}
            selectedValue={selectedOptions[group.optionGroupId]}
            onSelectItem={() => {}}
          />
        ))}

        <AllergenAccordion allergens={STATIC_ALLERGENS} defaultOpen={allergyOpen} />
      </main>

      <MenuDetailFooter disabled totalPrice={totalPrice} />

      <KioskToast message={toastMessage} tone={viewState === "success" ? "success" : "warning"} />

      {showDiscard ? (
        <KioskConfirmDialog
          title="변경 사항을 버릴까요?"
          description="선택한 옵션이 저장되지 않습니다."
          secondaryLabel="계속 수정"
          primaryLabel="버리기"
          tone="warning"
        />
      ) : null}
    </div>
  );
}
