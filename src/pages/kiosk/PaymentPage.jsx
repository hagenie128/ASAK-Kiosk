// SCR-007 / Payment — Figma 134:7861
// UI 뼈대: 결제수단 카드 selected/disabled · BottomCTA · 로딩/오류 레이아웃
// 연결 예정: 결제수단 선택 저장 · payment API · 중복 결제 방지
// 금지: 메뉴/주문 JSON 목업, 화면 전체 자동생성 React
import Header from "@/components/kiosk/Header";
import cardIcon from "@/assets/figma/icon-kiosk-card.svg";
import kakaoPayLogo from "@/assets/figma/logo-kakaopay.png";
import paymentIllustration from "@/assets/figma/payment-processing-illustration.png";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { calculateCartTotal, priceCalculation } from "@/utils/priceCalculation";
import { getCartTotalQuantity } from "@/utils/quantityLimits";
import { useState } from "react";



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
  const loading = false;
  const networkError = false;
  const canPay = Boolean(selectedMethodId) && items.length > 0 && !processing;

  if (loading) {
    return (
      <div className="payment-page">
        <Header />
        {/* 스텝퍼 */}
        <div className="kiosk-step-indicator" aria-label="주문 3단계 중 결제">
          <span className="is-current" />
          <span className="is-current" />
          <span className="is-done" />
        </div>

        <main className="payment-page__content payment-page__content--loading">
          <p className="payment-page__loading">결제 수단을 불러오는 중…</p>
        </main>
        <footer className="payment-page__footer">
          <button type="button" disabled>
            뒤로가기
          </button>
          <button type="button" disabled className="is-primary">
            결제하기
          </button>
        </footer>
      </div>
    );
  }

  if (networkError) {
    return (
      <div className="payment-page">
        <Header />
        {/* 스텝퍼 */}
        <div className="kiosk-step-indicator" aria-label="주문 3단계 중 결제">
          <span className="is-current" />
          <span className="is-current" />
          <span className="is-done" />
        </div>
        <main className="payment-page__content payment-page__content--error">
          <section className="payment-page__error-panel" role="alert">
            <h2>결제 수단을 불러오지 못했습니다</h2>
            <p>
              네트워크 연결을 확인한 뒤
              <br />
              다시 시도해 주세요.
            </p>
            <button type="button" disabled className="is-primary">
              다시 시도
            </button>
          </section>
        </main>
        <footer className="payment-page__footer">
          <button type="button" disabled>
            뒤로가기
          </button>
          <button type="button" disabled className="is-primary">
            결제하기
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className={`payment-page${processing ? " is-processing" : ""}`}>
      <Header />
      {/* 스텝퍼 */}
      <div className="kiosk-step-indicator" aria-label="주문 3단계 중 결제">
        <span className="is-current" />
        <span className="is-current" />
        <span className="is-done" />
      </div>
      <main className="payment-page__content">
        <section className="payment-page__hero">
          <span>총 결제금액</span>
          <strong>{formatCurrency(totalPrice)}</strong>
          <p>
            {processing ? (
              <>
                승인 요청중입니다
                <br />
                잠시만 기다려 주세요
              </>
            ) : (
              "결제 수단을 선택해주세요"
            )}
          </p>
        </section>

        {processing ? (
          <div className="payment-page__illustration" aria-hidden="true">
            <img src={paymentIllustration} alt="" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
      <footer className="payment-page__footer">
        <button type="button">
          뒤로가기
        </button>
        <button
          type="button"
          className={`is-primary${canPay ? " is-ready" : ""}`}
        >
          결제하기
        </button>
      </footer>
    </div>
  );
}
