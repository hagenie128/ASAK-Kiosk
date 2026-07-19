# ASAK Kiosk 구현 계획

> 기준일: **2026-07-20** · **코드 실측** 반영 (Home→Cart mock · Payment~ UI shell).  
> 담당 영역: **P3 키오스크** (Admin/P4는 [`ASAK-Admin/IMPLEMENTATION_PLAN.md`](../ASAK-Admin/IMPLEMENTATION_PLAN.md)가 정본 — 이 문서는 Admin 범위를 다루지 않음)  
> 문서 입구: [`ASAK/docs/START_HERE.md`](../ASAK/docs/START_HERE.md)  
> 정본 WBS: [`ASAK/docs/wiki/wbs-v2.md`](../ASAK/docs/wiki/wbs-v2.md) **P3 키오스크 · WBS2-017 ~ WBS2-032** (Admin은 P4 · WBS2-033~045)  
> 구조: [`src/STRUCTURE_GUIDE.md`](src/STRUCTURE_GUIDE.md)  
> 구현 맵: [`ASAK/docs/planning/CURRENT_IMPLEMENTATION_MAP.md`](../ASAK/docs/planning/CURRENT_IMPLEMENTATION_MAP.md)  
> Canonical: [`ASAK/docs/governance/CANONICAL_CONTRACT_DECISIONS.md`](../ASAK/docs/governance/CANONICAL_CONTRACT_DECISIONS.md)  
> 3일 스프린트: [`ASAK/docs/planning/FRONTEND_WEDNESDAY_WBS_2026-07-20.md`](../ASAK/docs/planning/FRONTEND_WEDNESDAY_WBS_2026-07-20.md)  
> 이 문서는 **2026-07-14 최초 상세 계획**(화면 계약·일정·fixture·테스트·브랜치 규칙)을 복원하고, **2026-07-20 코드 실측**(현재 상태)을 함께 담은 통합본이다. 두 기준이 다를 때는 **0~1번(코드 실측)이 우선**이며, 나머지는 참고용 계약·이력이다.

## 0. 한눈에 보는 현재 상태

| 층 | 상태 | 의미 |
| --- | --- | --- |
| UI (Figma 이식) | **완료** | 페이지·컴포넌트·CSS 존재. 통째 재이식 금지 |
| Home → Menu → Detail → Cart | **mock 동작** | store / `priceCalculation` / `quantityLimits` 적용 |
| Payment → Complete / Error / Timeout | **UI만** | 수단 선택·결제·타이머 **미연결** |
| API adapter / 실서버 | **미연결** | 페이지가 `public/mocks/kiosk.json` 직접 사용 |
| Backend 연동 (P6) | **BLOCKED** | `ASAK-back` business API 없음 |

### 라우트 실측 (`apps/kiosk/KioskApp.jsx`)

| 경로 | SCR | 동작 | WBS |
| --- | --- | --- | --- |
| `/` | SCR-001 | 매장/포장 → `/menu` | WBS2-017 **DONE** |
| `/menu` | SCR-003 | mock 목록 | WBS2-018 **IN_PROGRESS** |
| `/menu/:menuId` | SCR-004 | 옵션·담기·가격 | WBS2-019~021 **IN_PROGRESS** |
| `/cart` | SCR-005 | 수량·삭제·비우기 | WBS2-025 **IN_PROGRESS** |
| `/payment` | SCR-007 | UI, 결제 disabled | WBS2-026 **IN_PROGRESS** |
| `/complete` | SCR-008 | shell, 데이터 미연결 | WBS2-028 **IN_PROGRESS** |
| `/payment-error` | SCR-012 | 정적 | WBS2-027 **TODO** |
| `/timeout` | SCR-013 | 정적 | WBS2-029~030 **TODO** |
| `/accessibility` | SCR-014 | 정적 | (연계) |
| `/receipt` | SCR-023 | Future Scope | 제외 |

## 1. 이번 스프린트(7/20~7/22) 목표

**UI 다시 그리지 않는다.** 연결·상태·mock·검증만 한다.

