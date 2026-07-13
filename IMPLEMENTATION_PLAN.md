# ASAK Mock 기반 React 구현 계획 (7/14~7/22)

> 목적: 자동 생성 코드 없이, 두 사람이 화면·mock 데이터·상태 흐름을 직접 구현한다. 정본은 `06 API 명세`, `02 요구사항 정의`, `04 화면 설계`, `03 사용자 시나리오`이며, 프론트 데이터 계약은 [src/contracts/api-data-contract.md](src/contracts/api-data-contract.md)를 함께 본다.

## 0. 범위와 완료 기준

### 7/22까지 구현할 범위

| 구분 | 화면 | mock 연동 범위 |
| --- | --- | --- |
| 고객 주문 | `SCR-001`, `003`, `004`, `005`, `007`, `008` | 주문유형 → 메뉴·옵션 → 장바구니 → 주문 생성 → 가상 결제 → 주문번호 |
| 오류 예외 | `SCR-012` | 결제 실패 오버레이/토스트, 장바구니 유지 |
| 관리자 핵심 | `SCR-009`, `010`, `011` | 주문 목록/상세/상태 변경, 판매 항목 품절 변경 |
| 관리자 목업 화면 | `SCR-015`~`019` | 로그인 mock, 메뉴 목록·편집, 결제수단, 일별 매출 표시 |

`SCR-002`는 `SCR-001`에, `SCR-006`은 `SCR-005`에 병합됐다. 이 두 ID는 라우트나 페이지 파일을 만들지 않는다. `SCR-012`는 결제 실패용 **오버레이**이며 라우트가 아니다.

### 이번 범위에서 하지 않는 것

- 실제 결제/인증/프린터/QR/멤버십 연동
- 영수증 출력(`API-019`)과 QR·바코드(`API-020`)의 실제 장치 구현
- 실제 서버 호출. 이번 주에는 `public/mocks/` JSON을 API 명세와 같은 형태로 읽는다.

## 1. 공통 합의: 첫날 30분에 확정할 것

| 항목 | 결정 |
| --- | --- |
| 전역 상태 | `zustand`만 사용. `cartStore`에 장바구니, `orderStore`에 주문유형·주문/결제 결과를 둔다. |
| `orderType` 키 | 정확히 `orderType`; 값은 `EAT_IN` 또는 `TAKE_OUT`만 사용한다. |
| API 응답 | 반드시 `{ success, status, code, message, data }` envelope를 유지한다. |
| ID 필드 | `menuId`, `categoryId`, `optionItemId`, `ingredientId`, `orderId`로 통일한다. `optionId` 같은 별칭은 만들지 않는다. |
| mock 원본 | `06 API 명세`의 JSON 예시를 그대로 사용하고, 화면이 필요로 하는 임의 필드를 추가하지 않는다. |
| 금액 | 숫자로 저장하고 표시할 때만 `utils/currency.js`에서 원화 문자열로 바꾼다. |
| 성공 후 초기화 | 결제 `APPROVED` 뒤에만 장바구니와 주문 중간 상태를 비운다. 실패 시 절대 비우지 않는다. |

### store 데이터 경계

```text
cartStore
  items[]: menuId, menuName, unitPrice, quantity,
           optionItems[{ optionItemId, name, extraPrice, quantity }],
           excludedIngredientIds[]

orderStore
  orderType: EAT_IN | TAKE_OUT
  order: { orderId, orderNo, orderStatus, totalPrice }
  payment: { paymentId, paymentStatus, paidAt }
```

## 2. 고객 화면 상세 스펙

### 나연 1차 구현: `SCR-001 → SCR-003 → SCR-004`

| 화면 | 입력 → 출력 | API/상태 | 필수 규칙·테스트 |
| --- | --- | --- | --- |
| `SCR-001` 홈(매장·포장) | 입력 없음 → `orderType` | `orderStore.orderType` | `SCR-002` 병합. 선택값은 `SCR-005`와 `API-005`까지 유지. `TC-001`에서 홈 선택부터 API body까지 확인. |
| `SCR-003` 메뉴 선택 | `orderType`, `categoryId` → 카테고리/메뉴 카드 | `API-001`, `API-002` mock | 카드에 이미지·이름·가격·칼로리·`isSoldOut`·`soldOutBadges` 표시. CORE/BASE 재료 품절은 카드 비활성화, DEFAULT 재료 품절은 뱃지만 표시. |
| `SCR-004` 메뉴 상세/옵션 | `menuId`, 재료·옵션 선택값 → 선택 메뉴·예상금액 | `API-003`, `API-004` mock, `cartStore` | 알레르기·칼로리는 이 화면에 표시. `excludedIngredientIds`와 `optionItems`를 장바구니로 넘김. 품절 옵션은 회색+`SOLD OUT`+선택 불가(`TC-003`). |

