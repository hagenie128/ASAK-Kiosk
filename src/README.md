# 학습용 프론트엔드 골격

이 폴더에는 구현 코드를 넣지 않았습니다. 각 파일은 역할을 알려 주는 자리표시자입니다.

시작 전에는 상위 [`../README.md`](../README.md)의 **먼저 볼 파일** 표와 [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md)을 먼저 읽습니다. 이 파일은 폴더별 역할을 찾을 때 사용합니다.

- `main.jsx` → React 앱을 브라우저에 연결
- `App.jsx` → 라우터 또는 최상위 화면 렌더링
- `api/` → 백엔드 HTTP 요청
- `components/` → 여러 화면에서 재사용할 UI 조각
- `layouts/` → 키오스크·관리자 공통 외곽 화면
- `pages/` → URL 한 개에 대응하는 화면
- `router/` → URL과 페이지 연결
- `store/` → 장바구니 등 공유 상태
- `styles/` → 색상·간격·전역 CSS

추가 기능 폴더도 준비했습니다.

- `hooks/` → 반복되는 화면 로직(로딩, 타임아웃, 데이터 조회)
- `features/` → 장바구니·주문·품절처럼 여러 파일이 함께 필요한 기능 규칙
- `utils/` → 금액·날짜·API 오류 변환 같은 순수 함수
- `types/` → 메뉴·주문·결제 데이터 모양을 적는 JSDoc 기준
- `mocks/` → 백엔드 연결 전 사용할 화면용 샘플 데이터

처음 구현할 때는 `main.jsx` → `App.jsx` → `router/index.jsx` → `pages/kiosk/HomePage.jsx` 순서로 채우면 됩니다.

기능별로는 `api/`(통신) → `store/` 또는 `features/`(상태·규칙) → `components/`(UI 조각) → `pages/`(화면 조립) 순서로 살펴보면 됩니다.

API 명세와 요구사항에서 합쳐야 하는 데이터는 [contracts/api-data-contract.md](contracts/api-data-contract.md), [contracts/requirements-screen-map.md](contracts/requirements-screen-map.md)에 정리했습니다.
