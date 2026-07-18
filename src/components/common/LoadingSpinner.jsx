import React from "react";

/** 목록·상세 로딩 중 표시. */
export default function LoadingSpinner({ label = "불러오는 중…" }) {
  return (
    <div className="loading-state-panel" role="status" aria-live="polite">
      <div className="loading-state-panel__spinner" aria-hidden="true" />
      <p className="loading-state-panel__label">{label}</p>
    </div>
  );
}
