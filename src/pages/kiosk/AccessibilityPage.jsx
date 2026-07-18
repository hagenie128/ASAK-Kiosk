// 학습용 자리표시자: 접근성 설정 화면입니다.
export default function AccessibilityPage() {
  return (
    <main className="accessibility-page">
      <header className="accessibility-page__header">
        <span aria-hidden="true">←</span>
        <h1>접근성 설정</h1>
        <span aria-hidden="true" />
      </header>
      <section className="accessibility-page__content">
        <p>모든 고객이 편하게 주문할 수 있도록 화면을 설정합니다.</p>
        <div className="accessibility-page__setting">
          <div>
            <strong>고대비 모드</strong>
            <span>텍스트와 배경의 대비를 높입니다.</span>
          </div>
          <button type="button" disabled aria-label="고대비 모드 준비 중" />
        </div>
        <div className="accessibility-page__setting">
          <div>
            <strong>큰 글자</strong>
            <span>화면의 글자 크기를 크게 표시합니다.</span>
          </div>
          <button type="button" disabled aria-label="큰 글자 준비 중" />
        </div>
      </section>
    </main>
  );
}
