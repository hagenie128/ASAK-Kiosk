# 프론트 API 데이터 계약

> 정본: `06 API 명세.md` · API 구현 전 이 문서를 먼저 확인한다. 이 파일은 구현 코드가 아니라 프론트가 **받고 보내야 하는 데이터**를 정리한 학습용 계약이다.

## 공통 응답과 상태값

모든 응답은 `{ success, status, code, message, data }` 형식이다. `success=false`이면 `data`는 `null`이며, 화면은 `code`를 기준으로 안내를 분기한다.

| 값 | 화면 의미 |
| --- | --- |
| 주문 유형 `EAT_IN`, `TAKE_OUT` | 매장 식사, 포장 |
| 주문 상태 `RECEIVED`, `PREPARING`, `COMPLETED` | 접수, 준비중, 완료 |
| 결제 상태 `READY`, `APPROVED`, `FAILED` | 대기, 승인, 실패 |

## MVP 고객 주문 흐름

| API | 요청 → 응답 핵심 데이터 | 연결 파일 | 요구사항 |
| --- | --- | --- | --- |
| `API-001` `GET /api/categories` | `categoryId`, `name`, `sortOrder` | `api/category.js`, `CategoryTabs.jsx`, `useMenu.js` | `FWD-MENU-006` |
| `API-002` `GET /api/menus?categoryId` | `menuId`, `categoryId`, `name`, `price`, `imageUrl`, `baseKcal`, `isSoldOut`, `hasSoldOutIngredient`, `soldOutBadges` | `api/menu.js`, `MenuCard.jsx`, `MenuListPage.jsx` | `FWD-MENU-006`, 품절 표시 |
| `API-003` `GET /api/menus/{menuId}` | 메뉴 기본정보 + `description`, `ingredients[{ingredientId,name,canRemove,isSoldOut}]`, `allergens`, `allergyText`, `isOrderable`, `soldOutReason` | `MenuDetailPage.jsx`, `types/menu.js` | 재료 제외·알레르기·품절 |
| `API-004` `GET /api/menus/{menuId}/options` | `optionGroupId`, `name`, `selectType`, `minSelect`, `maxSelect`, `isRequired`, `items[{optionItemId,ingredientId,name,extraPrice,extraKcal,isSoldOut,isRecommended}]` | `OptionGroup.jsx`, `cartRules.js` | `FWD-MENU-012`, `FWD-MENU-015` |
| `API-005` `POST /api/orders` | 요청: `orderType`, `items[{menuId,quantity,optionItems[{optionItemId,quantity}],excludedIngredientIds}]` → 응답: `orderId`, `orderNo`, `orderStatus`, `totalPrice` | `api/order.js`, `cartStore.js`, `orderFlow.js` | `DEV-ORDER-001`, 장바구니 수량/삭제 |
| `API-006` `POST /api/payments` | 요청: `orderId`, `paymentMethod`, `amount` → 응답: `paymentId`, `orderId`, `orderNo`, `amount`, `paymentStatus`, `paidAt` | `api/payment.js`, `PaymentPage.jsx`, `OrderCompletePage.jsx` | `DEV-PAY-001`, `FWD-PAY-001`, `FWD-PAY-002` |

### 장바구니에서 반드시 보관할 데이터

`cartStore.js`에는 API 응답 전체가 아니라 주문 생성에 필요한 다음 데이터를 저장한다.

```text
orderType
items[]: menuId, menuName, unitPrice, quantity,
         optionItems[]: optionItemId, name, extraPrice, quantity,
         excludedIngredientIds[]
```

총액은 `unitPrice + 선택 옵션 extraPrice`에 수량을 반영해 표시한다. 주문 직전에는 `API-016`(확장) 또는 `API-005` 오류 `MENU_SOLD_OUT`을 처리한다.

## 관리자·품절 데이터

| API | 요청 → 응답 핵심 데이터 | 연결 파일 | 요구사항 |
| --- | --- | --- | --- |
| `API-007` `GET /api/admin/orders?status` | `content[]`의 `orderId`, `orderNo`, `orderType`, `orderStatus`, `paymentStatus`, `totalPrice`, `createdAt`, `items`, `selectedOptions`, `excludedIngredients` | `api/admin.js`, `OrderTable.jsx`, `OrderDetailPage.jsx` | `LMIS-ORDER-001`~`003` |
| `API-008` `PATCH /api/admin/orders/{orderId}/status` | 요청 `orderStatus` → `orderId`, `orderNo`, `orderStatus` | `OrderStatusBadge.jsx` | 주문 상태 변경 |
| `API-009` `PATCH /api/admin/sold-out-items` | 요청 `targetType(MENU/INGREDIENT/OPTION_ITEM)`, `targetId`, `isSoldOut` → `name`, `isSoldOut` | `SoldOutToggle.jsx`, `soldOutPolicy.js` | `LMIS-MENU-001`, `LMIS-MENU-002` |
| `API-010` `GET /api/admin/sold-out-items` | Query `targetType`, `keyword` → `targetType`, `targetId`, `name`, `isSoldOut`, `reasonType` | `SoldOutManagePage.jsx` | 품절 관리 확장 |
| `API-011/012` | 메뉴 목록, 메뉴 등록·수정: `categoryId`, `name`, `price`, `imageUrl`, `optionGroupIds` | `MenuManagePage.jsx`, `MenuEditPage.jsx` | 관리자 메뉴 관리 |
| `API-013/014` | 활성 결제수단, 결제수단 활성·정렬 변경 | `PaymentMethodList.jsx`, `PaymentMethodPage.jsx` | 결제수단 설정 |
| `API-015` | Query `from`, `to` → 일별 매출·메뉴별 판매량 | `SalesSummaryPage.jsx`, `SalesChart.jsx` | 매출 조회 |

## 후반 확장 데이터

| API | 프론트 준비 파일 | 화면 처리 |
| --- | --- | --- |
| `API-016` 장바구니 검증 | `api/order.js`, `cartRules.js` | 품절·필수 옵션·총액 오류 표시 |
| `API-017` 접근성 설정 | `AccessibilityPage.jsx` | `fontScale`, `highContrast` 적용 |
| `API-018` 멤버십 스탬프 | `api/payment.js` | 결제 뒤 `memberId`, `stampCount` 표시 |
| `API-019` 영수증 출력 | `ReceiptActions.jsx` | `orderId`로 출력 요청, 실패 안내 |
| `API-020` QR/바코드 스캔 | `PaymentPage.jsx` | `scanType`, `code` 입력/스캔 결과 반영 |

## 화면 구현 전 확인표

1. 페이지가 필요한 API와 요구사항 ID를 주석으로 적는다.
2. `api/`에는 HTTP 요청만, `components/`에는 표시만 둔다.
3. `pages/`에서 로딩·빈 상태·오류 상태를 모두 연결한다.
4. 품절, 필수 옵션, 결제 실패는 성공 화면으로 이동시키지 않는다.
