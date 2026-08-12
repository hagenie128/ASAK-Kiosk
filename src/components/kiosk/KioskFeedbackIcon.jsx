// Iconify Lucide 계열의 단순 선형 아이콘을 인라인 SVG로 사용한다.
// 외부 네트워크 없이 키오스크에서 항상 표시되도록 별도 패키지를 추가하지 않는다.
const ICON_PATHS = {
  success: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </>
  ),
  warning: (
    <>
      <path d="M10.3 3.9 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
};

export default function KioskFeedbackIcon({ tone = "info" }) {
  const iconTone = tone === "danger" ? "error" : tone;

  return (
    <svg
      className={`kiosk-feedback-icon kiosk-feedback-icon--${iconTone}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[iconTone] ?? ICON_PATHS.info}
    </svg>
  );
}
