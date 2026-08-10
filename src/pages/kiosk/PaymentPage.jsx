// SCR-007 / Payment — Figma 134:7861 (WBS2-026~027)
// UI OK · 남은 연결: 수단 mock + 결제 승인/실패 분기
//
// mock: paymentMethods.data[]
//   methodId, name, description, isActive, isMaintenance, sortOrder
// mock: paymentScenarios.approve|declined|network|… → envelope
//   성공 data: paymentId, orderId, orderNo, amount, paymentStatus=APPROVED, paidAt
//   실패 data: paymentStatus=FAILED, reason
// store: orderSession.payment / paymentError · cart는 실패 시 보존
// 표: public/mocks/README.md §1~2
//
// Props/상태 후보: methods, selectedMethodId, isPaying, onPay
// 금지: 메뉴 JSON 목업으로 결제 흉내, 중복 결제 허용
import Header from "@/components/common/Header";
import cardIcon from "@/assets/figma/icon-kiosk-card.svg";
import kakaoPayLogo from "@/assets/figma/logo-kakaopay.png";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { calculateCartTotal, priceCalculation } from "@/utils/priceCalculation";
import { getCartTotalQuantity } from "@/utils/quantityLimits";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/common/Footer";
import { createOrder } from "@/api/order";
import Modal from "@/components/common/Modal";
import failIcon from "@/assets/modal_icon/order_fail.svg";



const METHODS = [
  {
    id: "card",
    icon: cardIcon,
    title: "카드/삼성페이 결제",
    description: "신용·체크카드",
    tone: "payment-page__method-icon--card",
  },
  {
    id: "kakao",
    icon: kakaoPayLogo,
    title: "카카오페이 결제",
    description: "모바일 간편결제",
    tone: "payment-page__method-icon--kakao",
  },
];

