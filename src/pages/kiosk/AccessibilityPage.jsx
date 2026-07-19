// SCR-014 / Accessibility — Figma 134:7972
// UI 뼈대: 글자 크기 is-selected · 고대비 토글 is-on · 미리보기 영역
// 연결 예정: 설정 저장 · 전역 테마 적용
// 금지: 미리보기용 메뉴명·가격 하드코딩, 화면 전체 자동생성 React
export default function AccessibilityPage({
  fontSize = "default",
  highContrast = false,
} = {}) {
  return (
    <main
      className={`accessibility-page${highContrast ? " is-high-contrast" : ""}`}
    >
      <header className="accessibility-page__header">
        <span aria-hidden="true">←</span>
        <h1>접근성 설정</h1>
        <span aria-hidden="true">⌂</span>
      </header>
      <section className="accessibility-page__content">
        <section className="accessibility-page__font">
          <h2>글자 크기</h2>
          <p>화면의 글자 크기를 조절합니다.</p>
          <div>
            <button
              type="button"
              disabled
              className={fontSize === "default" ? "is-selected" : ""}
            >
              기본
            </button>
            <button
              type="button"
              disabled
              className={fontSize === "large" ? "is-selected" : ""}
            >
              크게
            </button>
            <button
              type="button"
              disabled
              className={fontSize === "xlarge" ? "is-selected" : ""}
            >
              아주 크게
            </button>
          </div>
        </section>
        <section className="accessibility-page__contrast">
          <div>
            <h2>고대비 모드</h2>
            <p>
              텍스트와 배경의 대비를 높여
              <br />
              가독성을 개선합니다.
            </p>
          </div>
          <button
            type="button"
            disabled
            className={highContrast ? "is-on" : ""}
            aria-label={highContrast ? "고대비 모드 켜짐" : "고대비 모드 꺼짐"}
          />
        </section>
        <section className="accessibility-page__preview">
          <h2>미리보기</h2>
          <p>
            메뉴 이름
            <br />
            0원
          </p>
        </section>
      </section>
      <footer className="accessibility-page__footer">
        <button type="button" disabled>
          되돌리기
        </button>
        <button type="button" disabled>
          적용하기
        </button>
      </footer>
    </main>
  );
}
