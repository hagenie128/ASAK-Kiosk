// SCR-007 / Payment — Figma 134:7861 (WBS2-026~027)
// Props/상태 후보: methods, selectedMethodId, isPaying, onPay
import Header from "@/components/common/Header";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { calculateCartTotal, priceCalculation } from "@/utils/priceCalculation";
import { getCartTotalQuantity } from "@/utils/quantityLimits";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/common/Footer";
import { getPaymenMethods } from "@/api/paymentList";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import failIcon from "@/assets/modal_icon/payment_fail_img.svg";


export default function PaymentPage() {
  // 페이지 이동
  const navigate = useNavigate();
  const handleGoCart = () => {
    navigate("/cart");
  }

  //결제 수단 클릭시 "선택 상태"
  const [selectedMethod, setSelectedMethod] = useState(null);

  const [validationModal , setValidationModal ] = useState(null);

  // api-014 결제수단 조회 연결
  const [paymentMethod , setPaymentMethod] = useState([]);
  const [isPaymentMethodLoading, setIsPaymentMethodLoading] = useState(true);
  const [paymentMethodError, setPaymentMethodError] = useState(null);


  useEffect(()=> {

    const fetchPaymentMethods = async () =>{

      try{

        setIsPaymentMethodLoading(true);
        setPaymentMethodError(null);

        const methodData = await getPaymenMethods();
        setPaymentMethod(methodData.methods);

      }catch(error){
        setPaymentMethodError(error);

      }finally{
        setIsPaymentMethodLoading(false);
      }
    };

    fetchPaymentMethods();

  }, [])

  const setSelectedPaymentMethod = useCartStore((state)=>state.setSelectedPaymentMethod,);

  const handleMethodSelect = (method) =>{

    if(!method.active) return;

    setSelectedMethod(method);

  }


  const items = useCartStore((state)=>state.items);

  const handleGoPayConfirm = () => {

    if(!selectedMethod){
      setValidationModal({
        modal_title: "결제 수단을 선택해주세요.",
        modal_content: "결제를 진행할 결제 수단을 선택해주세요.",
        rightText : null,
      })
      return;
    }

    if(items.length === 0){
      setValidationModal({

        modal_title: "장바구니가 비어있습니다.",
        modal_content : "메뉴를 담은 후 결제를 진행 해 주세요.",
        rightText : "장바구니로 이동",
      })
      return;
    }

    setSelectedPaymentMethod({
      methodId: selectedMethod.methodId,
      methodCode: selectedMethod.methodCode,
      methodName: selectedMethod.methodName,
    });

    navigate("/paymentProcessing");
  }




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

      {validationModal && (
        <Modal
          icon={failIcon}
          modal_title={validationModal.modal_title}
          modal_content={validationModal.modal_content}
          leftText="닫기"
          rightText={validationModal.rightText}
          onLeftClick={() => setValidationModal(null)}
          onRightClick={() => {
            setValidationModal(null);
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

      {
        isPaymentMethodLoading ? (
          <LoadingSpinner/>
        ) : paymentMethodError ? (
          <EmptyState/>
        ) : (
          <main className="payment-page__content">
            <section className="payment-page__hero">
              <span>총 결제금액</span>
              <strong>{formatCurrency(totalAmount)}</strong>
              <p>
                결제 수단을 선택해주세요
              </p>
            </section>

            <div className="payment-page__methods" aria-label="결제 수단">
              {paymentMethod.map((method) => (
                <button
                  key={method.methodId}
                  type="button"
                  className={
                    selectedMethod?.methodId === method.methodId ? "is-selected" : ""
                  }
                  onClick={() => {
                    handleMethodSelect(method);
                  }}
                >
                  <img
                    className="payment-page__method-icon"
                    alt=""
                    src={method.imageUrl}
                  />
                  <span>
                    <strong>{method.methodName}</strong>
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

        )
      }


      {/* 결제하기 하단  */}
      <Footer
        leftText="뒤로가기"
        rightText="결제하기"
        onLeftClick={handleGoCart}
        onRightClick={handleGoPayConfirm} />

    </>
  );
}
