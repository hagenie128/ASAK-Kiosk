// Figma Shared/Modal 정적 UI 뼈대 (paymentError | timeout | information).
// TODO: 열림 상태, 문구, 버튼 동작은 팀이 화면 로직에서 직접 연결한다.
export default function Modal({ icon, modal_title, modal_content, leftText, rightText, onLeftClick, onRightClick }) {


  return (
    <div className="shared-modal-layer" role="presentation">
      <div className="shared-modal" role="dialog" aria-modal="true">
        <div className="shared-modal__icon">
          <img src={icon} alt="팝업아이콘" />
        </div>
        <div className="shared-modal__content">
          <h2>{modal_title}</h2>
          <p>{modal_content}</p>
        </div>
        <div className="shared-modal__actions">
          <button type="button" onClick={onLeftClick}>{leftText}</button>
          <button type="button" onClick={onRightClick} className="is-primary">{rightText}</button>
        </div>
      </div>
    </div>
  );
}
