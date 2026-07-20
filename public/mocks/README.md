# 키오스크 Mock — 남은 구현용 필드/props

> Home→Menu→Detail→Cart 는 이미 mock 동작 중이라 **여기 생략**.  
> 이 문서는 **Payment → Complete / Error / Timeout** 연결할 때만 본다.  
> 원본: `kiosk.json` · 정본 계획: `IMPLEMENTATION_PLAN.md` §0~3

공통 Envelope: `{ success, status, code, message, data }`

---

## 남은 작업 ↔ mock 키

| WBS | 화면/훅 | Getter·경로 | 꺼내는 것 |
|-----|---------|-------------|-----------|
| WBS2-026 | `PaymentPage` | `paymentMethods.data[]` | 수단 목록·활성 |
| WBS2-026~027 | `usePayment` / `api/payment` | `paymentScenarios.*` | 승인/실패 envelope |
| WBS2-028 | `OrderCompletePage` | 결제 성공 `data` + `orderCompleteSamples` | `orderNo`, 금액, 대기 |
| WBS2-027 | `PaymentErrorPage` | 실패 `data` + store `paymentError` | code/message/reason |
| WBS2-029~030 | `useKioskTimeout` / `TimeoutPage` | (타이머) + 세션 reset | PROCESSING 중 정지 |
| WBS2-024 | `KioskToast` | `quantityLimits` reason | 4초 토스트 |

시나리오 키 (`scenarios.payment` / `paymentScenarios`):  
`approve` · `approveHigh` · `declined` · `insufficient` · `network` · `timeout` · `duplicate` · `methodDisabled`

---

## 1) 결제수단 — `paymentMethods.data[]`

| 필드 | 타입 | 화면 |
|------|------|------|
| `methodId` | string | 선택값 · store `payment.paymentMethod` 매핑 (`card`→`CARD` 등) |
| `name` | string | 카드 제목 |
| `description` | string | 부제 |
| `isActive` | boolean | false면 선택 불가 |
| `isMaintenance` | boolean | 점검 표시 |
| `sortOrder` | number | 정렬 |

`PaymentPage` 현재는 로컬 `METHODS` 상수 → **이 배열로 교체**가 남은 일.

---

## 2) 결제 시나리오 — `paymentScenarios.<key>`

### 성공 (`approve` / `approveHigh`) → `/complete`

| `data` 필드 | 타입 | 쓰임 |
|-------------|------|------|
| `paymentId` | number | store `payment.paymentId` |
| `orderId` | number | store |
| `orderNo` | string | **완료 화면 주문번호** |
| `amount` | number | 승인 금액 (정본 목표명 `approvedAmount`) |
| `paymentStatus` | `"APPROVED"` | 성공 분기 · cart 초기화 |
| `paidAt` | string | ISO |

### 실패 (그 외) → `/payment-error` · **cart 보존**

| `data` 필드 | 타입 |
|-------------|------|
| `paymentStatus` | `"FAILED"` |
| `reason` | `DECLINED` \| `INSUFFICIENT` \| `NETWORK` \| `TIMEOUT` \| `DUPLICATE` \| `METHOD_DISABLED` |

Envelope의 `code` / `message` → `orderSessionStore.paymentError`.

---

## 3) 완료 샘플 — `orderCompleteSamples[]`

결제 mock에 대기 건수가 없을 때 화면 채우기용.

| 필드 | 타입 | 화면 |
|------|------|------|
| `orderNo` | string | 주문번호 (props `orderNumber`) |
| `totalPrice` | number | 금액 표시 (정본 `totalAmount`) |
| `waitingCount` | number | 대기 건수 (정본 `waitingOrderCount`) |
| `orderType` | `EAT_IN` \| `TAKE_OUT` | 선택 표시 |

`OrderCompletePage` props 지금: `orderNumber`, `toastMessage`, `toastTone`  
**추가 연결 후보:** `totalPrice`/`totalAmount`, `waitingOrderCount`, 홈 복귀 초.

---

## 4) 세션 store (결제 연결 시)

`orderSessionStore` — 이미 있는 자리:

```text
order:   orderId, orderNo, orderType, totalPrice, orderStatus, paymentStatus
payment: paymentMethod, paymentId, orderId, orderNo, amount, paymentStatus, paidAt
paymentError: { code?, message?, reason? }   // SCR-012
items[]: 실패 시 유지 / APPROVED 시 clearItems·resetSession
```

전이: `APPROVED` → complete + reset · `FAILED` → error + cart 유지 · timeout 확인 → reset  
(`features/order/orderFlow.js`의 `shouldResetOrderSession`)

---

## 5) 화면별 props 후보 (남은 연결)

| 파일 | props / 상태 |
|------|----------------|
| `PaymentPage` | `methods[]`, `selectedMethodId`, `isPaying`, `totalPrice`, `onPay` |
| `OrderCompletePage` | `orderNumber`, `totalAmount?`, `waitingOrderCount?`, `returnInSec?` |
| `PaymentErrorPage` | `title`, `lines`, `code?`, `onRetry`, `onBackToCart` |
| `TimeoutPage` | `title`, `lines`, `countdownSec?`, `onExtend`, `onReset` |
| `usePayment` | approve + scenario key + 중복 방지 lock |
| `useKioskTimeout` | `idleMs`, `enabled` (!processing), `onTimeout` |
| `KioskToast` | `message`, `tone` — 수량 한도 4초 (WBS2-024) |

메뉴/장바구니 JSON 필드는 기존 코드·`priceCalculation`/`quantityLimits`를 따르면 된다.
