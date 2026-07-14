# ASAK Kiosk 구조, 쉽게 시작하기

## 먼저 결론

기존에 배운 구조를 버릴 필요가 없습니다. 현재 구조는 같은 역할을 조금 더 잘게 나눈 것입니다.

```text
기존 학습 프로젝트                 ASAK Kiosk
index.js                       ->  main.jsx -> entries/kiosk.jsx
App.js                         ->  apps/kiosk/KioskApp.jsx
pages/PostListPage.jsx         ->  pages/kiosk/MenuListPage.jsx
components/NavBar.jsx          ->  components/kiosk/MenuCard.jsx
api/postApi.js                 ->  api/menu.js
context/AuthContext.jsx        ->  store/cartStore.js (공유 상태가 있을 때)
```

처음에는 **`KioskApp.jsx`, `pages/kiosk`, `components/kiosk` 세 곳**만 보아도 됩니다.

## 화면이 브라우저에 보이는 흐름

```text
main.jsx
  -> entries/kiosk.jsx        React와 BrowserRouter를 시작
  -> apps/kiosk/KioskApp.jsx  공통 헤더와 <Routes>를 렌더링
  -> pages/kiosk/*.jsx        URL에 맞는 실제 화면
  -> components/kiosk/*.jsx   페이지 안에서 재사용하는 UI 조각
```

예를 들어 메뉴 목록 화면을 만들 때는 `/menu` URL이 `MenuListPage.jsx`를 보여 주고,
그 페이지가 여러 개의 `MenuCard.jsx`를 사용합니다.

## 폴더는 언제 사용하나요?

| 폴더 | 이렇게 판단하면 됩니다 | 예시 |
| --- | --- | --- |
| `pages/kiosk` | URL로 직접 열리는 한 화면인가? | 메뉴 목록, 장바구니, 결제 |
| `components/kiosk` | 한 화면 안에서 반복되거나 다른 키오스크 화면에도 쓸 UI인가? | 메뉴 카드, 카테고리 탭 |
| `components/common` | 키오스크·관리자 모두에서 쓸 UI인가? | 버튼, 모달, 로딩 표시 |
| `api` | 서버 또는 mock 데이터에 요청하는 코드인가? | 메뉴 조회, 결제 요청 |
| `store` | 페이지를 이동해도 유지되어야 하는 값인가? | 장바구니, 매장/포장 선택 |
| `hooks` | `useState`, 로딩, 요청 처리가 여러 번 반복되는가? | `useMenu`, `useAsync` |
| `utils` | React 화면과 무관한 짧은 계산/변환 함수인가? | 금액 표시, 날짜 표시 |

`features`, `types`, `contracts`는 지금 당장 외우지 않아도 됩니다. 기능이 커질 때 참고하는 보조 폴더입니다.

## 화면 하나를 만드는 가장 쉬운 순서

### 1. 페이지부터 만듭니다

`pages/kiosk/MenuListPage.jsx`에 우선 화면의 뼈대를 작성합니다.

```jsx
export default function MenuListPage() {
  return (
    <section>
      <h1>메뉴 선택</h1>
      <p>여기에 메뉴 목록을 보여 줍니다.</p>
    </section>
  );
}
```

### 2. URL을 연결합니다

현재는 `apps/kiosk/KioskApp.jsx`의 `<Routes>`가 예전 프로젝트의 `App.js` 역할을 합니다.

```jsx
import MenuListPage from "../../pages/kiosk/MenuListPage.jsx";

// <Routes> 안에 추가
<Route path="/menu" element={<MenuListPage />} />
```

처음에는 라우터를 `KioskApp.jsx` 한 곳에서 관리합니다. `router/index.jsx`는 나중에 화면이 많아질 때 옮길 준비를 해 둔 파일입니다.

### 3. 반복되는 부분만 컴포넌트로 뺍니다

메뉴를 여러 개 표시해야 하면 `MenuCard.jsx`를 만듭니다. 페이지는 데이터를 준비하고,
카드는 메뉴 한 개를 그리는 역할만 갖게 하면 됩니다.

```jsx
// components/kiosk/MenuCard.jsx
export default function MenuCard({ menu }) {
  return <button type="button">{menu.name} · {menu.price}원</button>;
}
```

### 4. 데이터가 필요할 때 API를 연결합니다

처음에는 배열을 페이지에 직접 써도 괜찮습니다. 백엔드나 mock 연결이 필요해지는 시점에
`api/menu.js`를 사용합니다. API 호출 코드를 카드 컴포넌트 안에 넣지 않는 것이 핵심입니다.

```text
MenuListPage: 메뉴 목록을 요청하고, 로딩/오류를 처리한다.
MenuCard: 받은 메뉴 한 개를 화면에 그린다.
api/menu.js: HTTP 요청만 담당한다.
```

### 5. 다른 화면에서도 필요한 값만 store에 둡니다

장바구니처럼 메뉴 상세 → 장바구니 → 결제 화면까지 이어지는 값은 `store`에 둡니다.
한 페이지에서만 쓰는 입력값이나 모달 열림 여부는 그 페이지의 `useState`로 충분합니다.

## 주문 기능을 만들 때의 추천 순서

1. `HomePage`: 매장/포장 선택
2. `MenuListPage`: 메뉴 목록 표시
3. `MenuDetailPage`: 옵션 선택 후 장바구니 담기
4. `CartPage`: 수량·총금액 확인
5. `PaymentPage`: 결제 진행

각 단계에서 완벽하게 폴더를 나누려 하지 말고, **페이지가 보이게 만든 뒤 반복되는 것만 분리**하면 됩니다.

## 막힐 때 스스로 묻는 질문

- "이것은 URL 하나의 화면인가?" → `pages`
- "두 곳 이상에서 쓸 UI인가?" → `components`
- "서버에 요청하는가?" → `api`
- "화면을 이동해도 살아 있어야 하는가?" → `store`
- "그 외의 화면 내부 값인가?" → 해당 페이지의 `useState`

이 다섯 가지만 지키면 현재 구조를 충분히 활용할 수 있습니다.
