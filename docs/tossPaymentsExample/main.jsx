import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { QRCodeSVG } from 'qrcode.react';
import './styles.css';

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;
const PUBLIC_ORIGIN = import.meta.env.VITE_PUBLIC_ORIGIN || window.location.origin;
const IS_API_KEY =
  Boolean(CLIENT_KEY?.startsWith('test_ck_')) ||
  Boolean(CLIENT_KEY?.startsWith('live_ck_'));

const paymentMethods = [
  { id: 'tosspay', name: '토스페이', description: '토스 앱으로 빠르게 결제', tossName: '토스페이', color: '#0064ff', mark: 'T' },
  { id: 'naverpay', name: '네이버페이', description: '네이버페이 카드·머니 결제', tossName: '네이버페이', color: '#03c75a', mark: 'N' },
  { id: 'kakaopay', name: '카카오페이', description: '카카오톡으로 간편하게 결제', tossName: '카카오페이', color: '#fee500', mark: 'K' },
];

function ResultPage({ kind }) {
  const params = Object.fromEntries(new URLSearchParams(window.location.search));
  const [state, setState] = useState(kind === 'success' ? 'confirming' : 'failed');
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    if (!params.sessionId) {
      setState('failed');
      setMessage('결제 세션 정보가 없습니다.');
      return;
    }

    if (kind === 'success') {
      fetch(`/api/sessions/${params.sessionId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentKey: params.paymentKey,
          orderId: params.orderId,
          amount: Number(params.amount),
        }),
      })
        .then(async (response) => {
          const result = await response.json();
          if (!response.ok) throw new Error(result.message);
          setState('done');
        })
        .catch((error) => {
          setMessage(error.message);
          setState('failed');
        });
    } else {
      fetch(`/api/sessions/${params.sessionId}/fail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: params.message }),
      });
    }
  }, []);

  return (
    <main className="result_page">
      <section className={`result_card ${state === 'failed' ? 'fail' : 'success'}`}>
        <div className="result_icon">{state === 'done' ? '✓' : state === 'confirming' ? '…' : '!'}</div>
        <p className="eyebrow">SCAC EASY PAY</p>
        <h1>{state === 'done' ? '결제가 완료됐습니다' : state === 'confirming' ? '결제를 승인하고 있습니다' : '결제에 실패했습니다'}</h1>
        <p>{message || params.message || (state === 'done' ? '테스트 결제가 정상적으로 승인됐습니다.' : '잠시만 기다려 주세요.')}</p>
        <a className="primary_button" href="/">새 결제 테스트</a>
      </section>
    </main>
  );
}

