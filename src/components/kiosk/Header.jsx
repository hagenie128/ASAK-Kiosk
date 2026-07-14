import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  // 뒤로가기 네비게이트 적용
  const navigate = useNavigate();

  return (
    <>
      <header>
        <button onClick={() => navigate(-1)}>뒤로가기 아이콘</button>
        <div >LOGO</div>
        <Link to={"/"}>
          집
        </Link>
      </header>
    </>
  );
}