### 하진 1차 구현: `SCR-005 → SCR-007 → SCR-008`

| 화면 | 입력 → 출력 | API/상태 | 필수 규칙·테스트 |
| --- | --- | --- | --- |
| `SCR-005` 장바구니·주문확인 | 장바구니, `orderType`, 제외 재료, 옵션, 수량 → 총액·`orderId` | `cartStore`, `API-005` mock | `SCR-006` 병합. 최종 확인은 별도 라우트가 아닌 `ConfirmDialog` 모달. 추가 제안 상품 섹션 포함. `TC-002`: 화면 전환 5회 이하. |
| `SCR-007` 결제 | `orderId`, `paymentMethod`, `amount` → `paymentId`, `paymentStatus`, `orderStatus` | `API-006` mock | 승인 대기 로딩 필수. 실패면 `SCR-012` 오버레이를 띄우고 재결제 또는 `SCR-005` 복귀. 장바구니 유지(`TC-004`). |
| `SCR-008` 주문 완료 | `orderNo`, `paymentStatus`, `totalPrice` → 주문번호·완료 안내 | `orderStore.payment` | 이번 범위에서는 영수증/장치 기능 제외. 메뉴 1개+토핑 1개 주문 후 주문번호 표시가 `TC-001` 완료 기준. |

## 3. 관리자 화면 mock 범위

| 화면 | mock 데이터·API 기준 | 최소 상호작용 | 담당 파일 |
| --- | --- | --- | --- |
| `SCR-009` 주문 목록 | `API-007`: `orderNo`, `orderType`, `orderStatus`, `paymentStatus`, `totalPrice`, `createdAt` | 상태 필터, 행 클릭 | `OrderListPage`, `OrderTable` |
| `SCR-010` 주문 상세 | `API-007`: items, selectedOptions, excludedIngredients | 상세 표시, 상태 변경 버튼 | `OrderDetailPage`, `OrderStatusBadge` |
| `SCR-011` 품절 관리 | `API-010`, `API-009`: `targetType`, `targetId`, `name`, `isSoldOut`, `reasonType` | 메뉴/재료/옵션 필터, 토글 | `SoldOutManagePage`, `SoldOutToggle` |
| `SCR-015` 로그인 | 로그인 성공/실패 mock | 개발용 로그인 통과만 처리 | `LoginPage` |
| `SCR-016/017` 메뉴 관리/편집 | `API-011/012`: `categoryId`, `name`, `price`, `imageUrl`, `optionGroupIds` | 목록·편집 폼 UI, 저장 mock | `MenuManagePage`, `MenuEditPage` |
| `SCR-018` 결제수단 | `API-013/014` | 카드 등 활성 여부·정렬 mock | `PaymentMethodPage` |
| `SCR-019` 매출 | `API-015`: `from`, `to`, 일별 매출·메뉴별 판매량 | 기간 선택, 요약·차트 mock | `SalesSummaryPage`, `SalesChart` |

관리자 확장 화면은 7/22까지 **mock UI와 상태 변경**까지만 완료한다. 실제 서버 인증·영속 저장은 백엔드 연결 주차에 한다.

## 4. 일별 실행 순서

