// 학습용 자리표시자: SCR-004 메뉴 상세·옵션 선택 화면입니다.
// -- MenuDetailPage & CartPage 로직이 참고해야하는 페이지 (수량 제한 체크 가격...등)
import Header from '@/components/kiosk/Header';
import { useOrderSession } from '@/store/orderSessionStore';
import React, { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import kioskMock from "../../../public/mocks/kiosk.json";
import { TOAST_MESSAGES, canIncreaseQuantity } from '@/utils/quantityLimits';
import { priceCalculation } from '@/utils/priceCalculation';
import MenuDetailSummary from '@/components/kiosk/MenuDetailSummary';
import OptionGroup from '@/components/kiosk/OptionGroup';
import MenuDetailFooter from '@/components/kiosk/MenuDetailFooter';

export default function MenuDetailPage() {

  //상세페이지 categoryId 들어오도록 연결
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  //상세페이지 menuId를 기준으로 들어오도록 연결
  const { menuId } = useParams();
  const navigate = useNavigate();

  //useOrderSession 아이템 확인& 추가
  const items = useOrderSession((state) => state.items); // 읽기 (조회) -- 장바구니 수량 체크
  const addItem = useOrderSession((state) => state.addItem); // 쓰기 (저장)

  const menuDetail = kioskMock.menuDetail[menuId]?.data;
  const optionGroups = kioskMock.menuOptions[menuId]?.data ?? [];

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

  // --- 수량 증가 시 제한 판단 ---
  const handleIncreaseQuantity = () => {
    const result = canIncreaseQuantity({
      items,
      menuId: menuDetail.menuId,
      draftQuantity: quantity,
    });

    if (!result.allowed) {
      setToastMessage(TOAST_MESSAGES[result.reason]);
      return; // 수량, 금액 변경 없음
    }

    setToastMessage(null);
    setQuantity((q) => q + 1);
  };

  const handleDecreaseQuantity = () => {
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

  // --- 선택 옵션 저장 --- 
  const selectedOptionItems = optionGroups.flatMap(
    (group) => {
      const selected =
        selectedOptions[group.optionGroupId];

      if (!selected) {
        return [];
      }

      const selectedIds = Array.isArray(selected)
        ? selected
        : [selected];

      return group.items
        .filter((item) =>
          selectedIds.includes(item.optionItemId),
        )
        .map((item) => ({
          ...item,
          optionGroupId: group.optionGroupId,
          optionGroupName: group.name,
        }));
    },
  );

  // --- 금액 계산 (화면 표시용) ---
  const expectedPrice = menuDetail
    ? priceCalculation({
        unitPrice: menuDetail.price,
        optionItems: selectedOptionItems,
        quantity,
      })
    : 0;

  // --- 저장 (버튼 눌렀을 때 딱 한 번) ---
  const handleConfirm = () => {
    if (!isRequiredSatisfied || !menuDetail) {
      return;
    }

    addItem({
      cartItemId: crypto.randomUUID(),

      menuId: menuDetail.menuId,
      menuName: menuDetail.name,
      imageUrl: menuDetail.imageUrl,
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

    navigate(menuListPath, {
      replace: true,
    });
  };

  return (
    <div className="menu-detail-page">
      <Header />
      <MenuDetailSummary
        menu={menuDetail}
        quantity={quantity}
        limitReason={toastMessage}
        onDecrease={handleDecreaseQuantity}
        onIncrease={handleIncreaseQuantity}
      />

      {toastMessage && <p role="alert">{toastMessage}</p>}

      <main className="menu-detail-options">
        {optionGroups.map((group) => (
          <OptionGroup
            key={group.optionGroupId}
            group={group}
            selectedValue={selectedOptions[group.optionGroupId]}
            onSelectItem={(optionItemId) => handleSelectOption(group, optionItemId)}
          />
        ))}
      </main>

      <MenuDetailFooter
        disabled={!isRequiredSatisfied}
        onConfirm={handleConfirm}
        totalPrice={expectedPrice}
      />
    </div>
  );
}
