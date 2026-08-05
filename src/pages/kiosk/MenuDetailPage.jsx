// SCR-004 / Menu Detail — Figma 134:7810
// Page는 흐름 조립자: 데이터 준비 → draft 상태 → 검증 → Store 저장 → 이동.
// 가격은 priceCalculation.js, 수량 제한은 quantityLimits.js가 단일 기준.
import Header from "@/components/common/Header";
import MenuDetailSummary from "@/components/kiosk/MenuDetailSummary";
import OptionGroup from "@/components/kiosk/OptionGroup";
import MenuDetailFooter from "@/components/kiosk/MenuDetailFooter";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { TOAST_MESSAGES, canIncreaseQuantity } from "@/utils/quantityLimits";
import { priceCalculation } from "@/utils/priceCalculation";
import { getMenu } from "@/api/menu";


function createInitialSelectedOptions (optionGroups = []){

  //최초 기본 선택 결과를 만드는 임시 객체
  const initialOptions  = {};

  optionGroups.forEach((group)=>{

    const defaultItem = (group.items ?? []).filter((item)=>item.isDefault && !item.isSoldOut);

    if(defaultItem.length === 0) return;

    initialOptions[group.optionGroupId] = group.selectType === "SINGLE" ? 
    defaultItem[0].optionItemId : defaultItem.map((item)=>item.optionItemId);


  })
  return initialOptions;
}

export default function MenuDetailPage() {

  //페이지 이동을 위한 변수
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  //메뉴디테일 api 연결
  const [menuDetail, setMenuDetail ] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]= useState(null);
  const [selectedOptions, setSelectedOptions ] = useState({});

  const optionGroups = menuDetail?.optionGroups ?? [];

  useEffect(()=>{

    if(!menuId) return;

    //연속 응답에 대한 처리
    let ignore = false;

    const fetchMenuDetail = async ()=>{

      try{
        setIsLoading(true);
        setError(null);

        const data = await getMenu(Number(menuId));

        if(ignore) return;

        setMenuDetail(data);
        setSelectedOptions(
          createInitialSelectedOptions(data.optionGroups)
        );

      }catch(error){
        setError(error);
        setMenuDetail(null);
        setSelectedOptions({});
      }finally{
        if(!ignore){
          setIsLoading(false);
        }
      }

    }

    fetchMenuDetail();

    return ()=>{
      ignore = true
    };

  },[menuId])

  


  //장바구니 추가를 위한 변수
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);


  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);



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
  const expectedAmount = priceCalculation({
    unitPrice: menuDetail.price,
    optionItems: selectedOptionItems,
    quantity,
  });

  const isSoldOut = Boolean(menuDetail.isSoldOut);

  //장바구니에 저장하는 로직
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
          price: expectedAmount,
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

      </main>

      <MenuDetailFooter
        disabled={!isRequiredSatisfied || isSoldOut}
        totalAmount={expectedAmount}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
