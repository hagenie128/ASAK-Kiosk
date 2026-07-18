import React from "react";

/**
 * 목록·검색 결과가 없을 때 쓰는 공통 Empty UI.
 * Figma Shared/EmptyState 대응 (제목 + 설명 + 선택 액션).
 */
export default function EmptyState({
  title = "표시할 메뉴가 없어요",
  description = "다른 카테고리를 선택하거나 잠시 후 다시 시도해 주세요.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state-panel" role="status">
      <p className="empty-state-panel__title">{title}</p>
      {description ? (
        <p className="empty-state-panel__description">{description}</p>
      ) : null}
      {actionLabel && typeof onAction === "function" ? (
        <button
          type="button"
          className="empty-state-panel__action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