| 우선 | 작업 | WBS | 완료 조건 |
| --- | --- | --- | --- |
| P0 | 수량 한도 초과 **4초 토스트** | WBS2-024 | Cart/Detail에서 한도 초과 시 `KioskToast` |
| P0 | 결제 수단 선택 + mock 승인 → complete | WBS2-026~028 | `orderNo`·금액·대기 건수 표시, APPROVED 후 cart 초기화 |
| P0 | 결제 실패 → cart 보존 | WBS2-027 | `/payment-error` 또는 overlay, 장바구니 유지 |
| P1 | 타임아웃 30/20/10초 | WBS2-029~030 | PROCESSING 중 타이머 정지 |
| P1 | loading/empty/error 보강 | WBS2-031 | 메뉴·장바구니·결제 핵심 흐름 |
| P2 | menu adapter 정리 | WBS2-018~019 | 페이지에서 JSON 직접 import 제거 (점진) |

### 하지 않는 것

- 실제 PG·프린터·QR·멤버십 (SCR-023/024)
- CSS/시안 통째 교체, Figma MCP React 붙여넣기
- `priceCalculation.js` / `quantityLimits.js` 되돌리기·복제
- Admin 기능을 이 저장소에 신규 작성 (`ASAK-Admin` 정본)
- Backend 실연동 (WBS2-058 BLOCKED)

## 2. 공통 계약 (유지)

| 항목 | 결정 |
| --- | --- |
| 전역 상태 | `orderSessionStore` (+ `cartStore`/`orderStore` 호환 export). 페이지 UI 상태는 로컬 `useState` |
| 주문 유형 | `orderType`: `EAT_IN` \| `TAKE_OUT` |
| 가격 | **`utils/priceCalculation.js`만** |
| 수량 | **`utils/quantityLimits.js`만** (동일 메뉴 9 · 장바구니 30) |
| Envelope | `{ success, status, code, message, data }` — `api/client.js`에서만 unwrap |
| Mock 원본 | `public/mocks/kiosk.json` |
| Canonical API (문서) | `/api/kiosk/menuList`, `/api/kiosk/menuDetail/{menuId}`, `/api/kiosk/orders`, `/api/kiosk/payments` |
| 코드 상수 | 아직 legacy `/api/menus` 등 → `DECIDED_PENDING_CODE_CHANGE` |
| 정본 응답 필드 | `totalAmount`, `approvedAmount`, `approvedAt`, `waitingOrderCount` — store는 당분간 `totalPrice` 등 유지, adapter 매핑 (WBS2-057) |

### 상태 store 필드 구조 (2026-07-14 최초 계약, 참고)

> 현재 코드는 `orderSessionStore`를 중심으로 쓰고 `cartStore`/`orderStore`는 호환 export로만 남아 있다 (위 0번 표 참고). 아래는 최초 설계 당시의 필드 경계이며, 신규 필드를 추가할 때 참고 기준으로 삼는다.

```text
cartStore
  items[]: menuId, menuName, unitPrice, quantity,
           optionItems[{ optionItemId, name, extraPrice, quantity }],
           excludedIngredientIds[]

orderSessionStore
  orderType: EAT_IN | TAKE_OUT
  draftOrder: 주문 생성 요청에 필요한 장바구니 스냅샷

orderStore
  order: { orderId, orderNo, orderStatus, totalPrice }
  payment: { paymentId, orderId, orderNo, amount, paymentStatus, paidAt }
```

### 주문·결제 상태 전이

```text
장바구니 편집
  → (주문 확인)
  → mock 주문 생성 (API-005 대응)  → RECEIVED / READY
  → mock 결제 (API-006 대응)
     ├─ APPROVED → /complete → cart 초기화
     └─ FAILED   → /payment-error → cart 보존
```

## 3. 구현 순서 (남은 일)

1. **WBS2-024** — `quantityLimits` reason → `KioskToast` 4초
2. **WBS2-026** — `PaymentPage` 수단 선택 활성화 + mock 결제 시나리오
3. **WBS2-027** — 실패 분기·장바구니 유지
4. **WBS2-028** — complete에 `orderNo` / 금액 / `waitingOrderCount`
5. **WBS2-029~030** — `useKioskTimeout` 실제 연결
6. **WBS2-031~032** — 상태 UI·터치 QA
7. (이후) adapter + Canonical path 상수 정렬 → P6 연동

