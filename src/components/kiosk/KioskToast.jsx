// Shared/Toast — Figma tone=warning 등. 표시 전용.
export default function KioskToast({ message, tone = "warning" }) {
  if (!message) return null;

  return (
    <div className={`kiosk-toast kiosk-toast--${tone}`} role="status">
      <span className="kiosk-toast__mark" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
