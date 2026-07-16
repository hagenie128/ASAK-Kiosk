# ASAK Kiosk React Mock 구현 상세 계획 (2026-07-14 ~ 2026-07-22)

> 목적: 자동 생성 코드나 실제 서버 연동 없이 키오스크 주문 흐름을 React와 mock 데이터로 시연 가능하게 구현한다. 데이터 계약의 정본은 [src/contracts/api-data-contract.md](src/contracts/api-data-contract.md)이며, 화면 범위와 요구사항 연결은 [src/contracts/requirements-screen-map.md](src/contracts/requirements-screen-map.md)를 따른다.

## 0. 범위와 완료 기준

### 7월 22일까지 구현할 범위

| 구분 | 화면 | mock 연동 범위 |
| --- | --- | --- |
| 주문 시작 | `SCR-001` | 매장/포장 선택, `orderType` 저장, 메뉴 화면 진입 |
| 메뉴 탐색 | `SCR-003` | 카테고리·메뉴 조회, 메뉴/재료 품절 상태 표시 |
| 메뉴 상세·옵션 | `SCR-004` | 재료 제외, 필수·선택 옵션, 예상 금액, 장바구니 추가 |
| 장바구니·주문 확인 | `SCR-005` | 수량·삭제·총액, 주문 확인 모달, 주문 생성 |
| 결제·완료 | `SCR-007`, `SCR-008` | 결제수단 선택, 처리 대기, 성공 결과와 주문번호 |
| 결제 예외 | `SCR-012` | 실패 overlay 또는 toast, 장바구니 상태 보존과 복귀 |

`SCR-002`는 `SCR-001`의 주문 유형 선택에 병합한다. `SCR-006`은 `SCR-005`의 `ConfirmDialog`로 구현한다. `SCR-012`는 별도 라우트가 아니라 결제 화면 위의 오류 상태다.

### 이번 범위에서 하지 않는 것

- 실제 인증, PG 결제, 프린터·영수증 출력, QR/바코드 스캔, 멤버십 연동
- 실제 백엔드 호출 및 실시간 품절 동기화
- 관리자 화면(`SCR-009`~`019`): `ASAK-Admin` 저장소 책임
- 후반 확장 API `API-016`~`020`의 실제 장치·서버 구현

### 완료 기준

1. 주문 유형 선택부터 결제 성공·실패까지 mock으로 재현된다.
2. 각 페이지는 loading, empty, error, success 상태를 가진다.
3. 필수 옵션·품절·빈 장바구니·중복 결제·결제 실패가 성공 흐름으로 진행되지 않는다.
4. 키보드로 주요 버튼과 모달을 조작할 수 있고, `npm run lint`, `npm run build`가 통과한다.
5. 아래 `TC-K01`~`TC-K04`와 데모 smoke를 실행한 결과를 worklog에 남긴다.

## 1. 공통 계약: 첫날 확정할 것

| 항목 | 결정 |
| --- | --- |
| 전역 상태 | `zustand`의 `cartStore`, `orderSessionStore`, `orderStore`만 사용한다. 페이지 로컬 UI 상태를 전역 store에 넣지 않는다. |
| 주문 유형 | 필드명은 정확히 `orderType`이며 값은 `EAT_IN`, `TAKE_OUT`만 사용한다. |
| API 응답 | 모든 mock 응답은 `{ success, status, code, message, data }` envelope를 사용하고, `api/client.js`에서만 해제한다. |
| 식별자 | `menuId`, `categoryId`, `ingredientId`, `optionGroupId`, `optionItemId`, `orderId`, `paymentId`를 사용한다. 별칭 ID를 만들지 않는다. |
| 금액 | API와 store에는 숫자를 저장한다. 표시만 `utils/currency.js`에서 원화 문자열로 변환한다. |
| mock 원본 | `public/mocks/kiosk.json`의 API 계약 필드를 우선한다. 화면 편의를 위한 임의 필드는 계약 검토 없이 추가하지 않는다. |
| 성공 뒤 초기화 | `paymentStatus === 'APPROVED'`일 때만 장바구니와 주문 초안을 비운다. 주문 생성·결제 실패는 보존한다. |

