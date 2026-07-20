# 요구사항 → 화면 → 데이터 맵

| 사용자 기능 | 화면 | 필요한 데이터 | 우선순위 |
| --- | --- | --- | --- |
| 주문유형 선택 | `HomePage` | `orderType` | MVP |
| 카테고리·메뉴 조회 | `MenuListPage` | category, menu card, 품절 뱃지 | MVP |
| 메뉴 옵션·재료 제외 | `MenuDetailPage` | ingredients, allergens, option groups, 추천·품절 상태 | MVP |
| 장바구니 수량·삭제 | `CartPage` | cart items, options, exclusions, totalPrice | MVP |
| 가상 결제·실패 안내 | `PaymentPage` | orderId, paymentMethod, amount, error code | MVP |
| 주문번호·영수증 | `OrderCompletePage` | orderNo, paidAt, paymentStatus | MVP/확장 |
| 관리자 주문·상태 변경 | `OrderListPage`, `OrderDetailPage` | order list, item/options/exclusions, orderStatus | MVP 이후 |
| 판매 항목 품절 | `SoldOutManagePage` | target type/id, isSoldOut, reason | 옵션 |
| 메뉴·결제수단·매출 | 관리자 관리 화면 | menu form, payment methods, daily sales | 확장 |
| 접근성·QR·멤버십 | 확장 화면 | fontScale/highContrast, scan code, stamps | 확장 |

중복 요구사항은 구현하지 않는다. 예를 들어 `FWD-CART-003`은 제외된 중복 항목이므로 `FWD-CART-002`만 구현·테스트 기준으로 사용한다.

## Canonical contract relationship

- Status: Needs Review — current Frontend screen expectation map.
- Canonical Screen/API decisions: [ASAK docs](../../../ASAK/docs/README.md) and [Canonical Contract Decisions](../../../ASAK/docs/governance/canonical-contract-decisions-2026-07-16.md).
- Current Admin references in this Kiosk contract are Legacy Reference; administrator implementation is canonical in ASAK-Admin.
- Actual implementation requires Screen Registry/route confirmation before code changes.
