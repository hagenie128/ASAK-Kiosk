# 키오스크 결제 연결 계약 초안

> 상태: 백엔드 구현 전. 이 문서는 결제 로직 구현을 승인하지 않습니다.

## 준비 파일

| 경계 | 파일 | 책임 |
| --- | --- | --- |
| 결제 DTO | `types/payment.js` | 서버 필드 이름 보존 |
| 결제 응답 가공 | `adapters/paymentAdapter.js` | 화면 모델 변환 |
| 결제 화면 흐름 | `hooks/usePayment.js` | 선택·진행·성공·실패 상태 조합 |

## 정본 필드

- `totalAmount`
- `approvedAmount`
- `approvedAt`
- `waitingOrderCount`

화면의 정적 값은 추후 동일한 DTO 이름의 mock/API 데이터로 교체한다.
