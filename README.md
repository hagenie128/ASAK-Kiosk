# ASAK Frontend

<<<<<<< HEAD
React + Vite 기반 ASAK 키오스크 프론트엔드 폴더입니다.

## 처음 받았을 때 셋팅

PowerShell에서 아래 순서대로 실행합니다.

```powershell
cd .\frontend
npm.cmd install
```

`npm install`이 PowerShell 실행 정책 때문에 막히면 `npm.cmd install`을 사용합니다.

## 개발 서버 실행

```powershell
cd .\frontend
npm.cmd run dev
```

브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:5173/
```

Vite는 React 화면을 빠르게 띄워주는 개발 서버/빌드 도구입니다. React 코드는 `src/` 안에서 작성합니다.

## 빌드

```powershell
cd .\frontend
npm.cmd run build
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

## 주요 폴더

```text
frontend/
  index.html
  package.json
  vite.config.js
  public/      # 필요할 때 직접 생성, 이미지/폰트 같은 정적 파일
  src/
    main.jsx
    App.jsx
    styles.css
  dist/        # 빌드 결과, Git에 올리지 않음
```

## 데이터 경계

- 프론트 코드만 이 폴더에 둡니다.
- 데이터 파이프라인 산출물, seed JSON, 메뉴 이미지는 이 폴더에 넣지 않습니다.
- 필요한 데이터는 루트의 아래 폴더를 참조합니다.
  - `../data-pipeline/phase1/output/`
  - `../asak-data/seed/`
  - `../asak-data/images/menu/`
=======
React와 Vite로 만드는 키오스크·관리자 웹 화면입니다. 모든 프론트 작업은 이 `frontend/` 폴더에서 합니다.

> 현재 `src/`는 **학습용 골격**입니다. 페이지·라우터·API의 구현 코드는 intentionally 비워 두었으므로 `npm run dev`로 완성된 화면은 표시되지 않습니다. 파일 역할을 이해한 뒤 팀이 직접 구현을 채워 넣는 기준점으로 사용합니다.

## 먼저 볼 파일 — 필수 읽기 순서

코드를 쓰기 전에 아래 순서로 읽습니다. 이 순서는 "무엇을 만들지" → "어떤 데이터를 쓸지" → "어디에 구현할지"를 맞추기 위한 것입니다.

| 순서 | 파일 | 확인할 내용 |
| --- | --- | --- |
| 1 | [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) | 7/14~7/22 작업 순서, 화면별 완료 기준, 협업·브랜치 규칙 |
| 2 | [`src/contracts/api-data-contract.md`](src/contracts/api-data-contract.md) | API-001~020 요청/응답 필드, 장바구니·주문 상태 데이터 |
| 3 | [`src/contracts/requirements-screen-map.md`](src/contracts/requirements-screen-map.md) | 요구사항 → 화면 → 데이터 연결과 MVP/확장 구분 |
| 4 | [`src/README.md`](src/README.md) | `api`, `store`, `components`, `pages` 폴더의 역할 |
| 5 | [`src/constants/routes.js`](src/constants/routes.js) | 만들 화면의 URL과 SCR ID. `SCR-002`, `SCR-006`은 병합돼 별도 라우트를 만들지 않음 |
| 6 | [`src/constants/order.js`](src/constants/order.js), [`src/constants/status.js`](src/constants/status.js) | `EAT_IN`, `TAKE_OUT`, 주문·결제 상태값의 단일 기준 |
| 7 | [`src/store/cartStore.js`](src/store/cartStore.js), [`src/store/orderStore.js`](src/store/orderStore.js) | 화면 간 공유할 장바구니·`orderType`·주문 결과의 저장 위치 |
| 8 | 만들 화면의 `pages/`, `components/`, `api/` 파일 | 실제 마크업·재사용 UI·mock 호출을 작성할 자리 |

### 화면별 빠른 길잡이