| 날짜 | 나연 1차 작업 | 하진 1차 작업 | 함께 확인 |
| --- | --- | --- | --- |
| 7/14(월) | 구조·`orderType` 계약 확인 | mock JSON 필드명을 API 명세 기준으로 정리 | store 키, 응답 envelope, 라우트 병합 이력 합의 |
| 7/15(화) | `SCR-001` 마크업·`orderType` 저장 | `SCR-005` 마크업·수량 변경/삭제·총액 | 서로 store 읽기 테스트 |
| 7/16(수) | `SCR-003` + API-001/002 mock·탭 | `SCR-005` 모달 + API-005 mock, `SCR-007` 마크업 | 주문 요청 body 필드 대조 |
| 7/17(목) | `SCR-004` + API-003/004 mock·옵션/제외 | `SCR-007` 로딩/실패 오버레이, `SCR-008` | 실패 시 장바구니 유지 확인 |
| 7/18(금) | `TC-003` 품절 표시 마무리 | `TC-004` 결제 실패 재현 | 고객 흐름 데모·회고 |
| 7/21(월) | `SCR-009/010`: 주문 목록·상세·상태 mock | `SCR-011`, `016/017`: 품절·메뉴 관리 mock | 고객 파트 상호 코드리뷰 |
| 7/22(화) | `SCR-015`, `018`, `019` mock UI·통합 | 고객/관리자 연결, TC 실행·버그 수정 | `TC-001`, `TC-002`, `TC-003`, `TC-004` 합격 확인 |

## 5. 테스트 체크리스트

| 테스트 | 반드시 확인할 결과 |
| --- | --- |
| `TC-001` 신규 주문 | 매장/포장 선택 → 메뉴 1개+토핑 1개 → 결제 → `SCR-008` 주문번호 표시 |
| `TC-002` 화면 전환 | 고객 흐름은 5회 이하. `SCR-005` 컨펌은 모달이므로 라우트 전환으로 세지 않음. |
| `TC-003` 옵션 품절 | 관리자 mock에서 옵션 품절 → `SCR-004`에서 회색·SOLD OUT·선택 불가. |
| `TC-004` 결제 실패 | 실패 응답 mock → 안내 오버레이 → 장바구니와 선택 옵션이 그대로 남음. |
| 관리자 smoke | 상태 변경이 목록/상세에 반영되고, 품절 토글이 키오스크 mock 표시 규칙과 일치. |

## 6. 브랜치와 커밋 규칙

### 브랜치

```text
main
├─ feature/kiosk-home-scr001
├─ feature/kiosk-menu-scr003
├─ feature/kiosk-detail-scr004
├─ feature/kiosk-cart-scr005
├─ feature/kiosk-payment-scr007-008
├─ feature/admin-orders-scr009-010
├─ feature/admin-soldout-scr011
└─ feature/admin-management-scr015-019
```

- 공통 파일(`router/index.jsx`, `store/*`, `constants/*`, `public/mocks/*`)을 수정하기 전에는 먼저 팀 채널에 알린다.
- 한 브랜치는 한 화면 또는 한 기능 흐름만 다룬다.
- `main`에는 직접 push하지 않고, PR 또는 함께 보는 diff 뒤 병합한다.
- 원격은 `git remote -v`로 확인한다. GitHub ID는 `hagenie128`이 맞다.

### 커밋 메시지

```text
feat(kiosk): add order type selection for SCR-001
feat(kiosk): add menu sold-out states for SCR-003
feat(kiosk): add option selection rules for SCR-004
feat(cart): add quantity and total price calculation for SCR-005
feat(payment): add pending and failure overlay states
feat(admin): add mock order status update flow
test(kiosk): add TC-004 payment failure scenario
docs(frontend): align mock fields with API-005 contract
```

형식은 `type(scope): 한 줄 설명`을 쓴다. `feat`, `fix`, `test`, `docs`, `refactor`, `chore`만 사용한다.

## 7. 매일 협업 규칙

1. 작업 시작 전 담당 화면의 `SCR`, `API`, `TC`, 요구사항 ID를 이 문서에서 확인한다.
2. mock 필드명은 API 명세 예시를 복사한다. `optionItemId`를 `optionId`로 바꾸지 않는다.
3. 메뉴 자체 품절과 재료/옵션 품절을 구분한다. 메뉴만 비활성화하고, 일반 재료는 뱃지, 옵션은 선택 불가 처리한다.
4. 결제 실패는 장바구니 리셋이 아니다. `APPROVED`일 때만 초기화한다.
5. 모달·오버레이는 라우트를 추가하지 않는다. 화면 병합 이력을 깨지 않는다.
6. 매일 워크로그에 `오늘 완료 화면 / 막힌 데이터 / 다음 작업 / 공통파일 변경`을 남긴다.
7. 하루 종료 전 상대 파트가 필요한 store 키와 mock 필드를 5분만 함께 확인한다.