### 상태 경계

```text
cartStore
  items[]: menuId, menuName, unitPrice, quantity,
           optionItems[{ optionItemId, name, extraPrice, quantity }],
           excludedIngredientIds[]

orderSessionStore
  orderType: EAT_IN | TAKE_OUT
  draftOrder: API-005 요청에 필요한 장바구니 스냅샷

orderStore
  order: { orderId, orderNo, orderStatus, totalPrice }
  payment: { paymentId, orderId, orderNo, amount, paymentStatus, paidAt }
```

### 주문·결제 상태 전이

```text
장바구니 편집
  → 주문 확인
  → API-005 주문 생성
  → orderStatus: RECEIVED, paymentStatus: READY
  → API-006 결제 요청
     ├─ APPROVED → SCR-008 → cartStore / draftOrder 초기화
     └─ FAILED   → SCR-012 → SCR-005 또는 SCR-007 복귀, 상태 보존
```

## 2. 화면별 구현 계약

### 주문·메뉴 흐름: `SCR-001` → `SCR-003` → `SCR-004`

| 화면 | 입력 → 출력 | API/상태 | 필수 규칙·테스트 |
| --- | --- | --- | --- |
| `SCR-001` 주문 유형 | 매장/포장 선택 → `orderType` | `orderSessionStore.orderType` | 선택 전 메뉴 진입 버튼은 비활성화한다. 선택값은 장바구니와 `API-005` 요청까지 유지한다. `SCR-002`를 별도 페이지로 만들지 않는다. |
| `SCR-003` 메뉴 목록 | `categoryId` → 카테고리·메뉴 카드 | `API-001`, `API-002` | 카드에 이미지, 이름, 가격, 칼로리, `isSoldOut`, `soldOutBadges`를 표시한다. 메뉴 자체 품절은 카드 클릭을 막는다. 재료 품절은 뱃지로만 표시하고 상세에서 최종 판단한다. 빈 카테고리는 오류가 아닌 empty 상태다. |
| `SCR-004` 메뉴 상세 | 메뉴·재료·옵션 선택 → 장바구니 항목 | `API-003`, `API-004`, `cartStore` | `canRemove`인 재료만 제외 가능하다. 알레르기와 설명을 표시한다. 필수 옵션은 최소 선택 수를 만족해야 추가할 수 있다. 품절 옵션은 `SOLD OUT` 표기와 함께 선택 불가다. |

### 장바구니·결제 흐름: `SCR-005` → `SCR-007` → `SCR-008`

| 화면 | 입력 → 출력 | API/상태 | 필수 규칙·테스트 |
| --- | --- | --- | --- |
| `SCR-005` 장바구니 | 수량·삭제 → 총액·주문 확인 | `cartStore`, `API-005` | 항목 단가는 `unitPrice + 옵션 extraPrice 합계`이며 수량을 반영한다. 수량 감소가 0이 되면 삭제 여부를 명확히 처리한다. 빈 장바구니에서는 주문 진행을 막는다. `SCR-006`은 라우트가 아닌 확인 모달이다. |
| `SCR-007` 결제 | 결제수단·금액 → 결제 결과 | `API-006`, `orderStore` | 주문 생성 성공 뒤에만 진입한다. 요청 중에는 버튼과 수단 변경을 잠그고 진행 상태를 보인다. 실패 응답이면 성공 화면으로 이동하지 않고 `SCR-012`를 연다. |
| `SCR-008` 주문 완료 | 주문 결과 → 주문번호·결제 안내 | `orderStore.payment` | `APPROVED` 상태, `orderNo`, `paidAt`, 총 결제금액을 표시한다. 이 화면에 도달한 뒤에만 주문 초안을 초기화한다. 영수증 출력은 UI 안내 수준으로만 둔다. |
| `SCR-012` 결제 실패 | 실패 코드 → 안내·복귀 동작 | `API-006` failure mock | 오류 overlay/toast는 실패 사유와 재시도/장바구니 복귀 행동을 제공한다. 메뉴, 수량, 옵션, 제외 재료를 절대 초기화하지 않는다. |

