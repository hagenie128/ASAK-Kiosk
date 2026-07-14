import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  // 뒤로가기 네비게이트 적용
  const navigate = useNavigate();

  return (
    <>
      <header className="kiosk-header">
        <button onClick={() => navigate(-1)}>뒤로가기 아이콘</button>
        <div className="header-logo">LOGO</div>
        <Link to={"/"} className="header-home">
          집
        </Link>
      </header>
    </>
  );
}
