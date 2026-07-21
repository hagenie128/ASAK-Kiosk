// 결제 진행하는 페이지

import Header from '@/components/common/Header'
import { formatCurrency } from '@/utils/currency';
import React, { useState } from 'react'
import paymentIllustration from '@/assets/figma/payment-processing-illustration.png'
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { calculateCartTotal } from '@/utils/priceCalculation';
import Modal from '@/components/common/Modal';
import { PAYMENT_MODAL_CONFIG } from '@/utils/paymentModalConfig';

export default function PaymentProcessingPage() {

    //결제 실패 & 성공 분기처리 (팝업 모달의 유무를 위한 변수)
    const [modalType, setModalType] = useState("PROCESSING");
    const [testResult, setTestResult] = useState(true);

    // 페이지 이동
    const navigate = useNavigate();
    const handlerCancellBack = () => {
        navigate(-1)
    }

    // 결제금액 불러오기(화면에 보여지기용으로만, 현재)

    const items = useCartStore(
        (state) => state.items
    );
    const totalPrice = calculateCartTotal(items);

    //모달
    const currentModal = PAYMENT_MODAL_CONFIG[modalType];

    const startPaymentTest = (result) => {
        setTestResult(result);

        // 결제중 모달
        setModalType("PROCESSING");

        setTimeout(() => {
            if (result) {
                setModalType("SUCCESS");
            } else {
                setModalType("FAILED");
            }
        }, 3000);
    };


    return (

        <>
            <Modal
                icon={currentModal.icon}
                modal_title={currentModal.title}
                modal_content={currentModal.content}
                leftText={currentModal.leftText}
                rightText={currentModal.rightText}
                onLeftClick={handleLeftClick}
                onRightClick={handleRightClick}
            />
            <Header></Header>
            {/* 스텝퍼 */}
            <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제">
                <span className="is-current" />
                <span className="is-current" />
                <span className="is-done" />
                <span />
            </div>
            <main className='page_content_emptyArea'>

                <section className="payment-page__hero">
                    <span>총 결제금액</span>
                    <strong>{formatCurrency(totalPrice)}</strong>
                    <p>
                        카드를 투입구에 끝까지 넣어주세요
                    </p>
                </section>
                <div className='payment_page__insert_card'>
                    <img src={paymentIllustration} alt="카드결제아이콘" />
                </div>


            </main>

            <div className='paymentProcess_footer'>
                <button onClick={handlerCancellBack}>취소</button>
            </div>
        </>
    )
}
