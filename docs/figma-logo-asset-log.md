# Kiosk logo asset log

## Home logo — 2026-07-18

- Source supplied by the project owner: `C:\Users\하지니\Downloads\image 2.png`.
- Final local asset: `src/assets/figma/asak-logo-home-light.png`.
- Consumer: `src/pages/kiosk/HomePage.jsx` (`SCR-001`).
- Rule: lime-green portions remain unchanged; the original dark wordmark, subtitle, and inner icon portions become white for the dark Home background.
- Background: original alpha was retained. The asset is not a Figma MCP URL and has no runtime external dependency.
- Rejected temporary output: a generated version included a visible checkerboard instead of true alpha. It was removed from both projects and is not referenced.

## Implementation note

`HomePage` uses an `<img>` rather than a text wordmark so the supplied identity, cut-outs, and fragment details are not approximated with CSS. The image width is responsive (`min(520px, 72vw)`) while preserving its aspect ratio.
