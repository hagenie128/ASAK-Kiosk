# ASAK Frontend

React와 Vite로 만드는 키오스크·관리자 웹 화면입니다. 모든 프론트 작업은 이 `frontend/` 폴더에서 합니다.

> 현재 `src/`는 **학습용 골격**입니다. 페이지·라우터·API의 구현 코드는 intentionally 비워 두었으므로 `npm run dev`로 완성된 화면은 표시되지 않습니다. 파일 역할을 이해한 뒤 팀이 직접 구현을 채워 넣는 기준점으로 사용합니다.

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
