# Kiosk Figma UI 적용 기록

## 원칙

- 기준 파일: Figma `JSrjOy668zhfkiLplCkreh` / `05-C. Screens / Kiosk (Implementation Final)`.
- Figma 파일은 읽기만 했으며 수정하지 않았다.
- 기존 라우팅, Zustand 스토어, mock/JSON 접근, 메뉴·장바구니 이벤트는 이 UI 작업에서 새로 만들거나 연결하지 않았다.
- 기존에 있던 동작은 유지하고, 새 결제·완료·접근성 화면의 CTA는 `disabled` 상태의 UI 전용 요소다.
- Figma MCP의 원격 이미지 URL은 만료될 수 있으므로 새 원격 이미지는 코드에 넣지 않았다. 기존 메뉴 이미지와 CSS 배경만 사용한다.

## 화면 매핑

| Figma 프레임 | Figma node | 코드 파일 | 적용 방식 |
| --- | --- | --- | --- |
| `SCR-001 / Home / Default` | `134:7721` | `src/pages/kiosk/HomePage.jsx`, `src/components/kiosk/OrderTypeSelector.jsx`, `src/styles/commonStyle.css` | Hero, 로고, 주문 방식 카드 UI. 기존 주문 방식 선택/이동 로직 유지. |
| `SCR-003 / Menu List / Default` | `134:7792` | `src/pages/kiosk/MenuListPage.jsx`, `Header.jsx`, `CategoryTabs.jsx`, `MenuCard.jsx`, `MenuListFooter.jsx`, `commonStyle.css` | 140px 헤더, 카테고리, 3열 메뉴 카드, 하단 CTA 레이아웃. 기존 메뉴 데이터와 선택 이벤트 유지. |
| `SCR-004 / Menu Detail / Default` | `134:7810` | `src/pages/kiosk/MenuDetailPage.jsx`, `MenuDetailSummary.jsx`, `OptionGroup.jsx`, `MenuDetailFooter.jsx`, `commonStyle.css` | 기존 옵션 그룹/수량/하단 CTA 구조를 Figma 크기 토큰에 맞춰 표시. 옵션 확정 로직은 기존 코드 소유. |
| `SCR-005 / Cart / Default` | `134:7835` | `src/pages/kiosk/CartPage.jsx`, `CartItem.jsx`, `QuantityStepper.jsx`, `commonStyle.css` | 단계 표시, 카드형 장바구니, 하단 요약 UI. 기존 수량 변경만 유지하고 결제 버튼은 비활성화. |
| `SCR-007 / Payment / Summary Collapsed` | `134:7861` | `src/pages/kiosk/PaymentPage.jsx`, `commonStyle.css` | 정적 주문 요약·결제 수단 카드·비활성 CTA. 결제 수단 선택/승인/오류 처리는 미구현. |
| `SCR-008 / Order Complete / Default` | `134:7926` | `src/pages/kiosk/OrderCompletePage.jsx`, `commonStyle.css` | 정적 주문 번호·금액·완료 CTA. 주문 번호, 대기열, 자동 이동은 미구현. |
| `SCR-014 / Accessibility / Default` | `134:7972` | `src/pages/kiosk/AccessibilityPage.jsx`, `commonStyle.css` | 설정 목록과 비활성 토글 UI. 고대비·글자 크기 기능은 미구현. |

`src/apps/kiosk/KioskApp.jsx`에는 UI 확인을 위한 `/payment`, `/complete`, `/accessibility` 경로만 추가했다. 기존 화면에서 이 경로로 이동시키는 새 이벤트는 만들지 않았다.

## Figma에서 확인한 정리 대상

