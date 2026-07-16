# ASAK Kiosk

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

## 현재 구현 목표

목표 화면은 `SCR-001`, `SCR-003~005`, `SCR-007`, `SCR-008`, `SCR-012~014`이다. 현재 라우트가 연결된 화면과 목표 화면은 다르므로, 완료 여부는 [Current Implementation Map](../ASAK/docs/planning/CURRENT_IMPLEMENTATION_MAP.md)으로 확인한다.

- 화면/상태 정본: [05-C Kiosk](https://www.figma.com/design/JSrjOy668zhfkiLplCkreh/ASAK-%E2%80%94-Design-System---Product-UI-0715?node-id=134-7720)
- 상태 QA 정본: [07-C Matrix](https://www.figma.com/design/JSrjOy668zhfkiLplCkreh/ASAK-%E2%80%94-Design-System---Product-UI-0715?node-id=190-2)
- API는 아직 Backend에 구현되지 않은 목표 계약이다. 화면은 mock으로 시연할 수 있지만, API 연결 완료로 표기하지 않는다.

## 구조

```text
src/
  apps/kiosk/  키오스크 화면과 라우트
  api/         키오스크 API 모듈
  store/       주문 초안·장바구니 상태
  mocks/       mock API fixture
```

## Figma · MCP 구현 가이드

Figma 프로토타입을 MCP로 반영한 뒤의 화면 구현 범위, 주문 상태·API 연결 작업,
CSS 분리 기준, 화면별 체크리스트는 [docs/figma-mcp-implementation-guide.md](docs/figma-mcp-implementation-guide.md)를 참고합니다.

주문 생성·결제의 request/response/error와 기존 store adapter 규칙은 [중앙 API 가이드](../ASAK/docs/implementation_guide/04_API_DB_IMPLEMENTATION.md)를 먼저 확인합니다.
