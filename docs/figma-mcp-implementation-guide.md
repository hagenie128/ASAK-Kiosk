# Figma Prototype → MCP → Kiosk 구현 가이드

> **디자인 현재 상태:** [`ASAK/docs/design/README.md`](../../ASAK/docs/design/README.md)  
> 이 문서는 **Kiosk 저장소**에서 MCP→코드 연결용입니다. Admin은 `ASAK-Admin/docs/07-figma-mcp-implementation-guide.md`.

## 목적과 범위

Figma 키오스크 화면과 프로토타입은 React 구현의 기준이다. MCP는 화면 구조·스타일·인터랙션 의도를 가져오는 데 도움을 주지만, 주문 데이터와 결제 같은 실제 동작을 자동으로 완성하지는 않는다.

적용 화면: `SCR-001`, `SCR-003`~`SCR-005`, `SCR-007`, `SCR-008`, `SCR-012`.

## 어디까지 가져오고, 무엇을 구현하는가

| 구분 | Figma/MCP로 반영할 것 | 코드에서 구현할 것 |
| --- | --- | --- |
| UI | 주문 유형 선택, 메뉴 카드, 옵션, 장바구니, 결제, 완료/실패 화면 | `pages/kiosk`, `components/kiosk` 구조 및 키오스크 해상도 보정 |
| 프로토타입 | 메뉴 이동, 옵션 모달, 장바구니·결제·복구 흐름 | React Router, 이벤트 핸들러, 타임아웃/초기화 정책 |
| 데이터 표시 | 메뉴·가격·이미지·옵션의 더미값 | `API-001`~`API-006`, loading/empty/error, 값 포맷팅 |
| 주문 동작 | 선택·품절·결제 상태의 외형 | store, 수량·총액 계산, 필수 옵션 검증, 중복 결제 방지 |
| 품질 | focus/disabled 등 상태의 디자인 | 터치 영역, 키보드 접근성, lint/build, 시나리오 테스트 |

## 화면별 작업 연결

| 화면 | 디자인에서 확정할 것 | 구현에서 연결할 것 |
| --- | --- | --- |
| `SCR-001` 주문 시작 | 매장/포장 선택과 비활성 다음 버튼 | `orderSessionStore.orderType` 저장 및 메뉴 이동 |
| `SCR-003` 메뉴 목록 | 카테고리, 메뉴 카드, 품절 배지 | `API-001/002`, 카테고리·품절·loading/empty/error |
| `SCR-004` 메뉴 상세 | 옵션 그룹, 필수 표시, 제외 재료, 가격 미리보기 | 필수 옵션 검증, 품절 옵션 차단, `cartStore` 추가 |
| `SCR-005` 장바구니 | 수량 조절, 삭제, 총액, 주문 확인 모달 | 수량·총액 계산, 빈 장바구니 차단, `API-005` |
| `SCR-007/008` 결제·완료 | 결제수단, 진행 상태, 완료 정보 | `API-006`, 승인 시 장바구니 초기화 |
| `SCR-012` 결제 실패 | 실패 안내, 재시도·장바구니 복귀 | 메뉴·옵션·수량 보존 및 실패 사유 표시 |

## 권장 순서

1. Figma에 기본·선택·disabled·품절·loading·empty·error 상태를 준비한다.
2. 주문 시작부터 결제 성공·실패 복구까지 프로토타입을 연결한다.
3. MCP 결과를 `pages/kiosk`의 화면 골격과 스타일 기준으로 적용한다.
4. 메뉴 카드, 옵션 선택, 수량 조절, 확인 모달처럼 반복되는 UI만 `components/kiosk`로 추출한다.
5. `KioskApp.jsx` 라우팅, Zustand store, mock/API, 금액 계산을 연결한다.
6. `TC-K01`~`TC-K04`, 터치/키보드 조작, `npm.cmd run lint`, `npm.cmd run build`를 확인한다.

## CSS 기준

```text
src/
  styles/                 # reset, 폰트, 색상/간격 토큰, kiosk viewport 공통 규칙
  pages/kiosk/            # 각 화면 JSX와 화면 전용 스타일
  components/kiosk/       # 반복 UI와 해당 컴포넌트 스타일
```

- 전역에는 reset, 폰트, CSS 변수, `.kiosk-viewport` 같은 앱 공통 레이아웃만 둔다.
- 홈 배너, 메뉴 그리드, 결제 화면처럼 한 화면 전용 규칙은 해당 페이지에 둔다.
- 버튼, 메뉴 카드, 수량 조절, 모달처럼 반복되는 UI만 공통 컴포넌트 스타일로 분리한다.
- 클래스명은 화면 범위를 포함한다. 예: `.kiosk-menu__grid`, `.kiosk-cart__summary`.

## Figma 전달 전 체크리스트

- [ ] 각 프레임에 `SCR` ID와 화면 목적이 있다.
- [ ] 기본·선택·disabled·품절·loading·empty·error 상태가 있다.
- [ ] 옵션 선택, 수량 변경, 삭제, 주문 확인, 결제 실패 복구가 프로토타입에 연결됐다.
- [ ] 터치하기 쉬운 버튼 크기와 키오스크 기준 해상도가 적용됐다.
- [ ] API 값과 디자인용 더미값을 구분했다.

## 완료 기준

디자인 외형과 주요 흐름이 일치하고, 주문 유형 선택부터 결제 성공·실패 복구까지 mock/API 데이터로 동작해야 완료다. 프로토타입의 클릭 연결만으로는 완료가 아니다.
