import { Link, NavLink, Route, Routes } from "react-router-dom";
import HomePage from "../../pages/kiosk/HomePage.jsx";
import "../../styles/commonStyle.css";

// const screens = [
//   ["/", "주문 유형", "매장 식사 또는 포장을 선택합니다.", "SCR-001"],
//   ["/menu", "메뉴 선택", "카테고리와 메뉴를 고릅니다.", "SCR-003"],
//   ["/cart", "장바구니", "옵션과 수량, 주문 금액을 확인합니다.", "SCR-005"],
//   ["/payment", "결제", "결제 진행 및 실패 복구를 처리합니다.", "SCR-007"],
// ];
// function KioskScreen({ title, description, screenId }) {
//   return (
//     <section className="kiosk-screen">
//       <p className="screen-id">{screenId}</p>
//       <h1>{title}</h1>
//       <p>{description}</p>
//       <p className="screen-note">
//         화면 기능은 키오스크 작업 범위에서 이 위치에 구현합니다.
//       </p>
//     </section>
//   );
// }

// 아직 페이지별 기능을 만들기 전의 임시 화면입니다.
// 실제 구현을 시작하면 각 URL에 해당하는 pages/kiosk의 Page 컴포넌트로 바꿉니다.

export default function KioskApp() {
  return (
    <div className="kiosk-viewport">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/menu" element={<MenuListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} /> */}
      </Routes>
    </div>
  );
}
