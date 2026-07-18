// 학습용 자리표시자: SCR-004 메뉴 상세·옵션 선택 화면입니다.
// -- MenuDetailPage & CartPage 로직이 참고해야하는 페이지 (수량 제한 체크 가격...등)
//
// [학습] Page 책임 경계
// - Page는 "흐름 조립자"다: 데이터 준비 → draft 상태 → 검증 → Store 저장 → 이동.
// - 가격 숫자의 단일 기준은 priceCalculation.js, 수량 제한은 quantityLimits.js에 둔다.
// - mock를 페이지에서 깊게 파지하기보다 adapters/menuDetailAdapter.js로 옮기는 편이 안전하다.
// - quantity/selectedOptions는 장기적으로 hooks/useMenuDetailDraft.js로 모은다.
// - AllergenAccordion은 스크롤 본문에만 두고, Footer(BottomCTA)는 고정한다.
import Header from '@/components/kiosk/Header';
import { useCartStore } from '@/store/cartStore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import kioskMock from "../../../public/mocks/kiosk.json";
import { TOAST_MESSAGES, canIncreaseQuantity } from '@/utils/quantityLimits';
import { priceCalculation } from '@/utils/priceCalculation';
import MenuDetailSummary from '@/components/kiosk/MenuDetailSummary';
import OptionGroup from '@/components/kiosk/OptionGroup';
import MenuDetailFooter from '@/components/kiosk/MenuDetailFooter';

export default function MenuDetailPage() {

  // 화면 전환 뒤 이전 페이지의 스크롤 위치가 상세 헤더를 가리지 않도록
  // 뷰포트만 맨 위로 되돌린다. 메뉴/옵션/장바구니 데이터는 변경하지 않는다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //상세페이지 categoryId 들어오도록 연결
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  //상세페이지 menuId를 기준으로 들어오도록 연결
  const { menuId } = useParams();
  const navigate = useNavigate();

  // cartStore 기준으로 장바구니 상태를 읽고 저장한다.
  const items = useCartStore((state) => state.items); // 읽기 (조회) -- 장바구니 수량 체크
  const addItem = useCartStore((state) => state.addItem); // 쓰기 (저장)
  // [학습] edit 흐름이 생기면 updateItem(옵션·수량)이 필요하다.
  // 지금은 addItem만 있어 "수정"도 새 줄 추가로 끝날 위험이 있다. cartItemId 기준 분기를 먼저 설계한다.

  const menuDetail = kioskMock.menuDetail[menuId]?.data;
  const optionGroups = kioskMock.menuOptions[menuId]?.data ?? [];

  // [학습] 아래 draft 상태들은 "확정 전 초안"이다. Store(items)와 섞지 않는다.
  // 확정 버튼에서만 Store에 쓴다. 그래야 뒤로가기·취소 시 장바구니가 오염되지 않는다.
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
  // [학습] Add vs Edit
  // - 신규: addItem + 새 cartItemId
  // - 수정: 기존 cartItemId로 update (옵션·수량). 여기서 다시 addItem 하면 줄이 늘어난다.
  // - 주문방식(orderType)은 Home에서 정한 세션 값이다. 상세 저장 시 건드리지 않는다.
  const handleConfirm = () => {
    if (!isRequiredSatisfied || !menuDetail) {
      return;
    }

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
