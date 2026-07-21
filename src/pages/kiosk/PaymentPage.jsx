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
  const handleGoPayConfirm = () => {
    navigate("/paymentProcessing");
  }

  //결제 수단 클릭시 -> 해당 타입 console로 띄우기 (추후 백단으로 해당 타입 전달해주면 됨)
  const [selectedMethodId, setSelectedMethodId] = useState(null);

  const handleMethodSelect = (methodId) => {
    setSelectedMethodId(methodId);

    console.log("선택한 결제수단:", methodId);
  };

  //클릭시 아코디언 애니메이션
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const totalPrice = calculateCartTotal(items);
  const itemCount = getCartTotalQuantity(items);

  const processing = false;



  return (
    <>
      <Header />
      {/* 스텝퍼 */}
      <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제">
        <span className="is-current" />
        <span className="is-done" />
        <span />
        <span />
      </div>
      <main className="payment-page__content">
        <section className="payment-page__hero">
          <span>총 결제금액</span>
          <strong>{formatCurrency(totalPrice)}</strong>
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
              {itemCount}개 메뉴 / 총 {formatCurrency(totalPrice)}
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
            {items.map((item) => (
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
                  <span>
                    {formatCurrency(
                      priceCalculation({
                        unitPrice: item.unitPrice,
                        optionItems: item.optionItems,
                        quantity: item.quantity,
                      }),
                    )}
                  </span>
                </div>


              </div>
            ))}
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
