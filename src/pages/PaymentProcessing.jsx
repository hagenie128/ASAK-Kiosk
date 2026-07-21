// 결제 진행하는 페이지

import Header from '@/components/common/Header'
import { useOrderStore } from '@/store/orderStore'
import { formatCurrency } from '@/utils/currency';
import React from 'react'

export default function PaymentProcessing() {

    //결제 실패 & 성공 분기처리 (추후 필요시 추가 예정)
    // const [paymentStatus, setPaymentStatus] = useState("processing");

    const totalPrice = useOrderStore((state) => state.order.totalPrice);



    return (

        <>
            <Header></Header>
            {/* 스텝퍼 */}
            <div className="kiosk-step-indicator" aria-label="주문 4단계 중 결제">
                <span className="is-current" />
                <span className="is-current" />
                <span className="is-done" />
                <span />
            </div>
            <main className='page_content'>

                <section className="payment-page__hero">
                    <span>총 결제금액</span>
                    <strong>{formatCurrency(totalPrice)}</strong>
                    <p>
                        카드를 투입구에 끝까지 넣어주세요
                    </p>
                </section>



            </main>
            <div className='footer_design'>
                <button>취소</button>
            </div>
        </>
    )
}
