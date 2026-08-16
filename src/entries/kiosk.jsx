import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import KioskApp from "../apps/kiosk/KioskApp.jsx";

function isInstalledPwa() {
  return window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

async function enterPortraitFullscreen() {
  if (!isInstalledPwa() || document.fullscreenElement || !document.documentElement.requestFullscreen) {
    return;
  }

  try {
    await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    await window.screen.orientation?.lock?.("portrait");
  } catch {
    // Android Chrome 정책 또는 기기 지원 여부에 따라 거부될 수 있으며 앱 흐름은 유지한다.
  }
}

function bindFullscreenFallback() {
  const onFirstInput = async () => {
    await enterPortraitFullscreen();
    if (document.fullscreenElement) {
      window.removeEventListener("pointerdown", onFirstInput, true);
      window.removeEventListener("keydown", onFirstInput, true);
    }
  };

  window.addEventListener("pointerdown", onFirstInput, { capture: true, passive: true });
  window.addEventListener("keydown", onFirstInput, true);
}

bindFullscreenFallback();

// BrowserRouter가 URL 변경을 감지하고, KioskApp 안의 <Routes>가
// 알맞은 페이지를 골라 화면에 보여 줍니다.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <KioskApp />
    </BrowserRouter>
  </React.StrictMode>,
);
