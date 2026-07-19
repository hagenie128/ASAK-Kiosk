// Figma Shared/Modal 정적 UI 뼈대 (paymentError | timeout | information).
// TODO: 열림 상태, 문구, 버튼 동작은 팀이 화면 로직에서 직접 연결한다.
export default function Modal() {
  return (
    <div className="shared-modal-layer" role="presentation">
      <div className="shared-modal" role="dialog" aria-modal="true">
        <span className="shared-modal__icon" aria-hidden="true" />
        <div className="shared-modal__content">
          <h2>안내</h2>
          <p>상태별 문구가 표시되는 영역입니다.</p>
        </div>
        <div className="shared-modal__actions">
          <button type="button" disabled>취소</button>
          <button type="button" className="is-primary" disabled>확인</button>
        </div>
      </div>
    </div>
  );
}