1. 화면 번호가 연속적이지 않다. 홈 다음 메뉴 목록이 `SCR-003`이며 `SCR-002`가 현재 구현 화면 묶음에 없다.
2. 결제 화면은 같은 `SCR-007` 아래에 collapsed, expanded, processing, error, disabled 등 상태가 나뉘어 있으나 실제 상태 전이 규칙과 API 계약은 코드에 연결되어 있지 않다.
3. 완료 화면의 주문 번호, 대기 주문 수, 자동 홈 복귀는 표시 규격은 있으나 데이터 출처와 타이머 정책이 구현 범위로 분리되어야 한다.
4. `Kiosk/BottomCTA`와 `Kiosk/StepIndicator`는 공통 컴포넌트로 정의되어 있다. 현재 코드에서는 스타일 공통화가 먼저 적용됐으며, 기능 개발 시 별도 React 컴포넌트로 승격하면 중복을 줄일 수 있다.
5. Figma 시안의 사진/아이콘은 원격 임시 asset URL로만 전달된다. 정식 구현 전 프로젝트 소유 이미지/SVG asset의 경로와 라이선스를 확정해야 한다.

## 다음 구현자가 연결할 항목

- Menu List의 기존 mock/JSON 접근을 API 어댑터로 교체할 시점과 실패·로딩 상태 처리.
- Cart → Payment, Payment → Complete 흐름 및 결제 요청 중 중복 방지.
- 결제 성공 데이터로 주문 번호·대기열·결제 금액 렌더링.
- 접근성 설정을 전역 UI 설정으로 저장하고 키오스크 전체에 반영.

위 항목은 이 UI 반영 커밋의 범위 밖이며, 구현자가 데이터 계약을 정한 뒤 연결한다.

## Foundation token 확인 결과와 Figma 정리 제안

변수 정의를 다시 읽어보니 이 파일 안에는 `Semantic/*`뿐 아니라 `Color/White`, `Color/Green/50`, `Color/Green/600`, `Green/800`, `Gray/200`, `Yellow/1500`, `Number/Spacing/24`와 `ASAK/Body/L`이 있다. 즉 Foundation이 완전히 없는 상태는 아니다. 다만 이름·scale·semantic 연결이 일부만 보이고, mode와 전체 typography/elevation scale은 확인되지 않아 “부분적으로 존재하고 정리가 필요한 상태”로 기록한다.

### Figma 내부 연결 점검 결과

- 화면에서 쓰는 색상은 Figma variable로 해석된다. 예: `Semantic/Brand/Primary=#B5E30F`, `Semantic/Text/Inverse=#292D30`, `Semantic/BG/Admin=#FFFFFF`, `Semantic/Border/Default=#E5E7EB`.
- `Kiosk/BottomCTA`와 `Kiosk/Header`는 화면 내부에서 instance로 반복 사용된다. 따라서 이 파일 안의 공통 컴포넌트 연결은 존재한다.
- 디자인 시스템 검색에서는 `Kiosk/BottomCTA`, `Semantic/Brand/Primary`에 대해 별도의 published library asset을 반환하지 않았다. 이 결과만으로 외부 라이브러리 연결이 없다고 단정할 수는 없지만, 현재 읽기 API로는 다른 Figma 파일을 source로 한 라이브러리 key를 확인하지 못했다.
- Figma 앱의 **Assets → Libraries**에서 enabled library 목록을 열어, 각 library를 `유지 / 로컬화 / 해제`로 표기해야 최종적으로 외부 파일 연결을 끊을 수 있다. 이 문서는 그 수동 확인 결과를 추가할 위치다.

### Foundation에서 바로 정리할 불일치

| 발견 | 왜 문제인가 | 권장 정리 |
| --- | --- | --- |
| `Color/Green/50`와 `Green/800`이 혼재 | 같은 color scale의 경로 규칙이 다르다 | `Foundation/Color/Green/50…900` 하나로 통일하고 기존 변수는 alias 후 사용처 0개일 때 제거 |
| `Semantic/Brand/Primary=#B5E30F`, `Green/800=#B3E500` | 유사한 브랜드색이 서로 다른 token에 들어 있다 | 용도를 확정한다. primary 하나만 남기고 나머지는 hover/strong 등 semantic 역할로 이름을 분리 |
| `Semantic/BG/Admin`의 대문자 `BG` | `Bg`/`Background` 등 다른 namespace와 섞이기 쉽다 | `Semantic/Background/*` 또는 `Semantic/Bg/*` 중 하나로 통일 |
| `Number/Spacing/24`만 확인됨 | spacing scale이 component마다 숫자 직접 입력으로 남을 가능성이 높다 | `Foundation/Spacing/*` scale을 채우고 component padding/gap을 alias로 교체 |
| `ASAK/Body/L`만 확인됨 | heading, label, CTA 등의 타입 역할이 style이 아닌 직접 입력일 수 있다 | `Foundation/Typography`와 `ASAK/Heading`, `ASAK/Body`, `ASAK/Label` role을 component text에 바인딩 |