## 4. 화면별 구현 계약 (2026-07-14 최초 계약, 참고)

> SCR 번호와 세부 규칙은 최초 계획 문서 기준이며, 실제 구현 진행도는 0·1번 표를 따른다. 새 화면 작업 시 이 표의 규칙을 어기지 않았는지 확인한다.

### 주문·메뉴 흐름: `SCR-001` → `SCR-003` → `SCR-004`

| 화면 | 입력 → 출력 | API/상태 | 필수 규칙·테스트 |
| --- | --- | --- | --- |
| `SCR-001` 주문 유형 | 매장/포장 선택 → `orderType` | `orderSessionStore.orderType` | 선택 전 메뉴 진입 버튼은 비활성화한다. 선택값은 장바구니와 주문 생성 요청까지 유지한다. `SCR-002`를 별도 페이지로 만들지 않는다. |
| `SCR-003` 메뉴 목록 | `categoryId` → 카테고리·메뉴 카드 | `API-001`, `API-002` | 카드에 이미지, 이름, 가격, 칼로리, `isSoldOut`, `soldOutBadges`를 표시한다. 메뉴 자체 품절은 카드 클릭을 막는다. 재료 품절은 뱃지로만 표시하고 상세에서 최종 판단한다. 빈 카테고리는 오류가 아닌 empty 상태다. |
| `SCR-004` 메뉴 상세 | 메뉴·재료·옵션 선택 → 장바구니 항목 | `API-003`, `API-004`, `cartStore` | `canRemove`인 재료만 제외 가능하다. 알레르기와 설명을 표시한다. 필수 옵션은 최소 선택 수를 만족해야 추가할 수 있다. 품절 옵션은 `SOLD OUT` 표기와 함께 선택 불가다. |

### 장바구니·결제 흐름: `SCR-005` → `SCR-007` → `SCR-008`

| 화면 | 입력 → 출력 | API/상태 | 필수 규칙·테스트 |
| --- | --- | --- | --- |
| `SCR-005` 장바구니 | 수량·삭제 → 총액·주문 확인 | `cartStore`, `API-005` | 항목 단가는 `unitPrice + 옵션 extraPrice 합계`이며 수량을 반영한다. 수량 감소가 0이 되면 삭제 여부를 명확히 처리한다. 빈 장바구니에서는 주문 진행을 막는다. `SCR-006`은 라우트가 아닌 확인 모달이다. |
| `SCR-007` 결제 | 결제수단·금액 → 결제 결과 | `API-006`, `orderStore` | 주문 생성 성공 뒤에만 진입한다. 요청 중에는 버튼과 수단 변경을 잠그고 진행 상태를 보인다. 실패 응답이면 성공 화면으로 이동하지 않고 `SCR-012`를 연다. |
| `SCR-008` 주문 완료 | 주문 결과 → 주문번호·결제 안내 | `orderStore.payment` | `APPROVED` 상태, `orderNo`, `paidAt`, 총 결제금액을 표시한다. 이 화면에 도달한 뒤에만 주문 초안을 초기화한다. 영수증 출력은 UI 안내 수준으로만 둔다. |
| `SCR-012` 결제 실패 | 실패 코드 → 안내·복귀 동작 | `API-006` failure mock | 오류 overlay/toast는 실패 사유와 재시도/장바구니 복귀 행동을 제공한다. 메뉴, 수량, 옵션, 제외 재료를 절대 초기화하지 않는다. |

## 5. 품절·옵션 세부 규칙 (2026-07-14 최초 계약, 참고)

| 대상 | 표시 | 선택/주문 규칙 |
| --- | --- | --- |
| 메뉴 자체 품절 | 카드 비활성화, 품절 배지 | 상세 진입·장바구니 추가 불가 |
| 기본 재료 품절 | 메뉴 카드의 안내 배지, 상세 안내 | 메뉴가 주문 가능하면 재료 선택 UI를 임의로 비활성화하지 않는다 |
| 제외 가능한 재료 품절 | 상세 재료 행에 상태 표시 | 제외 선택의 의미가 없으면 비활성화하고 사유를 보인다 |
| 옵션 품절 | 회색 처리와 `SOLD OUT` | 선택 불가, 필수 옵션 최소 선택 수 계산에서도 제외 |
| 주문 직전 품절 | `MENU_SOLD_OUT` 등 API 오류 | 장바구니를 유지하고 영향을 받은 항목을 안내한다 |

