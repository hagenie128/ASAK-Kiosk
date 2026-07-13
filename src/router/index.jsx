import { createBrowserRouter } from "react-router-dom";
import KioskLayout from "../layouts/KioskLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/kiosk/HomePage";
import MenuListPage from "../pages/kiosk/MenuListPage";
import MenuDetailPage from "../pages/kiosk/MenuDetailPage";
import CartPage from "../pages/kiosk/CartPage";
import PaymentPage from "../pages/kiosk/PaymentPage";
import OrderCompletePage from "../pages/kiosk/OrderCompletePage";
import AccessibilityPage from "../pages/kiosk/AccessibilityPage";

import LoginPage from "../pages/admin/LoginPage";
import OrderListPage from "../pages/admin/OrderListPage";
import OrderDetailPage from "../pages/admin/OrderDetailPage";
import MenuManagePage from "../pages/admin/MenuManagePage";
import MenuEditPage from "../pages/admin/MenuEditPage";
import SoldOutManagePage from "../pages/admin/SoldOutManagePage";
import PaymentMethodPage from "../pages/admin/PaymentMethodPage";
import SalesSummaryPage from "../pages/admin/SalesSummaryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <KioskLayout />,
    children: [
      { index: true, element: <HomePage /> }, // SCR-001
      { path: "menu", element: <MenuListPage /> }, // SCR-003
      { path: "menu/:menuId", element: <MenuDetailPage /> }, // SCR-004
      { path: "cart", element: <CartPage /> }, // SCR-005
      { path: "payment", element: <PaymentPage /> }, // SCR-007
      { path: "order-complete", element: <OrderCompletePage /> }, // SCR-008
      { path: "accessibility", element: <AccessibilityPage /> }, // SCR-014
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "login", element: <LoginPage /> }, // SCR-015
      { index: true, element: <OrderListPage /> }, // SCR-009 (기본 진입 화면)
      { path: "orders", element: <OrderListPage /> }, // SCR-009
      { path: "orders/:orderId", element: <OrderDetailPage /> }, // SCR-010
      { path: "menus", element: <MenuManagePage /> }, // SCR-016
      { path: "menus/new", element: <MenuEditPage /> }, // SCR-017
      { path: "menus/:menuId/edit", element: <MenuEditPage /> }, // SCR-017
      { path: "sold-out", element: <SoldOutManagePage /> }, // SCR-011
      { path: "payment-methods", element: <PaymentMethodPage /> }, // SCR-018
      { path: "sales", element: <SalesSummaryPage /> }, // SCR-019
    ],
  },
]);
