// Figma Shared/EmptyState 정적 UI 뼈대.
// TODO: type(cart/orders/searchResult), 문구, CTA는 팀이 화면 로직에서 연결한다.
export default function EmptyState() {
  return (
    <section className="empty-state-panel" aria-live="polite">
      <span className="empty-state-panel__icon" aria-hidden="true" />
      <h2 className="empty-state-panel__title">데이터가 없습니다</h2>
      <p className="empty-state-panel__description">표시할 내용이 없습니다.</p>
      <button type="button" className="empty-state-panel__action" disabled>새로고침</button>
    </section>
  );
}
