import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import KioskApp from "../apps/kiosk/KioskApp.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <KioskApp />
    </BrowserRouter>
  </React.StrictMode>,
);