| 담당 화면 | 먼저 볼 계약/파일 |
| --- | --- |
| `SCR-001` 홈 | `orderStore.js` → `constants/order.js` → `HomePage.jsx` |
| `SCR-003` 메뉴 선택 | `api/category.js`, `api/menu.js` → `CategoryTabs.jsx`, `MenuCard.jsx` → `MenuListPage.jsx` |
| `SCR-004` 메뉴 상세/옵션 | API-003/004 계약 → `OptionGroup.jsx` → `MenuDetailPage.jsx` → `cartStore.js` |
| `SCR-005` 장바구니 | `cartStore.js` → `cartRules.js` → `CartItem.jsx`, `ConfirmDialog.jsx` → `CartPage.jsx` |
| `SCR-007/008` 결제/완료 | `api/payment.js` → `useOrder.js` → `PaymentPage.jsx`, `OrderCompletePage.jsx` |
| `SCR-009/010` 관리자 주문 | API-007/008 계약 → `OrderTable.jsx`, `OrderStatusBadge.jsx` → 주문 페이지 |
| `SCR-011` 품절 | API-009/010 계약 → `soldOutPolicy.js`, `SoldOutToggle.jsx` → `SoldOutManagePage.jsx` |
| 관리자 확장 | API-011~015 계약 → 메뉴·결제수단·매출 페이지 |

### 구현 시작 전 체크

- 공통 파일(`router`, `store`, `constants`, `public/mocks`)을 수정하기 전에 팀원에게 먼저 알린다.
- mock의 필드명은 API 명세 JSON을 그대로 쓴다. `optionItemId`를 임의로 `optionId`로 바꾸지 않는다.
- 결제 실패 때 장바구니를 비우지 않는다. `paymentStatus === "APPROVED"`일 때만 초기화한다.
- `SCR-005` 컨펌과 `SCR-012` 결제 실패 안내는 라우트가 아니라 모달/오버레이로 만든다.

## 시작하기

```powershell
cd frontend
npm install
npm run dev
```

구현을 시작한 뒤 브라우저에서 `http://localhost:5173`을 열면 됩니다. 종료는 터미널에서 `Ctrl+C`입니다.

## Vite를 쉽게 이해하기

Vite는 React 코드를 브라우저에서 실행할 수 있게 해 주는 **개발 서버와 빌드 도구**입니다.

- `npm run dev`: 개발 서버를 열고, 파일을 저장하면 화면을 거의 즉시 새로 고칩니다.
- `npm run build`: 배포용 파일을 `dist/`에 만듭니다.
- `npm run preview`: 방금 만든 배포본을 로컬에서 확인합니다.
- `index.html`: 앱이 처음 로드되는 한 장의 HTML 파일입니다.
- `src/main.jsx`: React 앱을 HTML에 연결하는 시작점입니다.
- `src/App.jsx`: 라우터를 렌더링하는 최상위 컴포넌트입니다.

환경변수는 `VITE_`로 시작해야 브라우저 코드에서 읽을 수 있습니다. 예: `VITE_API_BASE_URL=http://localhost:8080`.

## 폴더 규칙

현재 파일을 아래 역할로 유지·확장합니다.

```text
frontend/
├─ public/                     # 그대로 제공할 이미지·mock JSON
├─ src/
│  ├─ api/                     # Axios 요청 함수: menu.js, order.js, admin.js
│  ├─ components/
│  │  ├─ common/               # Button, Header, Footer처럼 재사용 UI
│  │  ├─ kiosk/                # MenuCard, CategoryTabs 등 키오스크 UI
│  │  └─ admin/                # AdminSidebar, OrderStatusBadge 등 관리자 UI
│  ├─ constants/               # routes.js, 주문 상태/결제수단 상수
│  ├─ layouts/                 # KioskLayout, AdminLayout
│  ├─ pages/
│  │  ├─ kiosk/                # 화면 단위: HomePage, MenuListPage, CartPage...
│  │  └─ admin/                # 화면 단위: OrderListPage, SalesSummaryPage...
│  ├─ router/                  # index.jsx: URL ↔ 페이지 연결
│  ├─ store/                   # 화면 간 공유 상태: cartStore, orderStore
│  ├─ styles/                  # tokens.css(색상/간격), global.css(공통 스타일)
│  ├─ App.jsx                  # RouterProvider만 렌더링
│  └─ main.jsx                 # React 시작점
├─ .env.example                # 환경변수 예시
├─ jsconfig.json               # @/ 별칭을 VS Code가 인식하도록 설정
└─ vite.config.js              # Vite 설정 및 @/ 별칭
```

