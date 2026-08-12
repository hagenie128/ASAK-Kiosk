/*
 * Shared/Toast — 표시 전용 (WBS2-024 수량 한도 · 완료 안내)
 *
 * Props: message, tone? = "warning" | "success" | "error"
 * 수량 한도: quantityLimits reason → message, 4초 후 닫기(Page/Hook 소유)
 * 결제 완료: OrderCompletePage toastMessage
 * mock JSON 없음 — 문자열만
 */
export default function KioskToast({ message, tone = "warning" }) {
  if (!message) return null;

  return (
    <div className={`kiosk-toast kiosk-toast--${tone}`} role="status">
      <span className="kiosk-toast__mark" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
