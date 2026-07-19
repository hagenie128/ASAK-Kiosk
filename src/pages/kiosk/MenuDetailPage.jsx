// SCR-004 / Menu Detail — Figma 134:7810 + Allergy Expanded 230:15336
/**
 * [FIGMA-AI] Figma SCR-004 레이아웃, 알레르기·품절·확인 미리보기 상태와 정적 에셋을 옮긴 화면입니다.
 * [AI-LOGIC] viewState, 자동 스크롤, 토스트·확인 다이얼로그 표시는 QA/미리보기 보조 로직입니다.
 * [KIM-RESTORED] 옵션 선택, 수량 제한, 추가금 계산, 장바구니 저장과 메뉴 목록 복귀 흐름을 복구했습니다.
 */
import Header from "@/components/kiosk/Header";
import MenuDetailSummary from "@/components/kiosk/MenuDetailSummary";
import OptionGroup from "@/components/kiosk/OptionGroup";
import MenuDetailFooter from "@/components/kiosk/MenuDetailFooter";
import AllergenAccordion from "@/components/kiosk/AllergenAccordion";
import KioskToast from "@/components/kiosk/KioskToast";
import KioskConfirmDialog from "@/components/kiosk/KioskConfirmDialog";
import kioskMock from "../../../public/mocks/kiosk.json";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { TOAST_MESSAGES, canIncreaseQuantity } from "@/utils/quantityLimits";
import { priceCalculation } from "@/utils/priceCalculation";

const DEFAULT_MENU_ID = "364";
const STATIC_ALLERGENS = ["우유", "대두"];

const TOAST_BY_STATE = {
  "menu-limit": "이 메뉴는 최대 9개까지 담을 수 있어요",
  "cart-limit": "장바구니에는 최대 30개까지 담을 수 있어요",
  success: "장바구니에 담았습니다",
};

export default function MenuDetailPage({ viewState = "default" } = {}) {
  const { menuId: routeMenuId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const menuId = routeMenuId || DEFAULT_MENU_ID;
  const categoryId = searchParams.get("category");
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
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

  const [quantity, setQuantity] = useState(viewState === "menu-limit" ? 9 : 1);
  const [limitMessage, setLimitMessage] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(() => {
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
  const selectedOptionItems = optionGroups.flatMap((group) => {
    const selected = selectedOptions[group.optionGroupId];
    if (!selected) return [];

    const selectedIds = Array.isArray(selected) ? selected : [selected];
    return group.items
      .filter((item) => selectedIds.includes(item.optionItemId))
      .map((item) => ({
        ...item,
        optionGroupId: group.optionGroupId,
        optionGroupName: group.name,
      }));
  });
  const totalPrice = priceCalculation({
    unitPrice: unit,
    optionItems: selectedOptionItems,
    quantity,
  });
  const toastMessage = TOAST_BY_STATE[viewState] ?? null;
  const showDiscard =
    viewState === "discard" || viewState === "discard-confirm" || viewState === "confirm";
  const isRequiredSatisfied = optionGroups
    .filter((group) => group.isRequired)
    .every((group) => {
      const selected = selectedOptions[group.optionGroupId];
      return group.selectType === "SINGLE"
        ? Boolean(selected)
        : (selected?.length ?? 0) >= group.minSelect;
    });
  const isSoldOut = viewState === "sold-out" || menuDetail.isSoldOut;

  const handleIncreaseQuantity = () => {
    const result = canIncreaseQuantity({
      items,
      menuId: menuDetail.menuId,
      draftQuantity: quantity,
    });
    if (!result.allowed) {
      setLimitMessage(TOAST_MESSAGES[result.reason]);
      return;
    }
    setLimitMessage(null);
    setQuantity((current) => current + 1);
  };

  const handleDecreaseQuantity = () => {
    setLimitMessage(null);
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleSelectOption = (group, optionItemId) => {
    setSelectedOptions((previous) => {
      if (group.selectType === "SINGLE") {
        return { ...previous, [group.optionGroupId]: optionItemId };
      }
      const current = previous[group.optionGroupId] ?? [];
      const next = current.includes(optionItemId)
        ? current.filter((id) => id !== optionItemId)
        : [...current, optionItemId];
      return { ...previous, [group.optionGroupId]: next };
    });
  };

  const handleConfirm = () => {
    if (!isRequiredSatisfied || isSoldOut) return;

    addItem({
      cartItemId: crypto.randomUUID(),
      menuId: menuDetail.menuId,
      menuName: menuDetail.name,
      imageUrl: menuDetail.imageUrl,
      baseKcal: menuDetail.baseKcal,
      unitPrice: unit,
      quantity,
      optionItems: selectedOptionItems.map((item) => ({
        optionItemId: item.optionItemId,
        optionGroupId: item.optionGroupId,
        optionGroupName: item.optionGroupName,
        name: item.name,
        extraPrice: Number(item.extraPrice ?? 0),
        quantity: 1,
      })),
      excludedIngredientIds: [],
    });

    navigate(categoryId ? `/menu?category=${categoryId}` : "/menu", { replace: true });
  };

  return (
    <div className="menu-detail-page" data-figma-node="134:7810" data-view-state={viewState}>
      <Header />
      <MenuDetailSummary
        menu={{
          ...menuDetail,
          isSoldOut,
        }}
        quantity={quantity}
        limitReason={limitMessage}
        onDecrease={handleDecreaseQuantity}
        onIncrease={handleIncreaseQuantity}
      />

      <main className="menu-detail-options">
        {optionGroups.map((group) => (
          <OptionGroup
            key={group.optionGroupId}
            group={group}
            selectedValue={selectedOptions[group.optionGroupId]}
            onSelectItem={(optionItemId) => handleSelectOption(group, optionItemId)}
          />
        ))}

        <AllergenAccordion allergens={STATIC_ALLERGENS} defaultOpen={allergyOpen} />
      </main>

      <MenuDetailFooter
        disabled={!isRequiredSatisfied || isSoldOut}
        totalPrice={totalPrice}
        onConfirm={handleConfirm}
      />

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
