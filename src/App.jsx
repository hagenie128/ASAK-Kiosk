import { Routes, Route, Link } from "react-router-dom";
const flow = [
  ["01", "주문 시작", "매장/포장을 선택합니다.", "SCR-001 · API-001"],
  [
    "02",
    "메뉴·옵션 선택",
    "메뉴 상세, 재료 제외, 토핑을 구성합니다.",
    "SCR-003~004 · API-002~004",
  ],
  [
    "03",
    "주문·결제",
    "장바구니를 확인하고 가상 결제를 진행합니다.",
    "SCR-005~008 · API-005~006",
  ],
  [
    "04",
    "관리자 처리",
    "주문을 확인하고 접수·준비중·완료 상태를 관리합니다.",
    "SCR-010 · API-007~008",
  ],
];

const metrics = [
  ["순매출", "승인 결제 − 취소·환불"],
  ["주문 수", "기간별 완료·취소 주문"],
  ["인기 메뉴", "판매 수량·메뉴별 매출"],
  ["품절 관리", "메뉴·재료·옵션 항목 상태"],
];

export default function App() {
  return (
    <div className="kiosk-viewport">
      <nav className="nav">
        <Link to="/admin">관리자 기능</Link>
      </nav>
      {/* 페이지 이동 경로 작성 */}
      <Routes>
        <Route path="/" />
        <Route path="/menu" />
        <Route path="/admin" />
      </Routes>

      <footer>ASAK · 이하진 & 김나연</footer>
    </div>
  );
}
