# src 폴더 안내 (Kiosk)

> 기준일: **2026-08-14** · 자리표시자가 아니라 **실제 구현이 들어가 있는** 폴더입니다.
> 처음이면 [STRUCTURE_GUIDE.md](STRUCTURE_GUIDE.md) → 상위 [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) 순으로 읽으세요.

| 경로 | 역할 | 현재 |
| --- | --- | --- |
| `apps/kiosk/KioskApp.jsx` | Routes 조립 | Home·Menu·Detail·Cart·Payment·Processing·Complete·Accessibility 연결 |
| `entries/kiosk.jsx` | 앱 진입 + PWA fullscreen 폴백 | 설치형 PWA에서 첫 입력 시 portrait fullscreen |
| `pages/kiosk/` | URL 화면 | 메뉴·상세·장바구니 검증·주문 생성 API 연결 · 결제 승인은 테스트 흐름 |
| `components/kiosk/` | 키오스크 UI | MenuCard, OptionGroup, CartItem 등 |
| `store/` | 주문 세션·장바구니 | `orderSessionStore` + 호환 export |
| `utils/priceCalculation.js` | 가격 **단일 기준** | 사용 중 — 복제 금지 |
| `utils/quantityLimits.js` | 수량 한도 **단일 기준** | 9/30 적용 |
| `api/` | HTTP 요청·응답 처리 | 페이지·훅이 API 응답을 직접 화면과 상태에 반영 |
| `hooks/` | 타임아웃 등 | 일부 stub |
| `contracts/` | 계약 메모 | 정본과 충돌 시 정본 우선 |
| `public/mocks/payment-scenarios.sample.json` | 결제·완료·오류 예시만 | 대용량은 `ASAK/asak-data/archive/frontend-mocks/` |

현재 실API 범위는 API-001(카테고리)·API-002(메뉴 목록)·API-003(메뉴 상세)·API-004(장바구니 검증)·API-005(주문 생성)입니다.
API-014(결제수단 목록)·API-006(결제 승인)과 오류·시간 초과·영수증 라우트는 아직 화면 연결이 없습니다.

번호 정본은 [`../README.md`](../README.md)와 [`ASAK-back/IMPLEMENTATION_PLAN.md`](../../ASAK-back/IMPLEMENTATION_PLAN.md) §4.

PWA manifest는 `vite.config.js` (`display: fullscreen`, `orientation: portrait`). 설치·전체화면 절차는 [Android PWA 전체화면](../../ASAK/docs/operations/setup/android-pwa-fullscreen.md).

메뉴·상세·장바구니 이미지는 API의 `imageUrl`(DB `media_asset.url`에 저장된 Cloudinary 공개 URL)을 그대로 표시합니다. Cloudinary 자격 증명이나 업로드 책임은 키오스크에 없습니다.

구현 순서 추천: **페이지 동작 확인 → store/utils → `api/*` 직접 연결**.
Admin 기능은 `ASAK-Admin`에서만 구현합니다.
