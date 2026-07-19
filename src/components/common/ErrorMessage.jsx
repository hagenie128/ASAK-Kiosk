// Figma Shared/ErrorState 정적 UI 뼈대 (load | save | payment | notFound).
// TODO: 오류 코드, 재시도, 취소 동작은 apiError/화면 로직에서 직접 연결한다.
export default function ErrorMessage() {
  return (
    <section className="error-state-panel" role="alert">
      <span className="error-state-panel__icon" aria-hidden="true" />
      <h2 className="error-state-panel__title">오류가 발생했습니다</h2>
      <p className="error-state-panel__message">다시 시도해주세요.</p>
      <div className="error-state-panel__actions">
        <button type="button" className="error-state-panel__retry" disabled>다시 시도</button>
      </div>
    </section>
  );
}
