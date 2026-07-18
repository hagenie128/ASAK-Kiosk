import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="kiosk-header">
      <button
        type="button"
        className="kiosk-header__back"
        onClick={() => navigate(-1)}
        aria-label="이전 화면"
      >
        ←
      </button>
      <div className="kiosk-header__logo">ASAK</div>
      <Link className="kiosk-header__home" to="/" aria-label="홈으로 이동">
        ⌂
      </Link>
    </header>
  );
}
