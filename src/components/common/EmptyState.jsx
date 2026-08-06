// Figma Shared/EmptyState 정적 UI 뼈대.
import empty_box_icon from "@/assets/modal_icon/empty_box_icon.svg"

export default function EmptyState() {
  return (
    <section className="empty-state-panel" aria-live="polite">
      <img className="empty-state-panel__icon" src={empty_box_icon} alt="" aria-hidden="true" />
      <h2 className="empty-state-panel__title">데이터가 없습니다</h2>
      <p className="empty-state-panel__description">표시할 내용이 없습니다.</p>
      <button type="button" className="empty-state-panel__action" >새로고침</button>
    </section>
  );
}