### 품절·옵션 세부 규칙

| 대상 | 표시 | 선택/주문 규칙 |
| --- | --- | --- |
| 메뉴 자체 품절 | 카드 비활성화, 품절 배지 | 상세 진입·장바구니 추가 불가 |
| 기본 재료 품절 | 메뉴 카드의 안내 배지, 상세 안내 | 메뉴가 주문 가능하면 재료 선택 UI를 임의로 비활성화하지 않는다 |
| 제외 가능한 재료 품절 | 상세 재료 행에 상태 표시 | 제외 선택의 의미가 없으면 비활성화하고 사유를 보인다 |
| 옵션 품절 | 회색 처리와 `SOLD OUT` | 선택 불가, 필수 옵션 최소 선택 수 계산에서도 제외 |
| 주문 직전 품절 | `MENU_SOLD_OUT` 등 API 오류 | 장바구니를 유지하고 영향을 받은 항목을 안내한다 |

## 3. Mock API와 실패 fixture

| API | 정상 mock | 실패/경계 mock | 화면 영향 |
| --- | --- | --- | --- |
| `API-001/002` | 카테고리와 메뉴 카드 | 빈 카테고리, 네트워크 오류, `isSoldOut=true` | 메뉴 목록 |
| `API-003/004` | 메뉴 상세·옵션 그룹 | 메뉴 주문 불가, 필수 옵션 미충족, 옵션 품절 | 메뉴 상세 |
| `API-005` | `orderId`, `orderNo`, `RECEIVED`, `totalPrice` | 빈 장바구니, `MENU_SOLD_OUT`, 서버 오류 | 장바구니·주문 확인 |
| `API-006` | `paymentStatus=APPROVED`, `paidAt` | `FAILED`, 금액 불일치, 네트워크 오류 | 결제·실패 overlay |

- 성공 mock과 실패 mock은 동일한 요청 형식을 사용한다. 화면 컴포넌트에서 성공 여부를 하드코딩하지 않는다.
- mock 지연은 결제 대기와 loading 상태를 확인할 수 있을 정도로만 사용한다.
- `data`가 비어 있는 정상 응답과 `success=false` 오류 응답을 구분한다.

## 4. 일별 실행 순서

| 날짜 | 주문·메뉴 담당 | 장바구니·결제 담당 | UI·통합 담당 | 당일 완료 조건 |
| --- | --- | --- | --- | --- |
| 7/14 | `orderType`, menu/option 필드와 품절 규칙 확정 | 주문·결제 상태 전이와 실패 코드 확정 | 라우트, envelope, store 경계 확인 | 화면/API/TC ID 및 공통 필드 합의 |
| 7/15 | `SCR-001`, `API-001/002` fixture, 메뉴 진입 | `API-005` 요청·응답 mock 준비 | 공통 레이아웃, loading, 버튼 상태 | 주문 유형 선택 뒤 메뉴 진입 가능 |
| 7/16 | `SCR-003`, `SCR-004`, 옵션·재료 제외 | 장바구니 계산 규칙과 항목 스냅샷 리뷰 | menu/option fixture 검증 | 옵션 포함 항목이 계약 형태로 store에 저장 |
| 7/17 | 필수 옵션·품절·알레르기 예외 | `SCR-005`, 확인 모달, 주문 생성 | empty/error와 키보드 모달 점검 | 수량·삭제·총액·주문 확인 흐름 완료 |
| 7/18 | 메뉴 재진입과 장바구니 상태 검증 | `SCR-007`, `SCR-008`, `SCR-012` | 결제 대기·오류·포커스 UI | 성공·실패 mock 모두 시연 |
| 7/19 | 주문 시작~상세 smoke | 결제 실패 복구 smoke | `TC-K01/K02` 결과 기록 | 전체 주문 흐름 1회 통과 |
| 7/20 | 품절·옵션 경계 수정 | 빈 장바구니·중복 결제 수정 | 모바일·키보드 점검 | 알려진 결함 우선순위 확정 |
| 7/21 | 화면 간 `orderType`·장바구니 보존 확인 | 금액·주문번호·초기화 확인 | lint/build, 통합 리뷰 | 모든 필수 화면 PR 준비 |
| 7/22 | 최종 bug fix | 최종 bug fix | 데모, 빌드 산출물, worklog | `TC-K01`~`TC-K04` 통과 |

