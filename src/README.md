# src 폴더 안내 (Kiosk)

> 기준일: **2026-07-20** · 자리표시자가 아니라 **실제 구현이 들어가 있는** 폴더입니다.  
> 처음이면 [STRUCTURE_GUIDE.md](STRUCTURE_GUIDE.md) → 상위 [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) 순으로 읽으세요.

| 경로 | 역할 | 현재 |
| --- | --- | --- |
| `apps/kiosk/KioskApp.jsx` | Routes 조립 | 10개 경로 연결 |
| `pages/kiosk/` | URL 화면 | Home~Cart mock 동작 · Payment 이후 UI shell |
| `components/kiosk/` | 키오스크 UI | MenuCard, OptionGroup, CartItem 등 |
| `store/` | 주문 세션·장바구니 | `orderSessionStore` + 호환 export |
| `utils/priceCalculation.js` | 가격 **단일 기준** | 사용 중 — 복제 금지 |
| `utils/quantityLimits.js` | 수량 한도 **단일 기준** | 9/30 적용 |
| `api/`, `adapters/` | HTTP·DTO | 골격 · 페이지는 아직 mock 직접 사용 |
| `hooks/` | 타임아웃 등 | 일부 stub |
| `contracts/` | 계약 메모 | Canonical과 충돌 시 Canonical 우선 |
| `public/mocks/kiosk.json` | mock 정본 | (저장소 `public/`) |

구현 순서 추천: **페이지 동작 확인 → store/utils → (나중) api/adapter**.  
Admin 기능은 `ASAK-Admin`에서만 구현합니다.