function MobilePayPlaceholder() {
  const params = Object.fromEntries(new URLSearchParams(window.location.search));

  return (
    <main className="mobile_page">
      <section className="mobile_card">
        <span className="logo">SCAC</span>
        <p className="eyebrow">NAVER PAY DEMO</p>
        <h1>네이버페이 모바일 결제</h1>
        <p className="mobile_amount">
          {Number(params.amount || 0).toLocaleString('ko-KR')}원
        </p>
        <p className="subcopy">
          QR 연결 테스트가 완료됐습니다. 실제 네이버페이 호출과 결제 결과 전송은
          백엔드 결제 세션 API 구현 후 연결합니다.
        </p>
        <div className="demo_todo">
          <strong>차후 구현</strong>
          <span>결제 세션 조회 → 네이버페이 실행 → 서버 승인</span>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [amount, setAmount] = useState(1000);
  const [selectedId, setSelectedId] = useState('tosspay');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoSessionId, setDemoSessionId] = useState('');
  const [seconds, setSeconds] = useState(180);
  const selectedMethod = paymentMethods.find((method) => method.id === selectedId) || paymentMethods[0];

  React.useEffect(() => {
    if (!demoSessionId) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setDemoSessionId('');
          return 180;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [demoSessionId]);

  const handlePayment = async () => {
    if (selectedMethod.id === 'naverpay') {
      setError('');
      setSeconds(180);
      setDemoSessionId(`DEMO-${Date.now()}`);
      return;
    }

    if (!IS_API_KEY) {
      setError('test_ck_로 시작하는 API 개별 연동 테스트 클라이언트 키가 필요합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const sessionResponse = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), method: selectedMethod.id }),
      });
      const session = await sessionResponse.json();
      if (!sessionResponse.ok) throw new Error(session.message);

      const tossPayments = await loadTossPayments(CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: Number(amount) },
        orderId: session.orderId,
        orderName: `SCAC ${selectedMethod.name} 테스트`,
        successUrl: `${window.location.origin}/success?sessionId=${session.id}`,
        failUrl: `${window.location.origin}/fail?sessionId=${session.id}`,
        card: {
          useEscrow: false,
          flowMode: 'DIRECT',
          easyPay: selectedMethod.tossName,
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (paymentError) {
      setError(paymentError.message || '간편결제창을 열지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (demoSessionId) {
    const mobilePayUrl =
      `${PUBLIC_ORIGIN}/mobile-pay?sessionId=${encodeURIComponent(demoSessionId)}` +
      `&method=naverpay&amount=${encodeURIComponent(amount)}`;

    return (
      <main className="kiosk">
        <header className="topbar">
          <span className="logo">SCAC</span>
          <span>네이버페이 QR 샘플</span>
        </header>
        <section className="qr_stage">
          <div className="step_badge">샘플</div>
          <p className="eyebrow">NAVER PAY MOBILE</p>
          <h1>휴대전화로 QR을<br />스캔해 주세요</h1>
          <p className="subcopy">
            차후 백엔드 결제 세션과 네이버페이 모바일 결제를 연결할 화면입니다.
          </p>
          <div className="qr_shell">
            <QRCodeSVG value={mobilePayUrl} size={266} level="H" marginSize={1} />
            <div className="qr_brand naver">N</div>
          </div>
          <div className="timer">
            남은 시간
            <strong>
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </strong>
          </div>
          <div className="amount_line">
            <span>결제 금액</span>
            <strong>{Number(amount).toLocaleString('ko-KR')}원</strong>
          </div>
          <p className="demo_notice">
            현재는 QR 및 모바일 화면 확인용 샘플이며 실제 결제는 발생하지 않습니다.
          </p>
          <button
            className="secondary_button qr_back_button"
            onClick={() => setDemoSessionId('')}
          >
            결제수단 선택으로 돌아가기
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="kiosk">
      <header className="topbar">
        <span className="logo">SCAC</span>
        <span>키오스크 간편결제</span>
      </header>

      <section className="direct_checkout">
        <div className="payment_picker">
          <p className="eyebrow">EASY PAYMENT</p>
          <h1>결제 방법을<br />선택해 주세요</h1>
          <p className="subcopy">선택한 간편결제의 공식 결제창과 QR이 열립니다.</p>

          <div className="large_method_grid">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`large_method_button ${selectedId === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(method.id)}
              >
                <span className="large_method_icon" style={{ background: method.color }}>{method.mark}</span>
                <span className="large_method_text">
                  <strong>{method.name}</strong>
                  <small>{method.description}</small>
                </span>
                <span className="method_check">{selectedId === method.id ? '✓' : ''}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="order_panel">
          <p className="eyebrow">TEST ORDER</p>
          <h2>키오스크 테스트 주문</h2>
          <label htmlFor="amount">결제 금액</label>
          <div className="amount_input">
            <input id="amount" type="number" min="100" step="100" value={amount} onChange={(event) => setAmount(event.target.value)} />
            <span>원</span>
          </div>
          <div className="summary">
            <span>선택한 결제수단</span>
            <strong>{selectedMethod.name}</strong>
          </div>
          <button className="primary_button full kiosk_pay_button" onClick={handlePayment} disabled={isLoading || !amount || Number(amount) < 100}>
            {isLoading ? '결제창 여는 중…' : `${Number(amount).toLocaleString('ko-KR')}원 결제하기`}
          </button>
          <div className={`status ${IS_API_KEY ? 'ready' : ''}`}>
            <span />
            {IS_API_KEY ? 'API 개별 연동 테스트 키 연결됨' : 'API 개별 연동 테스트 키 설정 필요'}
          </div>
          {error && <p className="error_message">{error}</p>}
        </aside>
      </section>
    </main>
  );
}

const path = window.location.pathname;
const page =
  path === '/mobile-pay' ? (
    <MobilePayPlaceholder />
  ) : path === '/success' ? (
    <ResultPage kind="success" />
  ) : path === '/fail' ? (
    <ResultPage kind="fail" />
  ) : (
    <App />
  );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{page}</React.StrictMode>,
);