## 5. 테스트 체크리스트

| ID | 시나리오 | 기대 결과 |
| --- | --- | --- |
| `TC-K01` 기본 주문 | 주문 유형 선택 → 메뉴 1개·옵션 1개 → 결제 성공 | `SCR-008`에서 주문번호가 보이고, `APPROVED` 뒤 장바구니가 초기화된다. |
| `TC-K02` 결제 실패 복구 | 장바구니에 옵션·제외 재료를 담은 뒤 결제 실패 | 실패 안내가 보이고 장바구니·옵션·수량·주문 유형이 모두 보존된다. |
| `TC-K03` 품절 처리 | 메뉴 자체 품절, 기본 재료 품절, 옵션 품절을 각각 확인 | 메뉴는 진입 불가, 기본 재료는 안내, 옵션은 선택 불가로 구분된다. |
| `TC-K04` 입력 경계 | 필수 옵션 미선택, 빈 장바구니, 결제 버튼 연타 | 유효하지 않은 요청을 보내지 않으며, 결제는 한 번만 처리된다. |
| 접근성 smoke | Tab/Shift+Tab, Enter/Space, 모달 열기·닫기 | 포커스가 보이고 모달을 닫은 뒤 실행 버튼으로 돌아온다. |

## 6. 브랜치·커밋·일일 작업 규칙

```text
main
├─ feature/kiosk-order-start-scr001
├─ feature/kiosk-menu-options-scr003-004
├─ feature/kiosk-cart-scr005
└─ feature/kiosk-payment-scr007-008-012
```

- `main`에 직접 push하지 않고, 한 화면 또는 한 기능 흐름 단위로 PR을 만든다.
- 공통 파일(`src/api/`, `src/store/`, `src/constants/`, `public/mocks/`) 변경 전에는 주문·결제 담당이 필드명과 상태 전이를 함께 확인한다.
- 커밋은 `type(scope): 동사로 시작하는 설명` 형식으로 작성한다.

```text
feat(kiosk): add order type selection for SCR-001
feat(kiosk): add sold-out option rules for SCR-004
feat(cart): calculate item quantities and total price
feat(payment): add pending and failure overlay states
test(kiosk): cover payment failure recovery scenario
docs(kiosk): align API-005 mock fields with contract
```

매일 종료 전 worklog에 `완료 화면 / 변경한 mock 필드 / 실행한 TC / 다음 작업 / 공통 파일 변경 여부`를 기록한다. 작업 시작 전에는 해당 `SCR`, `API`, `TC`를 계약 문서에서 다시 확인한다.

## Documentation status (2026-07-16)

- Status: Needs Review
- Written-at context: pre-canonical Kiosk mock implementation plan.
- Product Bible relationship: [Pack 12](../ASAK/docs/product_bible/12_Frontend_Implementation/README.md).
- Latest implementation baseline: [Current Implementation Map](../ASAK/docs/CURRENT_IMPLEMENTATION_MAP.md).
- Central canonical contract: [Canonical Contract Decisions](../ASAK/docs/CANONICAL_CONTRACT_DECISIONS.md).
- Potential conflict: endpoint, route, and store-field assumptions may differ; do not rename source in this phase.