export default function PaymentPage() {
  // 페이지 이동
  const navigate = useNavigate();
  const handleGoCart = () => {
    navigate("/cart");
  }

  //결제 수단 클릭시 -> 해당 타입 console로 띄우기 (추후 백단으로 해당 타입 전달해주면 됨)
  const [selectedMethodId, setSelectedMethodId] = useState(null);

  // api-005 연결(주문생성)
  const orderType = useCartStore((state)=>state.orderType);
  const items = useCartStore((state)=>state.items);
  const setOrder = useCartStore((state)=>state.setOrder);

  const [isSubmitting, setIsSubmitting ] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const handleGoPayConfirm = async () => {

    if(!selectedMethodId || !orderType || items.length === 0 || isSubmitting){
      return;
    }

    const requestItems = items.map((item)=>({
      menuId : item.menuId,
      quantity: item.quantity,
      optionItems : (item.optionItems ?? []).map((option) => ({
        optionItemId: option.optionItemId,
        quantity : option.quantity ?? 1,
      })),
      excludedIngredientIds: item.excludedIngredientIds ?? [],
    }));

    try{
      setIsSubmitting(true)
      setOrderError(null)

      const result = await createOrder({
        orderType,
        items : requestItems,
      })

      //백엔드 api-005 응답 확인
      // console.log("[api-005 응답] : " ,result);

      setOrder(result);

      //zustand에 실제로 저장된 값 확인
      // console.log("[zustand order]", 
      //   structuredClone(useCartStore.getState().order),
      // );

      navigate("/paymentProcessing");
    }catch(error){
      setOrderError(error);
      console.error("주문 생성 실패 :", error);
    }finally{
      setIsSubmitting(false);
    }
  }

  // api-005의 에러 상태
  const errorCode =
    orderError?.code ??
    orderError?.response?.data?.code;

  const isSoldOutError = errorCode === "MENU_SOLD_OUT";

  const errorTitle = isSoldOutError
    ? "품절된 메뉴가 있습니다"
    : "주문을 생성할 수 없습니다";

  const errorMessage = isSoldOutError
    ? "장바구니에서 품절된 메뉴를 확인해주세요."
    : "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

  const handleMethodSelect = (methodId) => {
    setSelectedMethodId(methodId);

    console.log("선택한 결제수단:", methodId);
  };

  //클릭시 아코디언 애니메이션
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const itemCount = getCartTotalQuantity(items);

  // api-004로부터 검증받은 db의 totalAmount(총가격) & items
  const validatedTotalAmount  = useCartStore((state) => state.validatedTotalAmount);

  const expectedTotalAmount = calculateCartTotal(items);
  const totalAmount = validatedTotalAmount ?? expectedTotalAmount;

  const validatedItems = useCartStore((state) => state.validatedItems);


  return (
    <>
      {orderError && (
        <Modal
          icon={failIcon}
          modal_title={errorTitle}
          modal_content={errorMessage}
          leftText="닫기"
          rightText={isSoldOutError ? "장바구니 확인" : null}
          onLeftClick={() => setOrderError(null)}
          onRightClick={() => {
            setOrderError(null);
            navigate("/cart");
          }}
        />
      )}
      <Header />
      {/* 스텝퍼 */}
      <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제">
        <span className="is-done" />
        <span className="is-current" />
        <span />
        <span />
      </div>
      <main className="payment-page__content">
        <section className="payment-page__hero">
          <span>총 결제금액</span>
          <strong>{formatCurrency(totalAmount)}</strong>
          <p>
            결제 수단을 선택해주세요
          </p>
        </section>

        <div className="payment-page__methods" aria-label="결제 수단">
          {METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              className={
                selectedMethodId === method.id ? "is-selected" : ""
              }
              onClick={() => {
                handleMethodSelect(method.id);
              }}
            >
              <img
                className={`payment-page__method-icon ${method.tone}`}
                alt=""
                src={method.icon}
              />
              <span>
                <strong>{method.title}</strong>
                <small>{method.description}</small>
              </span>
            </button>
          ))}
        </div>

        {/* 주문정보 보기 아코디언 */}
        <section className="payment-page__summary " aria-label="주문 정보">
          {/* is-expanded 이 클래스  summary-head > icon 위로 애니메이션 */}
          <button
            type="button"
            className="payment-page__summary-head"
            onClick={() => setIsSummaryOpen((prev) => !prev)}
          >
            <strong>주문정보 확인</strong>
            <span className="payment-page__summary-meta">
              {itemCount}개 메뉴 / 총 {formatCurrency(totalAmount)}
              <i
                className={`payment-page__summary-chevron ${isSummaryOpen ? "is-expanded" : ""}`}
                aria-hidden="true"
              />
            </span>
          </button>

          {/* 아코디언 메뉴 리스트 */}
          <div
            className={`payment-page__summary-body ${isSummaryOpen ? "is-open" : ""
              }`}
          >
            {items.map((item) => {
              const validatedItem = validatedItems?.find(
                (serverItem) =>
                  serverItem.clientCartItemId === item.cartItemId,
              );

              const itemTotalAmount = validatedItem
                ? validatedItem.unitPrice * validatedItem.quantity
                : priceCalculation({
                    unitPrice: item.unitPrice,
                    optionItems: item.optionItems,
                    quantity: item.quantity,
                  });

              return (
                <div
                  key={item.cartItemId}
                  className="payment_page__summary_item"
                >
                  <div className="payment_page__summary_left">
                    <span className="payment_page__summary_name">{item.menuName}</span>

                    {item.optionItems?.length > 0 && (
                      <span className="payment_page__summary_option">
                        {item.optionItems
                          .map((option) => option.name)
                          .join(", ")}
                      </span>
                    )}
                  </div>
                  <div className="payment_page__summary_right">
                    <span>x{item.quantity}</span>
                    <span>{formatCurrency(itemTotalAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* 결제하기 하단  */}
      <Footer
        leftText="뒤로가기"
        rightText="결제하기"
        onLeftClick={handleGoCart}
        onRightClick={handleGoPayConfirm} />

    </>
  );
}
