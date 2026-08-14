# 키오스크 Mock — 결제·오류 시나리오 참고

> Status: **REFERENCE**
> 현재 실행 화면은 이 폴더 JSON을 자동으로 읽지 않습니다. Menu·Cart·주문 생성은 실 API를 사용합니다.

## 유지 파일

| 파일 | 역할 |
|---|---|
| `payment-scenarios.sample.json` | 결제수단·승인/실패·완료 예시(약 5KB) |
| `README.md` | 필드·시나리오 계약 참고 |

전체 대용량 목업(`kiosk.json` 등)은 `ASAK/asak-data/archive/frontend-mocks/`로 옮겼습니다.

## 남은 작업 ↔ 샘플 키

| WBS | API | 화면/훅 | 꺼내는 것 |
|-----|-----|---------|-----------|
| WBS2-026 | API-014 | `PaymentPage` | `paymentMethods.data[]` |
| WBS2-026~027 | API-006 | `usePayment` / `api/payment` | `paymentScenarios.*` |
| WBS2-028 | — | `OrderCompletePage` | `orderCompleteSamples` |
| WBS2-027 | — | `PaymentProcessingPage` 오류 모달 | `errorSamples` / store `paymentError` |

시나리오 키: `approve` · `approveHigh` · `declined` · `insufficient` · `network` · `timeout` · `duplicate` · `methodDisabled`

공통 Envelope: `{ success, status, code, message, data }`

`PaymentPage` 현재는 로컬 `METHODS` 상수와 주문 생성(API-005)만 실연동합니다. API-014·API-006 화면 연결 전 참고용으로만 샘플 JSON을 씁니다.

> ⚠️ 계약 불일치: 백엔드 API-006은 `POST /api/kiosk/payments`이지만 현재 `src/constants/api.js`의 `payments` 값은 `/payments`입니다. 화면 연결 전에 상수를 수정하고 API 계약 테스트를 통과해야 합니다. 별도 `PaymentErrorPage`·`TimeoutPage` 라우트는 없으며, 현재 실패·시간초과 표시는 `PaymentProcessingPage`의 상태/모달 분기입니다.
