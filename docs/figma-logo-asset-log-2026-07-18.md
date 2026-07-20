# 키오스크 로고·에셋 기록

> 화면 단위 진입점은 워크스페이스 루트의 **[ui-index.md](../../ui-index.md)** 다.

## 브랜드 SVG 로고 팩 — 2026-07-21

프로젝트에 새로 넣은 **정식 브랜드 SVG** 세트. 경로: `src/assets/svg/`.

| 파일 | 역할 | viewBox (대략) | 라이트 | 다크 |
| --- | --- | --- | --- | --- |
| `logo-S.svg` / `logo-S-dark.svg` | **S**ymbol — 정사각 마크만 | `0 0 152 152` | 라임 `#b9d440` + 다크 `#282c2f` | 라임 유지, 워드/마크 본색 → `#fff` |
| `logo-L.svg` / `logo-L-dark.svg` | **L**ogo — 가로 워드마크(마크+ASAK) | `0 0 1396 389` | 동일 | 동일 규칙 |
| `logo-F.svg` / `logo-F-dark.svg` | **F**ull — 워드마크+부제 등 풀 로고 | `0 0 1396 486` | 동일 | 동일 규칙 |

### 사용 규칙 (권장)

| 화면/상황 | 쓸 파일 |
| --- | --- |
| 헤더·작은 자리·완료 티켓 마크 | `logo-S` (± dark) |
| 공통 키오스크 헤더 워드마크 | `logo-L` (± dark) |
| 홈·스플래시·넓은 브랜드 영역 | `logo-F` (± dark) |
| 어두운 배경 / 고대비 | `*-dark.svg` |

### 현재 코드와의 관계

| 화면 | import | 상태 |
| --- | --- | --- |
| Home | `assets/svg/logo-F-dark.svg` | **적용됨** (어두운 홈 배경) |
| Header | `assets/svg/logo-L.svg` | **적용됨** |
| Order Complete | `assets/svg/logo-S.svg` | **적용됨** |

- 런타임 Figma URL·외부 CDN은 쓰지 않는다. SVG는 저장소에 커밋된 로컬 파일만 쓴다.
- `assets/figma/asak-logo-home-light.png`, `kiosk-header-logo.svg`, `asak-s-logo.svg`는 **레거시**. 화면이 SVG를 쓰는 동안 삭제하지 말 것(다른 문서·스크린샷 참조용).

## 완료·접근성 화면 검증 — 2026-07-19

- Figma 원본: `SCR-008 / Order Complete / Default` (`134:7926`), `SCR-014 / Accessibility / Default` (`134:7972`) — **ASAK — Design System Product UI 0718**.
- 화면 코드: `src/pages/kiosk/OrderCompletePage.jsx`, `src/pages/kiosk/AccessibilityPage.jsx`. 공통 스타일은 `src/styles/commonStyle.css`에 둔다.
- 검증 스크린샷: `docs/screenshots/2026-07-19-kiosk-complete-1080x1920.png`, `docs/screenshots/2026-07-19-kiosk-accessibility-1080x1920.png`.
- 확인한 레이아웃: 접근성 화면 하단 푸터는 1080×1920 화면 맨 아래에 유지된다. 글자 크기 3종, 고대비 토글 off, 미리보기, CTA는 시각 전용이다. 완료 화면 영수증도 0원·주문 데이터 없음의 정적 placeholder이며 버튼은 비활성이다.
- 두 화면 모두 런타임 Figma URL, 외부 이미지 URL, API 요청, mock JSON 변경, Zustand 상태 변경은 추가하지 않았다.

## 기존 흐름 화면 검증 — 2026-07-19

