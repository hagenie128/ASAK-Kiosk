/**
 * URL과 화면을 연결하는 라우터 자리입니다.
 *
 * 예전에 배운 프로젝트에서는 App.js 안에 <Routes>를 바로 작성했습니다.
 * 현재도 그 방식이 적용되어 있으며, 실제 <Routes>는
 * `src/apps/kiosk/KioskApp.jsx`에 있습니다.
 *
 * 이 파일은 "라우팅 코드는 여기서 찾는다"는 약속을 위한 자리입니다.
 * 화면 수가 더 많아져 KioskApp.jsx가 길어질 때, 그때 Routes 부분을 이 파일로
 * 옮기면 됩니다. 지금은 한 곳(KioskApp.jsx)에서만 관리하는 편이 더 쉽습니다.
 *
 * 처음 화면을 추가하는 순서
 * 1. `pages/kiosk`에 XxxPage.jsx를 만든다.
 * 2. KioskApp.jsx의 <Routes>에 <Route path="/xxx" ... />를 추가한다.
 * 3. 공통으로 쓸 UI가 생기면 `components/kiosk`로 분리한다.
 */
