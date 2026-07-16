//수정 작업 할 것.

import React from 'react';

export default function MenuDetailFooter({ disabled, onBack, onConfirm }) {
  return (
    <footer className="menu-detail-footer">
      <button type="button" onClick={onBack}>
        이전
      </button>
      <button type="button" onClick={onConfirm} disabled={disabled}>
        확인
      </button>
    </footer>
  );
}
