// SCR-004 / Menu Detail — Figma 134:7810
// Page는 흐름 조립자: 데이터 준비 → draft 상태 → 검증 → Store 저장 → 이동.
// 가격은 priceCalculation.js, 수량 제한은 quantityLimits.js가 단일 기준.
import Header from "@/components/common/Header";
import MenuDetailSummary from "@/components/kiosk/MenuDetailSummary";
import OptionGroup from "@/components/kiosk/OptionGroup";
import MenuDetailFooter from "@/components/kiosk/MenuDetailFooter";
import AllergenAccordion from "@/components/kiosk/AllergenAccordion";
import kioskMock from "../../../public/mocks/kiosk.json";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { TOAST_MESSAGES, canIncreaseQuantity } from "@/utils/quantityLimits";
import { priceCalculation } from "@/utils/priceCalculation";

export default function MenuDetailPage() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  const menuDetail = menuId ? kioskMock.menuDetail[menuId]?.data : null;
  const optionGroups = menuId ? (kioskMock.menuOptions[menuId]?.data ?? []) : [];

  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initial = {};
    optionGroups.forEach((group) => {
      const defaultItem = group.items.find((item) => item.isDefault);
      if (!defaultItem) return;
      initial[group.optionGroupId] =
        group.selectType === "SINGLE"
          ? defaultItem.optionItemId
          : [defaultItem.optionItemId];
    });
    return initial;
  });

  if (!menuDetail) {
    return (
      <div className="menu-detail-page">
        <Header />
        <p className="empty-state">메뉴를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const handleIncreaseQuantity = () => {
    const result = canIncreaseQuantity({
      items,
      menuId: menuDetail.menuId,
      draftQuantity: quantity,
    });

    if (!result.allowed) {
      setToastMessage(TOAST_MESSAGES[result.reason]);
      return;
    }

    setToastMessage(null);
    setQuantity((q) => q + 1);
  };

  const handleDecreaseQuantity = () => {
    setToastMessage(null);
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleSelectOption = (group, optionItemId) => {
    setSelectedOptions((prev) => {
      if (group.selectType === "SINGLE") {
        return { ...prev, [group.optionGroupId]: optionItemId };
      }
      const current = prev[group.optionGroupId] ?? [];
      const next = current.includes(optionItemId)
        ? current.filter((id) => id !== optionItemId)
        : [...current, optionItemId];
      return { ...prev, [group.optionGroupId]: next };
    });
  };

  const isRequiredSatisfied = optionGroups
    .filter((group) => group.isRequired)
    .every((group) => {
      const selected = selectedOptions[group.optionGroupId];
      if (group.selectType === "SINGLE") return !!selected;
      return (selected?.length ?? 0) >= group.minSelect;
    });

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

  //옵션 추가 시 예상 가격 변동 확인 메서드
  const expectedPrice = priceCalculation({
    unitPrice: menuDetail.price,
    optionItems: selectedOptionItems,
    quantity,
  });

  const isSoldOut = Boolean(menuDetail.isSoldOut);

  const handleConfirm = () => {
    if (!isRequiredSatisfied || isSoldOut || !menuDetail) return;

    addItem({
      cartItemId: crypto.randomUUID(),
      menuId: menuDetail.menuId,
      menuName: menuDetail.name,
      imageUrl: menuDetail.imageUrl,
      baseKcal: menuDetail.baseKcal,
      unitPrice: Number(menuDetail.price ?? 0),
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

    const menuListPath = categoryId ? `/menu?category=${categoryId}` : "/menu";
    navigate(menuListPath, { replace: true });
  };

  return (
    <div className="menu-detail-page">
      <Header />
      <MenuDetailSummary
        menu={{
          ...menuDetail,
          isSoldOut,
          price: expectedPrice,
        }}
        quantity={quantity}
        limitReason={toastMessage}
        onDecrease={handleDecreaseQuantity}
        onIncrease={handleIncreaseQuantity}
      />

      {toastMessage ? <p role="alert">{toastMessage}</p> : null}

      <main className="menu-detail-options">
        {optionGroups.map((group) => (
          <OptionGroup
            key={group.optionGroupId}
            group={group}
            selectedValue={selectedOptions[group.optionGroupId]}
            onSelectItem={(optionItemId) => handleSelectOption(group, optionItemId)}
          />
        ))}

        {/* <AllergenAccordion allergens={menuDetail.allergens ?? []} /> */}
      </main>

      <MenuDetailFooter
        disabled={!isRequiredSatisfied || isSoldOut}
        totalPrice={expectedPrice}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
