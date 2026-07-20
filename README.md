# ASAK Kiosk

> **작업 시작점:** [ASAK 프로젝트 작업 허브](../ASAK/PROJECT_HUB.md) → 기능 한 개 선택 → 이 저장소 코드 수정 → 워크로그 기록.

## Central documentation

- [ASAK docs index](../ASAK/docs/README.md)
- [Product Bible Pack 12 — Frontend Implementation](../ASAK/docs/product_bible/12_Frontend_Implementation/README.md)
- [Product Bible Pack 11 — Backend Implementation](../ASAK/docs/product_bible/11_Backend_Implementation/README.md)
- [Current Implementation Map](../ASAK/docs/planning/CURRENT_IMPLEMENTATION_MAP.md)
- [Implementation Priority](../ASAK/docs/planning/IMPLEMENTATION_PRIORITY.md)
- [Implementation Guide Start](../ASAK/docs/implementation_guide/00_START_HERE.md)
- [Kiosk Implementation Guide](../ASAK/docs/implementation_guide/02_KIOSK_IMPLEMENTATION.md)
- [API·Response Guide](../ASAK/docs/implementation_guide/04_API_DB_IMPLEMENTATION.md)

Customer-facing React JavaScript is owned here. Admin scaffolds here are Legacy Reference; canonical administrator implementation is in `ASAK-Admin`.

ASAK 주문 키오스크 전용 React/Vite 프로젝트입니다. 관리자 운영 화면은 별도 `ASAK_Admin` 저장소에서 개발합니다.

> 이 프로젝트는 독립 Git 저장소입니다. 변경사항을 올릴 때는 반드시 `ASAK-Kiosk` 폴더에서 커밋·push합니다. 상위 작업공간의 Git 구조는 [작업공간 안내](../README.md)를 참고합니다.

## 실행

```powershell
cd C:\ASAK-workspace\ASAK-Kiosk
npm.cmd install
npm.cmd run dev
```

기본 개발 주소는 `http://localhost:5173`입니다.

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

## 현재 구현 상태 (2026-07-20)

| 구간 | 상태 |
| --- | --- |
| Home → Menu → Detail → Cart | **mock + store 동작** |
| Payment / Complete / Error / Timeout | **UI shell** (연결 대기) |
| `priceCalculation` / `quantityLimits` | **DONE** (단일 기준) |
| Backend API | 없음 → mock만 |

- 정본 맵: [Current Implementation Map](../ASAK/docs/planning/CURRENT_IMPLEMENTATION_MAP.md)
- 구조: [src/STRUCTURE_GUIDE.md](src/STRUCTURE_GUIDE.md)
- 계획: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
- Figma **0718** (`yHhvn5RKjBd91U8BJUQz7F`) — 0715 키 사용 금지
- 핸드오프: [docs/figma-ui-handoff-2026-07-18.md](docs/figma-ui-handoff-2026-07-18.md)
- UI 표: [UI-INDEX.md](../UI-INDEX.md)

## 구조

```text
src/
  apps/kiosk/   Routes
  pages/kiosk/  화면
  components/   UI
  store/        주문 세션·장바구니
  utils/        priceCalculation, quantityLimits
  api/          골격 (페이지는 아직 mock 직접 사용)
public/mocks/   kiosk.json
```

## Figma · MCP 구현 가이드

Figma 프로토타입을 MCP로 반영한 뒤의 화면 구현 범위, 주문 상태·API 연결 작업,
CSS 분리 기준, 화면별 체크리스트는 [docs/figma-mcp-implementation-guide-2026-07-14.md](docs/figma-mcp-implementation-guide-2026-07-14.md)를 참고합니다.

주문 생성·결제의 request/response/error와 기존 store adapter 규칙은 [중앙 API 가이드](../ASAK/docs/implementation_guide/04_API_DB_IMPLEMENTATION.md)를 먼저 확인합니다.