새 파일은 가능한 한 `기능` 기준으로 둡니다. 예를 들어 메뉴 목록 API는 `api/menu.js`, 메뉴 카드 UI는 `components/kiosk/MenuCard.jsx`, 메뉴 목록 화면은 `pages/kiosk/MenuListPage.jsx`에 둡니다.

`@/` 별칭을 사용할 수 있습니다. 예를 들어 긴 상대 경로 대신 다음처럼 작성합니다.

```jsx
import Button from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";
```

## 현재 사용하는 라이브러리

| 라이브러리 | 용도 | 사용 위치 |
| --- | --- | --- |
| `react`, `react-dom` | 화면 컴포넌트 렌더링 | 전체 |
| `vite`, `@vitejs/plugin-react` | 개발 서버·빌드·React 변환 | 개발 도구 |
| `react-router-dom` | 키오스크/관리자 URL 이동 | `src/router/` |
| `axios` | 백엔드 REST API 호출 | `src/api/client.js` |
| `zustand` | 장바구니·주문처럼 화면을 넘는 상태 | `src/store/` |
| `eslint` | 코드 문법·스타일 점검 | `npm run lint` |

지금 단계에서는 위 라이브러리만으로 충분합니다. 폼 검증이 많아지는 관리자 메뉴 등록 화면에서만 `react-hook-form`, `zod`, `@hookform/resolvers`를 추가합니다. 서버 데이터 캐시·로딩 상태가 복잡해질 때만 `@tanstack/react-query`를 추가합니다.

## 구현 순서

1. `api/client.js`에 `VITE_API_BASE_URL`과 공통 오류 처리를 둡니다.
2. `api/menu.js` → 메뉴/카테고리 조회, `api/order.js` → 주문/결제, `api/admin.js` → 관리자 API를 구현합니다.
3. `store/cartStore.js`에는 장바구니만, `store/orderStore.js`에는 주문 유형·주문 완료 정보만 넣습니다.
4. 페이지는 데이터를 조합하고, 재사용되는 버튼·카드·모달은 `components/`로 분리합니다.
5. 매 기능마다 `npm run lint`와 `npm run build`를 실행합니다.

`dist/`와 `node_modules/`는 생성물이라 직접 수정하지 않습니다.

## 팀 구현 계획

고객 주문·관리자 mock 화면을 7/22까지 직접 구현하는 상세 순서와 협업 규칙은 [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)를 기준으로 합니다.

## 통합·개별 프론트 저장소 동기화

ASAK 통합 저장소의 `frontend/` 폴더와 개별 프론트 저장소를 **손으로 복사해서 따로 관리하지 않습니다.** 수동 복사는 어느 쪽이 최신인지 알기 어렵고, 병합 때 충돌이 커집니다.

| 저장소 | 역할 |
| --- | --- |
| `https://github.com/hagenie128/ASAK` | 통합 저장소. `frontend/`, 백엔드·DB·문서를 함께 관리 |
| `https://github.com/hagenie128/ASAK-front` | `frontend/` 폴더만 분리해 보는 프론트 전용 저장소 |
| `https://github.com/hagenie128/ASAK-back` | 백엔드 전용 저장소. 프론트 변경은 올리지 않음 |

### 프론트 전용 저장소로 내보내기

통합 저장소 루트(`C:\ha-team`)에서 실행합니다. 처음 한 번만 remote를 등록합니다.

```powershell
git remote add frontend-upstream https://github.com/hagenie128/ASAK-front.git
```

그다음 `frontend/` 폴더의 커밋 이력만 프론트 저장소 `main` 브랜치로 보냅니다.

```powershell
git subtree push --prefix=frontend frontend-upstream main
```

### 실행 전 확인

```powershell
git status
git remote -v
```

- `node_modules/`, `dist/`, 실제 `.env` 값은 커밋하거나 동기화하지 않습니다.
- `ASAK-front`에 다른 이력이 있어 push가 거절되면 **강제 push를 하지 않습니다.** 오류 메시지를 공유하고 이력 병합 방법을 먼저 정합니다.
- 프론트 구현은 먼저 통합 저장소의 `frontend/`에서 커밋한 뒤 subtree로 내보냅니다.
- 백엔드 변경은 `ASAK-back`에 별도로 관리하며, 이번 프론트 문서 변경 대상에는 포함하지 않습니다.
>>>>>>> origin/main