## 6. Mock API와 실패 fixture (2026-07-14 최초 계약, 참고)

> 아래 `API-001`~`API-006` ID는 최초 설계 시 문서 표기이며, 현재 Canonical 문서 경로는 위 2번 표의 `/api/kiosk/...` 표기를 따른다. 코드 상수는 아직 legacy 경로를 쓰므로 fixture를 새로 만들 때는 실제 코드 경로 기준으로 맞춘다.

| API | 정상 mock | 실패/경계 mock | 화면 영향 |
| --- | --- | --- | --- |
| `API-001/002` (menuList) | 카테고리와 메뉴 카드 | 빈 카테고리, 네트워크 오류, `isSoldOut=true` | 메뉴 목록 |
| `API-003/004` (menuDetail) | 메뉴 상세·옵션 그룹 | 메뉴 주문 불가, 필수 옵션 미충족, 옵션 품절 | 메뉴 상세 |
| `API-005` (orders) | `orderId`, `orderNo`, `RECEIVED`, `totalPrice` | 빈 장바구니, `MENU_SOLD_OUT`, 서버 오류 | 장바구니·주문 확인 |
| `API-006` (payments) | `paymentStatus=APPROVED`, `paidAt` | `FAILED`, 금액 불일치, 네트워크 오류 | 결제·실패 overlay |

- 성공 mock과 실패 mock은 동일한 요청 형식을 사용한다. 화면 컴포넌트에서 성공 여부를 하드코딩하지 않는다.
- mock 지연은 결제 대기와 loading 상태를 확인할 수 있을 정도로만 사용한다.
- `data`가 비어 있는 정상 응답과 `success=false` 오류 응답을 구분한다.

## 7. 일별 실행 순서 (계획(이력) — 2026-07-14~2026-07-22 최초 계획)

> **이력 표**: 아래 날짜 계획은 2026-07-14 최초 작성 시점 기준이다. 7/20 코드 실측(0·1번 표) 결과 UI/Cart는 계획보다 더 진행돼 있었고, 결제·타임아웃 연결은 계획보다 늦어졌다. 지금 해야 할 일은 1·3번을 따른다.

| 날짜 | 주문·메뉴 담당 | 장바구니·결제 담당 | UI·통합 담당 | 당일 완료 조건 |
| --- | --- | --- | --- | --- |
| 7/14 | `orderType`, menu/option 필드와 품절 규칙 확정 | 주문·결제 상태 전이와 실패 코드 확정 | 라우트, envelope, store 경계 확인 | 화면/API/TC ID 및 공통 필드 합의 |
| 7/15 | `SCR-001`, `API-001/002` fixture, 메뉴 진입 | `API-005` 요청·응답 mock 준비 | 공통 레이아웃, loading, 버튼 상태 | 주문 유형 선택 뒤 메뉴 진입 가능 |
| 7/16 | `SCR-003`, `SCR-004`, 옵션·재료 제외 | 장바구니 계산 규칙과 항목 스냅샷 리뷰 | menu/option fixture 검증 | 옵션 포함 항목이 계약 형태로 store에 저장 |
| 7/17 | 필수 옵션·품절·알레르기 예외 | `SCR-005`, 확인 모달, 주문 생성 | empty/error와 키보드 모달 점검 | 수량·삭제·총액·주문 확인 흐름 완료 |
| 7/18 | 메뉴 재진입과 장바구니 상태 검증 | `SCR-007`, `SCR-008`, `SCR-012` | 결제 대기·오류·포커스 UI | 성공·실패 mock 모두 시연 |
| 7/19 | 주문 시작~상세 smoke | 결제 실패 복구 smoke | `TC-K01/K02` 결과 기록 | 전체 주문 흐름 1회 통과 |
| 7/20 (**오늘**) | 품절·옵션 경계 수정 | 빈 장바구니·중복 결제 수정 | 모바일·키보드 점검 | 알려진 결함 우선순위 확정 — **실측 결과 위 1번 표로 대체** |
| 7/21 | 화면 간 `orderType`·장바구니 보존 확인 | 금액·주문번호·초기화 확인 | lint/build, 통합 리뷰 | 모든 필수 화면 PR 준비 |
| 7/22 | 최종 bug fix | 최종 bug fix | 데모, 빌드 산출물, worklog | `TC-K01`~`TC-K04` 통과 |