- `1080×1920` 렌더 캡처: `docs/screenshots/2026-07-19-kiosk-menu-list-1080x1920.png`, `docs/screenshots/2026-07-19-kiosk-menu-detail-1080x1920.png`, `docs/screenshots/2026-07-19-kiosk-cart-1080x1920.png`.
- 메뉴 목록·상세·장바구니는 기존 `kiosk.json` 읽기와 Zustand 장바구니 동작을 유지한다. 메뉴 데이터를 새로 만들지 않았다. 현재 mock은 선택한 카테고리당 메뉴 1개만 반환하므로, Figma 3열 카드 레이아웃은 카드 1개만 채워진 상태로 의도적으로 렌더된다.
- 메뉴 상세는 라우트 진입 시 브라우저 스크롤 위치를 초기화하고, 공통 헤더를 상세 내용 위에 둔다. 레이아웃 보호용이며 옵션 선택·수량 제한·합계 계산·장바구니 담기 동작은 그대로다.
- 장바구니는 기존 빈 상태로 캡처했다. Figma 단계 표시와 비활성 결제 CTA를 유지하며, 주문 흐름 연결 후에는 기존 cart store에서 항목 카드가 렌더된다.

## 홈 로고 — 2026-07-18

- 프로젝트 담당자가 제공한 원본: `C:\Users\하지니\Downloads\image 2.png`.
- 최종 로컬 에셋: `src/assets/figma/asak-logo-home-light.png`.
- 사용처: `src/pages/kiosk/HomePage.jsx` (`SCR-001`).
- 규칙: 라임 그린 부분은 그대로 두고, 원래 어두운 워드마크·부제·내부 아이콘 부분은 어두운 홈 배경에 맞게 흰색으로 처리한다.
- 배경: 원본 알파(투명) 채널을 유지했다. 이 에셋은 Figma MCP URL이 아니며 런타임 외부 의존성이 없다.
- 거부한 임시 결과물: 생성된 버전 중 하나에 진짜 투명이 아닌 체커보드가 보였다. 두 프로젝트 모두에서 제거했으며 참조하지 않는다.

## 구현 메모

`HomePage`는 텍스트 워드마크 대신 `<img>`를 쓴다. 제공된 아이덴티티의 컷아웃·조각 디테일을 CSS로 근사하지 않기 위함이다. 이미지 너비는 반응형(`min(520px, 72vw)`)이며 비율은 유지한다.

## 공통 키오스크 헤더 — 2026-07-18

- Figma 원본: `ASAK — Design System Product UI 0718` 노드 `134:7792` (`SCR-003 / Menu List / Default`).
- 로컬 에셋: `src/assets/figma/kiosk-header-logo.svg`, `icon-kiosk-back.svg`, `icon-kiosk-home.svg`.
- 사용처: `src/components/kiosk/Header.jsx`. 메뉴 목록·상세·장바구니·결제 화면이 같은 60px 컨트롤과 200×68 로고를 재사용한다.
- 유지한 동작: 기존 뒤로가기·홈 라우팅은 바꾸지 않았고, 텍스트 글리프 표현만 로컬 SVG 에셋으로 교체했다.
- 외부 의존성: 런타임 없음. 임시 Figma MCP URL은 저장소 에셋으로 내려받았으며 앱에서 참조하지 않는다.

## 결제 정적 UI — 2026-07-18

- Figma 원본: `SCR-007 / Payment / Summary Collapsed` (`134:7861`).
- 로컬 에셋: `icon-kiosk-card.svg`, `logo-kakaopay.png`. 후자는 원본 asset URL이 PNG였으므로 의도적으로 올바른 `.png` 확장자로 저장·import한다.
- 화면 코드: `src/pages/kiosk/PaymentPage.jsx`.
- UI 범위: 4단계 진행 표시, 합계 영역, 920px 결제 카드 2개, 접힌 주문 요약, 1080×1920에서 비활성 푸터 버튼 2개.
- 의도적으로 빠뜨린 것: 결제 수단 선택, 결제 요청, 주문 합계 바인딩, 네비게이션 상태 변경.
- 스크린샷: `docs/screenshots/2026-07-18-kiosk-payment-1080x1920.png` (빌드 미리보기로 확인).

## 시각 검증

- 스크린샷: `docs/screenshots/2026-07-18-kiosk-home-1080x1920.png`.
- 키오스크 목표 뷰포트 `1080 × 1920`에서 확인.
- 결과: 로고 배경 투명, 라임 디테일 유지, 어두운 워드마크 부분 흰색 처리 확인.
