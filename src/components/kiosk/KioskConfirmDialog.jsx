// Shared/ConfirmDialog — Figma 272:19520 계열. 표시 전용.
export default function KioskConfirmDialog({
  title,
  description,
  secondaryLabel = "취소",
  primaryLabel = "확인",
  tone = "danger",
}) {
  return (
    <>
      <div className="kiosk-confirm-overlay" aria-hidden="true" />
      <div className="kiosk-confirm" role="dialog" aria-modal="true" aria-labelledby="kiosk-confirm-title">
        <span className="kiosk-confirm__icon" aria-hidden="true" />
        <div className="kiosk-confirm__text">
          <h2 id="kiosk-confirm-title">{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        <div className="kiosk-confirm__actions">
          <button type="button" disabled>
            {secondaryLabel}
          </button>
          <button type="button" disabled className={`is-primary is-${tone}`}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </>
  );
}