### Figma에 추가할 것

| 우선순위 | collection / group | 최소 항목 | semantic에서 사용할 예 |
| --- | --- | --- | --- |
| 높음 | `Foundation/Color` | `Green/50…900`, `Neutral/0…900`, `Red/500`, `Yellow/500`, `Overlay/black-40` | `Semantic/Brand/Primary`, `Semantic/Text/Primary`, `Semantic/Status/Error`, `Semantic/Overlay/Scrim` |
| 높음 | `Foundation/Typography` | Pretendard Variable의 Regular/Medium/Semibold/Bold, Display 64/56/48, Heading 36/30/28/22, Body 20/16/14 | 홈 제목, 메뉴 카드, 옵션 카드, CTA |
| 높음 | `Foundation/Spacing` | `4, 8, 12, 16, 20, 24, 32, 36, 40, 48, 60, 80` | 컴포넌트 내부 여백과 화면 좌우 padding |
| 중간 | `Foundation/Radius` | `8, 12, 16, 24, 32, pill` | OptionCard, MenuCard, BottomCTA, toggle |
| 중간 | `Foundation/Border` | `default=1`, `strong=1.5`, `emphasis=2`, neutral/brand/error 색상 | 선택 상태, disabled, 오류 상태 |
| 중간 | `Foundation/Elevation` | `none`, `card`, `bottom-sheet` | Home 주문 방식 카드, BottomCTA |
| 낮음 | `Foundation/Size` | kiosk viewport `1080×1920`, header `140`, bottom CTA `180`, touch target `60/72/100` | 화면 공통 영역과 접근성 기준 |

### Figma에서 정리하거나 제거할 것

삭제는 연결된 instance와 prototype을 깨뜨릴 수 있으므로 지금 바로 지우지 않는다. 아래 순서로 **교체 후 제거**한다.

1. 컴포넌트 안에 직접 입력된 색상값(예: `#B5E30F`, `#292D30`, `#E5E7EB`)은 대응 Foundation/semantic variable로 하나씩 바인딩한다.
2. 바인딩이 끝난 raw color style 또는 같은 의미의 중복 색상 style은 `Deprecated/`로 옮긴 뒤, 사용처가 0개인 것을 확인하고 제거한다.
3. 같은 이름의 화면 상태가 중복된 경우에는 `SCR-007 / Payment`처럼 base screen 1개와 variant/state 이름으로 정리한다. 처리 중·실패·선택됨을 별도 기본 화면처럼 복제하지 않는다.
4. `Kiosk/BottomCTA`, `Kiosk/StepIndicator`, `Kiosk/Header`는 화면마다 새로 그린 묶음을 지우고 component instance만 남긴다. 새 variant가 필요하면 component set에 추가한다.

## 코드에서 어려울 수 있는 부분: 짧은 설명

### `KioskApp.jsx`의 `Route`

`Route`는 URL과 화면 컴포넌트를 연결하는 표지판이다. 예를 들어 `/payment`은 `PaymentPage`를 보여줄 뿐이며, 결제 버튼을 눌렀을 때 이 주소로 가게 만드는 동작은 아직 넣지 않았다. 그래서 새 경로는 UI 확인용이고 주문 흐름 구현은 아니다.

### `MenuListPage`의 data와 UI 분리

