import { Outlet, Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <nav>
          <Link to={ROUTES.ADMIN_ORDERS}>주문 관리</Link>
          <Link to={ROUTES.ADMIN_MENUS}>메뉴 관리</Link>
          <Link to={ROUTES.ADMIN_SOLD_OUT}>품절 관리</Link>
          <Link to={ROUTES.ADMIN_SALES}>매출 요약</Link>
          <Link to={ROUTES.ADMIN_PAYMENT_METHODS}>결제수단 설정</Link>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
