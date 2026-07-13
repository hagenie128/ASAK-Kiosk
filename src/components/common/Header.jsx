// Figma symbol "header" 대응 컴포넌트. 상단바 — 뒤로가기/타이틀/타임아웃 표시 등을 여기서 조립.
export default function Header({ title, onBack }) {
  return (
    <header className="kiosk-header">
      {onBack && (
        <button type="button" className="kiosk-header__back" onClick={onBack}>
          ←
        </button>
      )}
      <h1 className="kiosk-header__title">{title}</h1>
    </header>
  );
}
