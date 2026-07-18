import React from "react";

/**
 * API·네트워크 실패 안내. 재시도 버튼은 canRetry일 때만 노출.
 */
export default function ErrorMessage({
  title = "메뉴를 불러오지 못했어요",
  message = "네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
  canRetry = true,
  onRetry,
}) {
  return (
    <div className="error-state-panel" role="alert">
      <p className="error-state-panel__title">{title}</p>
      {message ? <p className="error-state-panel__message">{message}</p> : null}
      {canRetry && typeof onRetry === "function" ? (
        <button
          type="button"
          className="error-state-panel__retry"
          onClick={onRetry}
        >
          다시 시도
        </button>
      ) : null}
    </div>
  );
}
