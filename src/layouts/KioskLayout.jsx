import { Outlet } from "react-router-dom";

// 키오스크(고객) 화면 공통 레이아웃. SCR-013 타임아웃 자동 초기화 감시도
// 여기서 붙이면 모든 키오스크 화면에 자동 적용된다. (TODO: TimeoutWatcher 연결)
export default function KioskLayout() {
  return (
    <div className="kiosk-shell">
      <Outlet />
    </div>
  );
}
