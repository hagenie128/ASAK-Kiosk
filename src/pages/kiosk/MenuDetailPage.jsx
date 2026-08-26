// SCR-004 / Menu Detail — Figma 134:7810
// Page는 흐름 조립자: 데이터 준비 → draft 상태 → 검증 → Store 저장 → 이동.
// 가격은 priceCalculation.js, 수량 제한은 quantityLimits.js가 단일 기준.
import Header from "@/components/common/Header";
import MenuDetailSummary from "@/components/kiosk/MenuDetailSummary";
import OptionGroup from "@/components/kiosk/OptionGroup";
import MenuDetailFooter from "@/components/kiosk/MenuDetailFooter";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { TOAST_MESSAGES, canIncreaseQuantity } from "@/utils/quantityLimits";
import { priceCalculation } from "@/utils/priceCalculation";
import { getMenu } from "@/api/menu";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import { v4 as uuidv4 } from 'uuid';


function createInitialSelectedOptions (optionGroups = [], editingItem,){

  //최초 기본 선택 결과를 만드는 임시 객체
  const initialOptions  = {};

  // 옵션 수정으로 진입한 경우:
  // store에 저장된 기존 optionItems를 화면의 선택 상태로 변환한다.
  if(editingItem){

    (editingItem.optionItems ?? []).forEach((item)=>{
      const optionGroup = optionGroups.find((group)=>
      group.optionGroupId === item.optionGroupId)

      if(!optionGroup) return;

      if(optionGroup.selectType === "SINGLE"){
        initialOptions[item.optionGroupId] = item.optionItemId;
        return;
      }

      initialOptions[item.optionGroupId] = [...(initialOptions[item.optionGroupId]??[]), item.optionItemId,]

    })

    return initialOptions;
    


  }


  // 신규 메뉴 담기인 경우:
  // 현재처럼 메뉴 상세 API의 기본 옵션을 선택한다.
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

  //메뉴에 대한 제외 재료처리
  const [excludedIngredientIds, setExcludedIngredientIds] = useState([]);

  const removableIngredients = menuDetail?.ingredients?.filter((ingredient)=>
    ingredient.isDefault && ingredient.canRemove
  ) ?? [];

  //메뉴 제외 형식 그룹옵션 형식으로 필터링
  const removableIngredientGroup =
  removableIngredients.length > 0 ? {
        optionGroupId: "REMOVABLE_INGREDIENTS",
        name: "재료 빼기",
        groupType: "INGREDIENT_EXCLUSION",
        selectType: "MULTIPLE",
        minSelect: 0,
        maxSelect: removableIngredients.length,
        sortOrder: 0,
        isRequired: false,
        items : removableIngredients.map((ingredient)=>({
          optionItemId: ingredient.ingredientId,
          name: ingredient.ingName,
          role: ingredient.role,
          unit: ingredient.unit,
          kcal: ingredient.kcal,
          extraPrice: 0,
          isRecommended: false,
          isSoldOut: Boolean(ingredient.isSoldOut),
        })),
  }
  : null;

  //제외 재료 선택 토글 함수
  const handleToggleIngredient = (ingredientId)=>{

    setExcludedIngredientIds((prev)=>{

      const isAlreadyExcluded = prev.includes(ingredientId);

      if(isAlreadyExcluded){
        return prev.filter((id)=> id !== ingredientId);
      }

      return [...prev , ingredientId];

    });

  };

  //api-003 처리
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
          createInitialSelectedOptions(data.optionGroups, editingItem,)
        );

        setExcludedIngredientIds(editingItem?.excludedIngredientIds ?? []);

        setQuantity(editingItem?.quantity ?? 1);

      }catch(error){
        setError(error);
        setMenuDetail(null);
        setSelectedOptions({});
        setExcludedIngredientIds([]);
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

  // 옵션 수정을 위한 변수
  const updateItem = useCartStore((state)=>state.updateItem);
  const location = useLocation();
  const editCartItemId = location.state?.editCartItemId;
  
  //수정(업데이트)할 객체 찾기
  const editingItem = items.find((item)=>item.cartItemId === editCartItemId);

  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  //주문 메뉴 수량 증가
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
  
  //주문 메뉴 수량 감소
  const handleDecreaseQuantity = () => {
    setToastMessage(null);
    setQuantity((q) => Math.max(1, q - 1));
  };

  //옵션 아이템 선택·해제 및 maxSelect 제한
  const handleSelectOption = (group, optionItemId) => {

    setSelectedOptions((prev) => {

      // SINGLE(단수 선택시)
      if (group.selectType === "SINGLE") {
        return { 
          ...prev, 
          [group.optionGroupId]: optionItemId
         };
      }

      // MULTIPLE(복수 선택시)
      if(group.selectType === "MULTIPLE"){

        const current = prev[group.optionGroupId] ?? [];
        const isAlreadySelected = current.includes(optionItemId)

        //이미 선택된 아이템 토글시 선택 해제
        if(isAlreadySelected){
          return {
            ...prev,
            [group.optionGroupId]: current.filter((id)=>id !== optionItemId)
          }
        }
        //최대 수량 선택시
        if(current.length >= group.maxSelect){
          return {
            ...prev,
            [group.optionGroupId]: [
              ...current.slice(0,-1), optionItemId,
            ]
          }
        }
        //최대 수량 도달하지 x 새 아이템 추가
        return{
          ...prev,
          [group.optionGroupId]: 
          [
            ...current ,
             optionItemId
            ],
        }
      }
      return prev;

    });
  };
  //데이터 상태값에 따른 UI화면 출력 조건
    if(isLoading){
      return (
        <div className="menu-detail-page">
          <Header />
          <LoadingSpinner/>
        </div>
      );
    }
    if(error){
      return(
        <div className="menu-detail-page">
          <Header/>
          <ErrorMessage/>
        </div>
      )
    }
    if (!menuDetail) {
      return (
        <div className="menu-detail-page">
          <Header />
          <EmptyState/>
        </div>
      );
    }


  //필수 옵션의 minSelect 충족 여부 검사
  const isRequiredSatisfied = optionGroups
    .filter((group) => group.isRequired)
    .every((group) => {
      const selected = selectedOptions[group.optionGroupId];
      if (group.selectType === "SINGLE") return !!selected;
      return (selected?.length ?? 0) >= group.minSelect;
    });

  //선택된 ID를 가격·장바구니에 사용할 옵션 객체 배열로 변환
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


    //옵션 수정하는 부분
  const updateFields = {
    baseKcal: menuDetail.baseKcal,
    quantity,
    optionItems: selectedOptionItems.map((item) => ({
      optionItemId: item.optionItemId,
      optionGroupId: item.optionGroupId,
      optionGroupName: item.optionGroupName,
      name: item.name,
      extraPrice: Number(item.extraPrice ?? 0),
      kcal: Number(item.kcal ?? 0),
      quantity: 1,
    })),
    excludedIngredientIds,
  };

    //옵션 수정할때는
    if(editCartItemId){
      updateItem(editCartItemId, updateFields);
      navigate("/cart", {replace:true});
      return;
    }

    addItem({
      cartItemId: uuidv4(),
      menuId: menuDetail.menuId,
      menuName: menuDetail.name,
      imageUrl: menuDetail.imageUrl,
      baseKcal: Number(menuDetail.baseKcal ?? 0),
      unitPrice: Number(menuDetail.price ?? 0),
      quantity,
      optionItems: selectedOptionItems.map((item) => ({
        optionItemId: item.optionItemId,
        optionGroupId: item.optionGroupId,
        optionGroupName: item.optionGroupName,
        name: item.name,
        extraPrice: Number(item.extraPrice ?? 0),
        kcal: Number(item.kcal ?? 0),
        quantity: 1,
      })),
      excludedIngredientIds,
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

        {/* 일반 옵션 그룹 */}
        {optionGroups.map((group) => (
          <OptionGroup
            key={group.optionGroupId}
            group={group}
            selectedValue={selectedOptions[group.optionGroupId]}
            onSelectItem={(optionItemId) => handleSelectOption(group, optionItemId)}
          />
        ))}

        {/* 제외 가능한 기본 재료 */}
        {
          removableIngredientGroup && (

            <OptionGroup 
              key={removableIngredientGroup.optionGroupId}
              group={removableIngredientGroup}
              selectedValue={excludedIngredientIds}
              onSelectItem={handleToggleIngredient}
            />
          )}


      </main>

      <MenuDetailFooter
        disabled={!isRequiredSatisfied || isSoldOut}
        totalAmount={expectedAmount}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
