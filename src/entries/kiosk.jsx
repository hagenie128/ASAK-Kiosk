import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import KioskApp from "../apps/kiosk/KioskApp.jsx";

// BrowserRouter가 URL 변경을 감지하고, KioskApp 안의 <Routes>가
// 알맞은 페이지를 골라 화면에 보여 줍니다.
createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><KioskApp /></BrowserRouter></React.StrictMode>,
);
