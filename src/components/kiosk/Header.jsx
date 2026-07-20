import React from "react";
import { Link, useNavigate } from "react-router-dom";
import backIcon from "../../assets/figma/icon-kiosk-back.svg";
import homeIcon from "../../assets/figma/icon-kiosk-home.svg";
import headerLogo from "../../assets/svg/logo-L.svg";

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
        <img alt="" src={backIcon} />
      </button>
      <img className="kiosk-header__logo" alt="ASAK" src={headerLogo} />
      <Link className="kiosk-header__home" to="/" aria-label="홈으로 이동">
        <img alt="" src={homeIcon} />
      </Link>
    </header>
  );
}
