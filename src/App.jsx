const flow = [
  ["01", "주문 시작", "매장/포장을 선택합니다.", "SCR-001 · API-001"],
  ["02", "메뉴·옵션 선택", "메뉴 상세, 재료 제외, 토핑을 구성합니다.", "SCR-003~004 · API-002~004"],
  ["03", "주문·결제", "장바구니를 확인하고 가상 결제를 진행합니다.", "SCR-005~008 · API-005~006"],
  ["04", "관리자 처리", "주문을 확인하고 접수·준비중·완료 상태를 관리합니다.", "SCR-010 · API-007~008"],
];

const metrics = [
  ["순매출", "승인 결제 − 취소·환불"],
  ["주문 수", "기간별 완료·취소 주문"],
  ["인기 메뉴", "판매 수량·메뉴별 매출"],
  ["품절 관리", "메뉴·재료·옵션 항목 상태"],
];

export default function App() {
  return (
    <main className="site-shell">
      <nav className="nav">
        <strong>ASAK</strong>
        <span>SMART SALAD KIOSK</span>
        <a href="#admin">관리자 기능</a>
      </nav>

      <section className="hero">
        <p className="eyebrow">KIOSK ORDER EXPERIENCE</p>
        <h1>빠르게 고르고,<br />정확하게 주문하는 ASAK</h1>
        <p className="summary">
          샐러드·볼 주문에 맞춘 키오스크입니다. 메뉴 선택부터 옵션 구성,
          결제와 관리자 주문 처리까지 하나의 흐름으로 연결합니다.
        </p>
        <div className="hero-actions">
          <button type="button">주문 흐름 보기</button>
          <a href="#flow">시나리오 기준 확인</a>
        </div>
      </section>

      <section id="flow" className="section">
        <div className="section-title">
          <p className="eyebrow">CUSTOMER FLOW</p>
          <h2>고객 주문 흐름</h2>
        </div>
        <div className="flow-grid">
          {flow.map(([number, title, text, ref]) => (
            <article className="flow-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <small>{ref}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-band">
        <div>
          <p className="eyebrow">OPTION & SOLD OUT</p>
          <h2>재료는 빼고, 옵션은 더하고.<br />품절은 즉시 반영합니다.</h2>
        </div>
        <ul>
          <li>기본 재료 제외 및 추가 옵션 수량 선택</li>
          <li>메뉴·재료·옵션 항목별 SOLD OUT 표시</li>
          <li>결제 실패 시 장바구니 유지 및 재시도 안내</li>
        </ul>
      </section>

      <section id="admin" className="section admin">
        <div className="section-title">
          <p className="eyebrow">ADMIN CONSOLE</p>
          <h2>관리자는 주문과 매출을 한눈에</h2>
          <p>주문번호, 매장/포장, 결제·주문 상태를 확인하고 상태를 변경합니다.</p>
        </div>
        <div className="metric-grid">
          {metrics.map(([title, text]) => (
            <article className="metric" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <p className="admin-note">매출은 일별·시간대별 매출과 인기 메뉴를 기준으로 조회합니다. · API-015</p>
      </section>

      <footer>ASAK · 이하진 & 김나연 · Scenario-driven kiosk project</footer>
    </main>
  );
}