## 8. 테스트 체크리스트

| ID | 시나리오 | 기대 결과 |
| --- | --- | --- |
| `TC-K01` 기본 주문 | 주문 유형 선택 → 메뉴 1개·옵션 1개 → 결제 성공 | complete 화면에서 주문번호가 보이고, `APPROVED` 뒤 장바구니가 초기화된다. |
| `TC-K02` 결제 실패 복구 | 장바구니에 옵션·제외 재료를 담은 뒤 결제 실패 | 실패 안내가 보이고 장바구니·옵션·수량·주문 유형이 모두 보존된다. |
| `TC-K03` 품절 처리 | 메뉴 자체 품절, 기본 재료 품절, 옵션 품절을 각각 확인 | 메뉴는 진입 불가, 기본 재료는 안내, 옵션은 선택 불가로 구분된다. |
| `TC-K04` 입력 경계 | 필수 옵션 미선택, 빈 장바구니, 결제 버튼 연타 | 유효하지 않은 요청을 보내지 않으며, 결제는 한 번만 처리된다. |
| `TC-K05` 수량 한도 | 동일 메뉴 9개, 장바구니 30개 한도 각각 시도 | 초과 불가 + `KioskToast` 4초 노출 (WBS2-024) |
| `TC-K06` 타임아웃 | 결제 대기 중 30/20/10초 경고 | 경고·카운트다운 노출, `PROCESSING` 중에는 타이머 정지 |
| 접근성 smoke | Tab/Shift+Tab, Enter/Space, 모달 열기·닫기 | 포커스가 보이고 모달을 닫은 뒤 실행 버튼으로 돌아온다. |

## 9. 브랜치·커밋·일일 작업 규칙 (2026-07-14 최초 계약, 참고)

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

## 10. 관련 문서

| 문서 | 경로 |
| --- | --- |
| STRUCTURE_GUIDE | [`src/STRUCTURE_GUIDE.md`](src/STRUCTURE_GUIDE.md) |
| 구현 맵 | [`ASAK/docs/planning/CURRENT_IMPLEMENTATION_MAP.md`](../ASAK/docs/planning/CURRENT_IMPLEMENTATION_MAP.md) |
| WBS 상태 메모 | [`ASAK/docs/wiki/wbs-status-notes.md`](../ASAK/docs/wiki/wbs-status-notes.md) |
| Mock | [`public/mocks/README.md`](public/mocks/README.md) |
| DevCopilot sync | [`ASAK/docs/wiki/devcopilot-sync-report.md`](../ASAK/docs/wiki/devcopilot-sync-report.md) |
| Admin 구현 계획 (별도 정본) | [`ASAK-Admin/IMPLEMENTATION_PLAN.md`](../ASAK-Admin/IMPLEMENTATION_PLAN.md) |

## Documentation status

- Status: **Current (2026-07-20 code audit) + 2026-07-14 최초 계약 복원본**
- 이전 07-14 계획은 UI·Cart를 "미구현"으로 적어 **과소평가**되어 있었음 → 0·1번 표는 실측으로 대체.
- 단, 07-14 계획의 화면 계약(4번)·품절 규칙(5번)·fixture(6번)·일정(7번, 이력)·테스트(8번)·브랜치 규칙(9번)은 **삭제하지 않고 이 문서에 유지**한다 (2026-07-20 사용자 피드백: "기존에 있던 내용이 빠졌다" 반영).
- Product Bible: Pack 12 Frontend Implementation (정책 참고).
