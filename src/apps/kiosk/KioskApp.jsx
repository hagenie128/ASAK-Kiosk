import { Link, NavLink, Route, Routes } from "react-router-dom";
import HomePage from "../../pages/kiosk/HomePage.jsx";
import MenuListPage from "../../pages/kiosk/MenuListPage.jsx";
import "../../styles/commonStyle.css";
import "../../styles/reset.css";


// 아직 페이지별 기능을 만들기 전의 임시 화면입니다.
// 실제 구현을 시작하면 각 URL에 해당하는 pages/kiosk의 Page 컴포넌트로 바꿉니다.

export default function KioskApp() {
  return (
    <div className="kiosk-viewport">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuListPage />} />
      </Routes>
    </div>
  );
}