이 페이지는 현재 `kiosk.json`에서 메뉴 배열을 가져오고, 각 메뉴를 `MenuCard`에 전달한다. `MenuCard`는 받은 메뉴 한 개를 그리는 역할만 한다. 이번 작업은 이 경계를 유지하고 카드의 크기·이미지·글자 배치만 바꿨다. JSON을 API로 바꿀 때도 `MenuCard`를 고치지 않고 페이지 또는 adapter 쪽만 바꾸기 쉽다.

### `OrderTypeSelector`와 `CartItem`의 Zustand 연결

두 컴포넌트는 화면을 그리는 일 외에 store를 읽거나 바꾸는 기존 동작이 있다. `OrderTypeSelector`는 매장/포장을 store에 저장한 뒤 메뉴로 이동하고, `CartItem`은 `updateItemQuantity`로 수량만 갱신한다. 이 두 동작은 팀원이 만든 흐름이므로 그대로 두고, 이번에는 HTML의 class와 CSS만 Figma 모양에 맞췄다.

### `disabled`로 만든 Payment/Complete/Accessibility UI

결제 수단, 결제 요청, 주문 완료의 홈 이동, 접근성 토글은 화면에는 보이지만 모두 비활성화되어 있다. 이것은 버튼을 눌렀을 때 잘못된 임시 흐름이 실행되는 일을 막고, 나중에 담당자가 API·타이머·전역 설정을 정한 뒤 명확하게 연결하기 위한 장치다.

### `commonStyle.css`가 공통 영역을 맡는 이유

화면마다 비슷한 헤더, 하단 CTA, 단계 표시를 새 클래스로 중복하지 않고 `kiosk-header`, `kiosk-step-indicator`, `--asak-*` 토큰으로 묶었다. 새 화면을 추가할 때는 먼저 기존 공통 클래스로 표현할 수 있는지 확인하고, 정말 화면 전용일 때만 `payment-page__*`처럼 page namespace를 추가한다.

## 개발 코드의 외부 연결 점검

| 대상 | 상태 | 조치 |
| --- | --- | --- |
| Pretendard jsDelivr CSS | 외부 런타임 요청 | `src/styles/global.css`의 CDN `@import`를 제거했다. 현재는 기기에 설치된 Pretendard가 있으면 사용하고 없으면 시스템 sans-serif로 표시된다. 정식 폰트가 필요하면 라이선스를 확인한 뒤 프로젝트 소유 `.woff2`를 `public/assets/fonts`에 넣어 `@font-face`로 연결한다. |
| Figma MCP asset URL | 임시 외부 URL 가능 | 코드에 추가하지 않았다. 문서의 Figma 링크는 참고용이며 앱 실행에는 쓰이지 않는다. |
| `VITE_API_BASE_URL` / Axios | 백엔드 연결 설정 | `src/api/client.js`와 `src/api/*`에만 남아 있다. 현재 UI 반영 페이지는 새 API 호출을 만들지 않았고, 기존 API 모듈은 향후 팀 구현을 위해 삭제하지 않았다. |
| 메뉴 mock JSON·ingredient SVG | 프로젝트 내부 파일 | `public/mocks`, `public/assets` 경로를 사용한다. 외부 네트워크 요청이 아니다. |
| React, Router, Zustand, Axios | npm 빌드 의존성 | `package.json`/lockfile에만 있다. 브라우저에서 CDN으로 불러오지 않으며, 각 소스 모듈의 import가 남아 있으므로 지금 제거하지 않는다. |

### 외부 연결 정리 원칙

1. 실행 시 외부 요청이 필요한 폰트·이미지·script는 먼저 프로젝트 소유 파일 또는 서버 API로 대체한다.
2. API 모듈과 npm 라이브러리는 “사용처가 0개인지”를 확인한 뒤에만 제거한다. 현재 `axios`는 `src/api/*`가 사용하므로 제거 대상이 아니다.
3. `.env.example`의 `http://localhost:8080`은 예시 개발 주소다. 배포 주소나 비밀값을 문서나 코드에 직접 쓰지 않고 실제 `.env`에서만 설정한다.
