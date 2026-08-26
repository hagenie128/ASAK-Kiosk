// 결제 진행 페이지

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
    ANONYMOUS,
    loadTossPayments,
} from "@tosspayments/tosspayments-sdk";

import Header from "@/components/common/Header";
import Modal from "@/components/common/Modal";
import paymentIllustration from "@/assets/figma/payment-processing-illustration.png";
import { approvePayment } from "@/api/payment";
import { TOSS_EASY_PAY_CODE } from "@/constants/tossPayment";
import { createOrderForPayment } from "@/features/order/orderFlow";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { PAYMENT_MODAL_CONFIG } from "@/utils/paymentModalConfig";
import { calculateCartTotal } from "@/utils/priceCalculation";

const CARD_METHOD_CODE = "CARD";

export default function PaymentProcessingPage() {
    const navigate = useNavigate();

    const [modalType, setModalType] = useState("PROCESSING");
    const [serverAmount, setServerAmount] = useState(null);

    // Effect 재실행으로 주문/결제가 중복 실행되는 것을 막는다.
    const hasStartedRef = useRef(false);
    // 취소 시 열려 있는 토스 결제창을 닫기 위한 SDK 인스턴스다.
    const paymentInstanceRef = useRef(null);
    // 같은 API-006 시도에는 같은 멱등키를 사용한다.
    const idempotencyKeyRef = useRef(uuidv4());

    const items = useCartStore((state) => state.items);
    const orderType = useCartStore((state) => state.orderType);
    const storedOrder = useCartStore((state) => state.order);
    const selectedPaymentMethod = useCartStore(
        (state) => state.selectedPaymentMethod,
    );
    const paymentError = useCartStore((state) => state.paymentError);

    const setOrder = useCartStore((state) => state.setOrder);
    const setPayment = useCartStore((state) => state.setPayment);
    const setPaymentError = useCartStore((state) => state.setPaymentError);

    const displayAmount = serverAmount ?? calculateCartTotal(items);

    useEffect(() => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        const processPayment = async () => {
            if (
                !orderType ||
                items.length === 0 ||
                !selectedPaymentMethod?.methodCode
            ) {
                setPaymentError({
                    code: "INVALID_PAYMENT_REQUEST",
                    message: "주문 또는 결제수단 정보가 없습니다.",
                });
                setModalType("FAILED");
                return;
            }

            try {
                setModalType("PROCESSING");

                // 결제 실패 후 재진입했다면 아직 READY인 기존 주문을 재사용
                let order = storedOrder;

                if (!order?.orderId || order.orderStatus !== "READY") {
                    order = await createOrderForPayment({ orderType, items });
                    setOrder(order);
                }

                setServerAmount(order.totalAmount);

                const methodCode = selectedPaymentMethod.methodCode;
                const easyPayCode = TOSS_EASY_PAY_CODE[methodCode];

                if (!easyPayCode && methodCode !== CARD_METHOD_CODE) {
                    throw Object.assign(
                        new Error("지원하지 않는 결제수단입니다."),
                        { code: "UNSUPPORTED_PAYMENT_METHOD" },
                    );
                }

                // 모든 결제수단이 공통으로 API-006에 보내는 데이터
                const approvalRequest = {
                    orderId: order.orderId,
                    orderStatus: "RECEIVED",
                    paymentMethodCode: methodCode,
                    idempotencyKey: idempotencyKeyRef.current,
                };

                // 토스 간편결제만 SDK 인증 결과를 API-006 요청에 추가
                if (easyPayCode) {
                    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

                    if (!clientKey) {
                        throw Object.assign(
                            new Error("토스페이먼츠 클라이언트 키가 없습니다."),
                            { code: "TOSS_CLIENT_KEY_MISSING" },
                        );
                    }

                    const tossPayments = await loadTossPayments(clientKey);
                    const payment = tossPayments.payment({ customerKey: ANONYMOUS });
                    paymentInstanceRef.current = payment;

                    // PC 키오스크 Promise 방식: 별도의 successUrl/failUrl을 사용하지 않음
                    const tossResult = await payment.requestPayment({
                        method: "CARD",
                        amount: {
                            currency: "KRW",
                            value: order.totalAmount,
                        },
                        orderId: order.orderNo,
                        orderName: order.orderName ?? "ASAK 키오스크 주문",
                        windowTarget: "iframe",
                        card: {
                            useEscrow: false,
                            flowMode: "DIRECT",
                            easyPay: easyPayCode,
                            useCardPoint: false,
                            useAppCardOnly: false,
                        },
                    });

                    // 프론트 1차 검증이며 백엔드에서도 DB 값을 기준으로 다시 검증
                    if (tossResult.orderId !== order.orderNo) {
                        throw Object.assign(
                            new Error("결제 주문번호가 일치하지 않습니다."),
                            { code: "PAYMENT_ORDER_MISMATCH" },
                        );
                    }

                    if (tossResult.amount.value !== order.totalAmount) {
                        throw Object.assign(
                            new Error("결제 금액이 일치하지 않습니다."),
                            { code: "PAYMENT_AMOUNT_MISMATCH" },
                        );
                    }

                    approvalRequest.tossPayment = {
                        paymentKey: tossResult.paymentKey,
                        orderId: tossResult.orderId,
                        amount: tossResult.amount.value,
                    };
                }

                // CARD는 기존 요청으로, 간편결제는 tossPayment를 포함해 API-006을 호출
                const approvedPayment = await approvePayment(approvalRequest);

                if (approvedPayment.paymentStatus !== "APPROVED") {
                    throw Object.assign(
                        new Error("결제가 승인되지 않았습니다."),
                        { code: "PAYMENT_NOT_APPROVED" },
                    );
                }

                setPayment(approvedPayment);
                setModalType("SUCCESS");
            } catch (error) {
                console.error("결제 처리 실패:", error);

                const responseBody = error.response?.data;
                setPaymentError({
                    code:
                        responseBody?.code ??
                        error.code ??
                        "PAYMENT_PROCESS_FAILED",
                    message:
                        responseBody?.message ??
                        error.message ??
                        "결제 처리 중 오류가 발생했습니다.",
                });
                setModalType("FAILED");
            }
        };

        processPayment();
    }, []);

    const currentModal =
        PAYMENT_MODAL_CONFIG[modalType] ?? PAYMENT_MODAL_CONFIG.FAILED;

    const modalContent =
        modalType === "FAILED"
            ? paymentError?.message ?? currentModal.content
            : currentModal.content;

    const handleLeftClick = async () => {
        if (modalType === "PROCESSING") {
            try {
                await paymentInstanceRef.current?.destroy();
            } catch {
                // 활성화된 토스 결제창이 없으면 결제수단 화면으로 이동
            }
        }

        navigate("/payment");
    };

    //결제 완료시, 팝업 타임아웃
    useEffect(()=>{

        if(modalType !== "SUCCESS") return;

        const timer = setTimeout(()=>{
            navigate("/complete");
        }, 2000);

        return () => clearTimeout(timer);

    }, [modalType, navigate]);

    const handleRightClick = () => {
        if (modalType === "SUCCESS") {
            navigate("/complete");
            return;
        }

        if (modalType === "FAILED") {
            navigate("/payment");
        }
    };

    const isEasyPay = Boolean(
        TOSS_EASY_PAY_CODE[selectedPaymentMethod?.methodCode],
    );

    return (
        <div className="paymentProcessing_page">
            <Modal
                icon={currentModal.icon}
                modal_title={currentModal.title}
                modal_content={modalContent}
                leftText={currentModal.leftText}
                rightText={currentModal.rightText}
                onLeftClick={handleLeftClick}
                onRightClick={handleRightClick}
            />

            <Header />

            <div
                className="kiosk-step-indicator"
                aria-label="주문 4단계 중 결제"
            >
                <span className="is-done" />
                <span className="is-done" />
                <span className="is-current" />
                <span />
            </div>

            <main className="page_content_emptyArea">
                <section className="payment-page__hero">
                    <span>총 결제금액</span>
                    <strong>{formatCurrency(displayAmount)}</strong>
                    <p>
                        {isEasyPay
                            ? `${selectedPaymentMethod.methodName} 결제를 진행해 주세요`
                            : "카드를 투입구에 끝까지 넣어주세요"}
                    </p>
                </section>

                <div className="payment_page__insert_card">
                    <img src={paymentIllustration} alt="결제 진행 안내" />
                </div>
            </main>

            <div className="paymentProcess_footer">
                <button type="button" onClick={handleLeftClick}>
                    취소
                </button>
            </div>
        </div>
    );
}
