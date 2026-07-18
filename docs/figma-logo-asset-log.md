# Kiosk logo asset log

## Completion and accessibility verification — 2026-07-19

- Figma sources: `SCR-008 / Order Complete / Default` (`134:7926`) and `SCR-014 / Accessibility / Default` (`134:7972`) from **ASAK — Design System Product UI 0718**.
- Screen code: `src/pages/kiosk/OrderCompletePage.jsx`, `src/pages/kiosk/AccessibilityPage.jsx`; shared styles are kept in `src/styles/commonStyle.css`.
- Verification screenshots: `docs/screenshots/2026-07-19-kiosk-complete-1080x1920.png` and `docs/screenshots/2026-07-19-kiosk-accessibility-1080x1920.png`.
- Verified layout: the accessibility footer remains at the bottom of the 1080×1920 screen; its three type choices, off contrast toggle, preview, and CTAs are visual-only. The completion receipt is likewise a static 0-won / no-order-data placeholder with disabled actions.
- No runtime Figma URL, external image URL, API request, mock JSON change, or Zustand state mutation was added for either screen.

## Home logo — 2026-07-18

- Source supplied by the project owner: `C:\Users\하지니\Downloads\image 2.png`.
- Final local asset: `src/assets/figma/asak-logo-home-light.png`.
- Consumer: `src/pages/kiosk/HomePage.jsx` (`SCR-001`).
- Rule: lime-green portions remain unchanged; the original dark wordmark, subtitle, and inner icon portions become white for the dark Home background.
- Background: original alpha was retained. The asset is not a Figma MCP URL and has no runtime external dependency.
- Rejected temporary output: a generated version included a visible checkerboard instead of true alpha. It was removed from both projects and is not referenced.

## Implementation note

`HomePage` uses an `<img>` rather than a text wordmark so the supplied identity, cut-outs, and fragment details are not approximated with CSS. The image width is responsive (`min(520px, 72vw)`) while preserving its aspect ratio.

## Shared kiosk header — 2026-07-18

- Figma source: `ASAK — Design System Product UI 0718` node `134:7792` (`SCR-003 / Menu List / Default`).
- Local assets: `src/assets/figma/kiosk-header-logo.svg`, `icon-kiosk-back.svg`, `icon-kiosk-home.svg`.
- Consumer: `src/components/kiosk/Header.jsx`, therefore Menu List, Menu Detail, Cart and Payment screens reuse the same 60px controls and 200×68 logo.
- Behavior preserved: the existing back navigation and home route were not changed; only their text-glyph presentation was replaced with local SVG assets.
- External dependency: none at runtime. The temporary Figma MCP URLs were downloaded as repository assets and are not referenced by the app.

## Payment static UI — 2026-07-18

- Figma source: `SCR-007 / Payment / Summary Collapsed` (`134:7861`).
- Local assets: `icon-kiosk-card.svg`, `logo-kakaopay.png`. The latter was delivered by Figma as PNG despite its original asset URL, so it is deliberately stored/imported with the correct `.png` extension.
- Screen code: `src/pages/kiosk/PaymentPage.jsx`.
- UI scope: four-step progress, total area, two 920px payment cards, collapsed order summary, and two disabled footer buttons at 1080×1920.
- Deliberately omitted: payment selection, payment request, order total binding, and navigation state changes.
- Screenshot: `docs/screenshots/2026-07-18-kiosk-payment-1080x1920.png` (built preview verified).

## Visual verification

- Screenshot: `docs/screenshots/2026-07-18-kiosk-home-1080x1920.png`.
- Verified at the Kiosk target viewport: `1080 × 1920`.
- Result: transparent logo background, lime detail preservation, and white dark-wordmark portions confirmed.
