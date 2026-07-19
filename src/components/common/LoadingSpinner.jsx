// Figma Shared/LoadingState 정적 UI 뼈대 (card | table | page | button).
// TODO: 실제 노출 조건과 요청 중복 방지는 팀이 화면/스토어에서 직접 연결한다.
export default function LoadingSpinner() {
  return (
    <div className="loading-state-panel" role="status" aria-live="polite">
      <span className="loading-state-panel__spinner" aria-hidden="true" />
      <p className="loading-state-panel__label">불러오는 중…</p>
    </div>
  );
}
