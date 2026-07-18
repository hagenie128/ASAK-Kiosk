export default function AccessibilityPage() {
  return <main className="accessibility-page">
    <header className="accessibility-page__header"><span aria-hidden="true">←</span><h1>접근성 설정</h1><span aria-hidden="true">⌂</span></header>
    <section className="accessibility-page__content">
      <section className="accessibility-page__font"><h2>글자 크기</h2><p>화면의 글자 크기를 조절합니다.</p><div><button type="button" disabled className="is-selected">기본</button><button type="button" disabled>크게</button><button type="button" disabled>아주 크게</button></div></section>
      <section className="accessibility-page__contrast"><div><h2>고대비 모드</h2><p>텍스트와 배경의 대비를 높여<br />가독성을 개선합니다.</p></div><button type="button" disabled aria-label="고대비 모드 꺼짐" /></section>
      <section className="accessibility-page__preview"><h2>미리보기</h2><p>로스트닭다리살 샐러드<br />9,900원</p></section>
    </section>
    <footer className="accessibility-page__footer"><button type="button" disabled>되돌리기</button><button type="button" disabled>적용하기</button></footer>
  </main>;
}
