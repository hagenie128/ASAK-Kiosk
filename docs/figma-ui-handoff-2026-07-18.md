# 키오스크 Figma UI 핸드오프

> 기준일: **2026-07-20**  
> Figma 정본: `yHhvn5RKjBd91U8BJUQz7F` (0718) — **0715 파일 키 사용 금지**  
> 화면 표 진입점: [`ui-index.md`](../../ui-index.md)

## 역할

이 문서는 키오스크 **화면 ↔ 코드 ↔ 데이터 상태**의 짧은 핸드오프다.  
상세 라우트·WBS는 [`src/STRUCTURE_GUIDE.md`](../src/STRUCTURE_GUIDE.md), [`IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md)를 본다.

## 데이터 상태 요약

| 구간 | UI | 데이터 |
| --- | --- | --- |
| Home → Menu → Detail → Cart | 이식됨 | **mock + store 동작** (`public/mocks/kiosk.json`) |
| Payment → Complete / Error / Timeout | 이식됨 | **미연결** (수단 선택·결제·타이머) |
| Receipt | 이식됨 | Future Scope (SCR-023) |
| Accessibility | 이식됨 | 전역 고대비 등 부분 |

## 건드리면 안 되는 것

- `utils/priceCalculation.js`, `utils/quantityLimits.js`
- CSS 통째 교체 / Figma MCP React 붙여넣기
- Admin 기능을 이 저장소에 신규 작성

## Gap 문서

- [`ASAK/docs/design/figma-0718-project-gap.md`](../../ASAK/docs/design/figma-0718-project-gap.md)
- [`ASAK/docs/planning/current-implementation-map-2026-07-16.md`](../../ASAK/docs/planning/current-implementation-map-2026-07-16.md)
