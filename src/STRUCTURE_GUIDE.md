# ASAK Kiosk 구조 가이드

> 기준일: **2026-07-20** · 실제 코드 기준 (Home→Cart mock 동작 · Payment~Timeout UI shell).  
> 문서 입구: `ASAK/docs/START_HERE.md`  
> WBS: `ASAK/docs/wiki/wbs-v2.md` 의 **WBS2-017 ~ WBS2-032** (P3 키오스크)  
> 전체 진척: `ASAK/docs/wiki/current-status-baseline.md` · 계획: [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md)

## 먼저 결론

기존에 배운 `App → pages → components → api` 구조는 그대로입니다.  
지금은 **화면·장바구니까지 mock으로 동작**하고, **결제·타임아웃 연결**이 다음 일입니다.

```text
기존 학습 프로젝트                 ASAK Kiosk
index.js                       ->  main.jsx -> entries/kiosk.jsx
App.js                         ->  apps/kiosk/KioskApp.jsx
pages/PostListPage.jsx         ->  pages/kiosk/MenuListPage.jsx
components/NavBar.jsx          ->  components/kiosk/MenuCard.jsx
api/postApi.js                 ->  api/menu.js (골격; 페이지는 아직 mock 직접 사용)
context/AuthContext.jsx        ->  store/cartStore.js → orderSessionStore.js
```

처음에는 **`KioskApp.jsx`, `pages/kiosk`, `components/kiosk`, `utils/priceCalculation.js`, `utils/quantityLimits.js`** 다섯 곳만 보면 됩니다.

## 화면이 브라우저에 보이는 흐름

```text
main.jsx
  -> entries/kiosk.jsx        React와 BrowserRouter를 시작
  -> apps/kiosk/KioskApp.jsx  <Routes> 조립
  -> pages/kiosk/*.jsx        URL에 맞는 실제 화면
  -> components/kiosk/*.jsx   페이지 안 재사용 UI
  -> store / utils            장바구니·가격·수량 한도
```

## 현재 라우트 (코드 실측)

| 경로 | 페이지 | 동작 수준 | 관련 WBS |
| --- | --- | --- | --- |
| `/` | `HomePage` | 매장/포장 선택 → `/menu` | WBS2-017 |
| `/menu` | `MenuListPage` | mock 카테고리·메뉴·장바구니 합계 | WBS2-018 |
| `/menu/:menuId` | `MenuDetailPage` | 옵션·담기·가격·수량 한도 | WBS2-019~021 |
| `/cart` | `CartPage` | 수량·삭제·비우기·결제 이동 | WBS2-025 |
| `/payment` | `PaymentPage` | UI·금액 표시, **수단 선택/결제 disabled** | WBS2-026 |
| `/complete` | `OrderCompletePage` | UI shell, 주문번호 미연결 | WBS2-028 |
| `/payment-error` | `PaymentErrorPage` | 정적, flow 미연결 | WBS2-027 |
| `/timeout` | `TimeoutPage` | 정적, 타이머 미연결 | WBS2-029~030 |
| `/accessibility` | `AccessibilityPage` | 정적 | WBS2-015 연계 |
| `/receipt` | `ReceiptPage` | Future Scope (SCR-023) | — |

## 폴더는 언제 사용하나요?

| 폴더 | 판단 기준 | 현재 상태 |
| --- | --- | --- |
| `pages/kiosk` | URL로 열리는 한 화면 | 핵심 페이지 구현됨 |
| `components/kiosk` | 키오스크 UI 조각 | MenuCard, OptionGroup, CartItem 등 사용 중 |
| `components/common` | 공통 UI | LoadingSpinner, EmptyState 등 |
| `api` | HTTP 요청 | 골격만; **페이지는 `public/mocks/kiosk.json` 직접 import** |
| `adapters` | API/mock → 화면 DTO | stub / 미연결 (WBS2-018~019, WBS2-057) |
| `store` | 화면 이동 후에도 유지 | `orderSessionStore` + `cartStore` 호환 export |
| `hooks` | 반복 로직 | `useKioskTimeout` 등 stub 포함 |
| `utils` | 순수 계산 | **`priceCalculation.js` · `quantityLimits.js` = 단일 기준 (건드리지 말 것)** |
| `contracts` | 화면↔API 계약 문서 | 참고용; Canonical과 충돌 시 Canonical 우선 |
| `constants` | API 경로 상수 | 아직 legacy `/api/menus` 등 — Target은 `/api/kiosk/*` |

## 핵심 규칙 (ASAK)

1. **가격**은 `utils/priceCalculation.js`만 사용한다.
2. **수량 한도**(동일 메뉴 9 · 장바구니 30)는 `utils/quantityLimits.js`만 사용한다.
3. 페이지에서 axios를 직접 치지 않는다. 나중에 `api/*` + `adapters/*`로 연결한다.
4. Canonical API 경로(문서): `GET /api/kiosk/menuList`, `GET /api/kiosk/menuDetail/{menuId}`, `POST /api/kiosk/orders`, `POST /api/kiosk/payments`  
   → 코드 상수는 아직 legacy. `DECIDED_PENDING_CODE_CHANGE`.
5. 응답 정본 필드: `totalAmount`, `approvedAmount`, `approvedAt`, `waitingOrderCount`  
   → store는 당분간 `totalPrice` 등 유지, adapter에서 매핑 (WBS2-057).

## 화면 하나를 만드는 쉬운 순서

1. `pages/kiosk`에 뼈대
2. `KioskApp.jsx`의 `<Routes>`에 URL 연결
3. 반복 UI만 `components/kiosk`로 분리
4. 데이터는 처음엔 mock → 이후 `api` + `adapter`
5. 여러 화면이 쓰는 값만 `store`

## 지금 스프린트에서 할 일 / 하지 말 일

| 할 일 | 하지 말 일 |
| --- | --- |
| 결제 수단 선택·mock 승인 → complete 연결 (WBS2-026~028) | CSS/시안 통째 교체 |
| 한도 초과 4초 토스트 (WBS2-024) | `priceCalculation` / `quantityLimits` 되돌리기 |
| 타임아웃 30/20/10초 (WBS2-029~030) | Admin 기능을 이 저장소에 새로 만들기 |
| loading/empty/error 보강 (WBS2-031) | Backend 실연동 (P6, BLOCKED) |

## 막힐 때 스스로 묻는 질문

- URL 하나 화면인가? → `pages`
- 두 곳 이상 UI인가? → `components`
- 서버/mock 요청인가? → `api` (+ 나중 `adapters`)
- 화면 이동 후도 살아 있어야 하나? → `store`
- 금액/수량인가? → `utils` (위 두 파일만)

## 관련 문서

| 문서 | 위치 |
| --- | --- |
| START_HERE | `ASAK/docs/START_HERE.md` |
| 구현 맵 | `ASAK/docs/planning/CURRENT_IMPLEMENTATION_MAP.md` |
| WBS 2.0 | `ASAK/docs/wiki/wbs-v2.md` |
| WBS 상태 메모 | `ASAK/docs/wiki/wbs-status-notes.md` |
| 3일 스프린트 | `ASAK/docs/planning/FRONTEND_WEDNESDAY_WBS_2026-07-20.md` |
| Canonical 계약 | `ASAK/docs/governance/CANONICAL_CONTRACT_DECISIONS.md` |
| Mock 안내 | `public/mocks/README.md` |
