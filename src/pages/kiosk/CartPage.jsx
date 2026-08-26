// SCR-005 / Cart — Figma 134:7835
// store 장바구니 기준. 가격·수량 제한은 utils 단일 기준.
import { useState } from "react";
import Header from "@/components/common/Header";
import CartItem from "@/components/kiosk/CartItem";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { calculateCartTotal, priceCalculation } from "@/utils/priceCalculation";
import { calculateItemKcal } from "@/utils/nutritionCalculation";
import {
  canIncreaseCartItemQuantity,
  getCartTotalQuantity,
} from "@/utils/quantityLimits";
import Footer from "@/components/common/Footer";
import { validateCart } from "@/api/cart";
import Modal from "@/components/common/Modal";
import failIcon from "@/assets/modal_icon/order_fail.svg";
import deleteIcon from "@/assets/modal_icon/delete_img.svg";

//UI 표시용 매핑 함수
function enrichCartItem(item) {
  return {
    ...item,
    lineAmount:
      item.lineAmount ??
      priceCalculation({
        unitPrice: item.unitPrice,
        optionItems: item.optionItems,
        quantity: item.quantity,
      }),
    totalKcal: calculateItemKcal({
      baseKcal: item.baseKcal,
      optionItems: item.optionItems,
      quantity: item.quantity,
    }),
    optionSummary:
      item.optionSummary ??
      item.optionItems?.map((option) => option.name).join(", "),
  };
}

export default function CartPage() {

  //팝업
  const [ validationModal , setValidationModal ] = useState(null);
  const [ showClearModal , setShowClearModal ] = useState(false);

  // 페이지 이동
  const navigate = useNavigate();

  const storedItems = useCartStore((state) => state.items);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearItems = useCartStore((state) => state.clearItems);
  const setCartValidation = useCartStore((state)=>state.setCartValidation);



  const items = storedItems.map(enrichCartItem);
  const empty = items.length === 0;
  const itemCount = items.length;
  const totalAmount = calculateCartTotal(items);
  const quantityTotal = getCartTotalQuantity(items);

    //장바구니 api-004 request매핑
  const requestItems = storedItems.map((item) =>({
    clientCartItemId:item.cartItemId,
    menuId: item.menuId,
    quantity: item.quantity,
    optionItems: (item.optionItems ?? []).map((option)=>({
      optionItemId: option.optionItemId,
      quantity:option.quantity ?? 1,
    })),
    excludedIngredientIds: item.excludedIngredientIds ?? [],
  }))

  
  // async로 바꿔서 validateCart({ items: requestItems })성공시 이동 로직 수정
  const handleGoPayment = async () => {
    
    try{
      if(empty){
        setValidationModal({
          modal_title: "장바구니가 비어있습니다.",
          modal_content : "메뉴를 담은 후 주문해주세요.",
          rightText : "메뉴 담기",
        })
        return;
      }

      const result = await validateCart({items : requestItems});
      setCartValidation(result);
      navigate("/payment");

    }catch(error){
      console.error(error);
    }
    
  }

  const handleGoMenuList = () => {
    navigate("/menu");
  };

  //수량 추가
  const handleIncrease = (item) => {
    const result = canIncreaseCartItemQuantity({
      items,
      menuId: item.menuId,
    });
    if (result.allowed) {
      updateItemQuantity(item.cartItemId, item.quantity + 1);
    }
  };

  // 수량 감소
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateItemQuantity(item.cartItemId, item.quantity - 1);
    }
  };

  // 메뉴 삭제
  const handleDelete = (cartItemId) => {
    removeItem(cartItemId);
  };

  // 옵션 수정
  const handleEdit = (item)=>{
    navigate(`/menu/${item.menuId}`, {
      state : { editCartItemId : item.cartItemId},
    } )

  };



  return (
    <>
      {
        validationModal && (
          <Modal 
            icon ={failIcon}
            modal_title = {validationModal.modal_title}
            modal_content = {validationModal.modal_content}
            leftText= "닫기"
            rightText={validationModal.rightText}
            onLeftClick={() => setValidationModal(null)}
            onRightClick={()=>{
              setValidationModal(null)
              navigate("/menu");
            }}
          />


        )
      }

      {
        showClearModal && (
          <Modal
            icon ={deleteIcon}
            modal_title ="장바구니를 비우시겠어요?"
            modal_content ="장바구니에 담긴 모든 메뉴가 삭제됩니다."
            leftText ="취소"
            rightText ="비우기"
            onLeftClick={()=> setShowClearModal(false)}
            onRightClick={()=>{
              clearItems();
              setShowClearModal(false);
            }}

          
          />
        )
      }

      <div className="cart-page">
        <Header />

        <div className="kiosk-step-indicator" aria-label="주문 4단계 중 장바구니">
          <span className="is-current" />
          <span />
          <span />
          <span />
        </div>
        <main className="page_content">

          <h1 className="cart-page__title">장바구니</h1>

          <div className="cart-page__toolbar">
            <span>{itemCount}개 항목</span>
            <button
              type="button"
              disabled={empty}
              onClick={() => setShowClearModal(true)}
            >
              장바구니 비우기
            </button>
          </div>

          {empty ? (
            <p className="cart-page__empty">장바구니가 비어 있습니다.</p>
          ) : (
            <>
              <ul className="cart-page__items">
                {items.map((item) => (
                  <li key={item.cartItemId}>
                    <CartItem
                      item={item}
                      onDecrease={() => handleDecrease(item)}
                      onIncrease={() => handleIncrease(item)}
                      onDelete={() => handleDelete(item.cartItemId)}
                      onEdit={()=>handleEdit(item)}
                    />
                  </li>
                ))}
              </ul>

            </>
          )}
        </main>

        {/* 합산 하단 금액창 */}
        <section className="cart-page__summary">
          <div className="cart-page__summary-row">
            <span>합계</span>
            <div className="cart-page__summary-values">
              <span>{quantityTotal}개</span>
              <b>{formatCurrency(totalAmount)}</b>
            </div>
          </div>
          <div className="cart-page__summary-total">
            <span>총 금액 결제</span>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>
        </section>

        <Footer leftText="+ 메뉴 더 담기"
          rightText={`주문하기 · ${formatCurrency(totalAmount)}`}
          onLeftClick={handleGoMenuList}
          onRightClick={handleGoPayment} />


      </div>
    </>

  );
}
