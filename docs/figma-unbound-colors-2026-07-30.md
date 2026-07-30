# Kiosk 토큰화 기록 · Figma Variable 미바인딩 목록

> 기준일: **2026-07-30**
> Figma 정본: `yHhvn5RKjBd91U8BJUQz7F` (0718)
> 대상: `ASAK-Kiosk/src/styles/**/*.css`

## 역할

색과 spacing 토큰화 작업의 기록이다. 핵심은 **코드에는 있으나 Figma Variable로
잡혀 있지 않은 값**을 모아 디자인 쪽에 넘기는 것이다.

값이 비슷한 기존 토큰에 임의로 매핑하지 않고 그대로 두었으며, 각 줄에
`/* Figma 직접값 · Variable 미바인딩 */` 주석을 달아두었다.

디자인 쪽에서 Semantic 변수로 바인딩해주면 코드도 토큰으로 교체할 수 있다.
바인딩하지 않기로 결정한 값은 이 문서에 사유를 적고 그대로 둔다.

문서 앞부분은 색, 뒷부분(`## Spacing 토큰화`)은 여백을 다룬다.

## 판정 기준

코드의 hex를 토큰으로 바꾼 기준은 두 가지를 **모두** 만족하는 경우다.

1. 값이 정확히 일치한다
2. 역할이 토큰의 의미와 맞는다 (배경용 토큰을 글자색에 쓰지 않는다)

값만 같고 역할이 다르면 바꾸지 않았다. 지금 묶으면 나중에 한쪽만 바뀔 때
조용히 같이 움직이기 때문이다.

## 미바인딩 목록

디자인이 변수를 아예 붙이지 않은 색이다.

| 값 | 파일 | 용도 | 비고 |
| --- | --- | --- | --- |
| `#4a7a00` | `feedback.css` | 상태 프리뷰 헤더 로고 | 개발·QA용 하네스. Figma 화면 없음 |
| `#d9dee0` | `feedback.css` | empty 상태 마크 | 〃 |
| `#9ca3af` | `feedback.css` | 비활성 버튼 글자 | 〃 |
| `#6b7280` | `feedback.css` | 프리뷰 code 칩 | 값은 `Text/Disabled`와 같으나 역할이 다름 |
| `#33383d` | `complete.css`, `cart.css` | 화면 제목 (h1, 장바구니 제목) | `Semantic/BG/Secondary`와 값이 같으나 그쪽은 배경용 |
| `#4a4e57` | `complete.css` | 라벨, 안내 문구 | — |
| `#3f3f3f` | `complete.css` | 주문번호 140px | — |
| `#303030` | `complete.css` | 복귀 안내 문구 | — |
| `#ff383c` | `complete.css` | 카운트다운 강조 | `Status/Error`(`#ef4444`)와 다른 빨강 |
| `#0d0d0d` | `receipt.css`, `cart.css` | 영수증 제목, 합계 금액 | Figma에 `Gray/1600`으로 바인딩됨. **레거시 컬렉션이라 Semantic 없음** |
| `#111111` | `receipt.css` | 영수증 본문, 바코드 바 | `Text/Kiosk/Primary`(`#1a1a1a`)와 다름 |
| `#dc2626` | `receipt.css` | 출력 실패 메시지 | `Status/Error`(`#ef4444`)와 다른 빨강 |
| `#4a7a00` | `receipt.css` | 출력 성공 메시지 | 값은 `Text/Price`와 같으나 **역할이 가격이 아님** |
| `#666666` | `cart.css` | 툴바 항목 수 | `Text/Tertiary`(`#737373`)와 다름 |
| `#282828` | `cart.css` | 합계 카드 행 | `Text/Inverse`(`#292d30`)와 다름 |
| `#eeeeee` | `cart.css` | 합계 카드 테두리 | `Neutral/175`(`#e6e6e6`)와 다름 |

## 바인딩은 됐으나 Kiosk에 대응 토큰이 없는 색

위 목록과 성격이 다르다. 디자인이 변수를 **붙이긴 했는데**, 그 변수가 Kiosk
`tokens.css`에 없거나 Kiosk에 쓰면 안 되는 것들이다. 코드에서 판단할 수 없어
그대로 두고 주석만 달았다.

| 값 | Figma 바인딩 | 파일 | 문제 |
| --- | --- | --- | --- |
| `#111827` | `Semantic/Text/Admin/Primary` | `feedback.css`, `shared.css` | **관리자 전용 토큰이 키오스크 모달에 쓰임** |
| `#404040` | `Color/Neutral/800` | `feedback.css`, `shared.css` | Semantic을 거치지 않은 Primitive 직접 바인딩 |

### `Text/Admin/Primary` 오용

`SCR-012`(결제 실패), `SCR-013`(타임아웃), 공통 Confirm 모달의 제목과 버튼 글자색이
`Semantic/Text/Admin/Primary`(`#111827`)에 바인딩되어 있다.

키오스크 본문 정본은 `Semantic/Text/Kiosk/Primary`(`#1a1a1a`)다. 디자인에서 관리자
컴포넌트를 가져다 쓰면서 딸려온 것으로 보인다. 두 값이 실제로 다르므로
(`#111827` vs `#1a1a1a`) 코드에서 임의로 바꾸면 화면이 달라진다.

**판단 필요:** 키오스크 모달을 `Text/Kiosk/Primary`로 재바인딩할지, 아니면
이 모달이 관리자 톤을 쓰는 게 의도인지.

## Figma Semantic에 빠진 토큰

### `Badge/VeganBG`

메뉴 상세의 배지 3종 중 비건만 배경 토큰이 없다.

| 배지 | 배경 | 글자 |
| --- | --- | --- |
| BEST | `Badge/BestBG` `#ffe6e7` | `Badge/BestText` `#ff0004` |
| NEW | `Badge/NewBG` `#ffff80` | 없음 (`#0d0d0d`, legacy `Gray/1600`) |
| Vegan | **없음** (`#ebf5eb`) | `Status/Vegan` `#077e40` |

`#ebf5eb`은 `Status/SuccessBG`와 값이 같지만 "성공"과 "비건"은 다른 개념이라
갖다 쓰지 않았다. `Semantic/Badge/VeganBG`를 추가하면 배지 3종의 구조가 일관된다.

NEW 배지 글자색도 Semantic이 없어 레거시 `Gray/1600`에 의존한다.
`Badge/NewText`를 함께 만들면 세 배지가 모두 `~BG` + `~Text` 쌍을 갖는다.

## 역할이 갈리는데 값이 같은 경우

`shared.css`의 알레르기 아코디언 화살표는 `border-right`/`border-bottom`으로 그린
글리프다. `#737373`은 `Semantic/Border/Strong`과 `Semantic/Text/Tertiary` **양쪽 모두**와
값이 같다.

평상시에는 구분이 없지만 고대비에서 갈라진다.

| 토큰 | Default | High Contrast |
| --- | --- | --- |
| `Border/Strong` | `#737373` | `#ffffff` |
| `Text/Tertiary` | `#737373` | `#9ca3af` |

`Border/Strong`을 고르면 고대비에서 화살표가 흰색이 되어 밝은 경고 배경 위에서
보이지 않는다. 어느 쪽도 대비가 충분하지 않아 디자인 확인 없이 고를 수 없다.
그대로 두고 해당 줄에 사유를 적었다.

`shared.css`의 Confirm 아이콘 자리표시자(`#e5e7eb`)도 비슷하다.
`Semantic/Border/Default`와 값이 같지만 테두리가 아니라 채움색으로 쓰이고 있고,
같은 값의 surface 토큰은 없다.

## 확인이 필요한 것

### 1. 근사값 중복

같은 역할인데 값이 미세하게 다른 쌍이 있다. 실측 과정에서 갈라진 것으로 보인다.

| 역할 | 코드에 공존하는 값 | 대응 Semantic |
| --- | --- | --- |
| 어두운 본문 | `#0d0d0d`, `#111111`, `#282828`, `#292d30`, `#303030`, `#33383d`, `#3f3f3f` | `Text/Inverse` `#292d30` |
| 빨강 | `#dc2626`, `#ef4444`, `#ff383c` | `Status/Error` `#ef4444` |
| 회색 테두리 | `#e5e5e5`, `#e5e7eb`, `#e6e6e6`, `#eeeeee` | `Border/Default` `#e5e7eb` |
| 라임 | `#b3e500`, `#b5e30f` | `Brand/Primary` `#b5e30f` |

어두운 본문 7종은 육안으로 구분되지 않는다. 의도된 위계인지, 실측 잔재인지 확인이 필요하다.
통합하면 고대비 전환 시 한 번에 검정으로 보낼 수 있다.

### 라임 — 한 컴포넌트 안에서 두 값이 공존

`commonStyle.css`의 스텝 인디케이터는 라임 계열 3색을 동시에 쓴다.

```
border-color: #b3e500   Color/Lime/500 (Interactive/Hover와 동값)
background:   #b5e30f   Brand/Primary
background:   #f5fbe0   Brand/Subtle
```

`#b3e500`과 `#b5e30f`는 육안으로 구분되지 않는다. 테두리와 채움을 다른 라임으로 나눈 것이
의도인지 확인이 필요하다. 하나로 합치면 고대비 전환이 단순해진다.

`#b3e500`은 값이 `Semantic/Interactive/Hover`와 같지만 스텝 인디케이터의 완료·현재 상태는
hover가 아니다. 값이 같다는 이유로 묶으면 나중에 hover 색만 조정할 때 스텝 인디케이터가
같이 움직인다. 그대로 두었다.

### 회색 테두리 — `#e5e5e5`

`accessibility.css`는 `#e5e5e5`를 3곳에서 쓴다. `Border/Default`(`#e5e7eb`)와 2 단위 차이라
육안 구분이 불가능하다. 이 화면은 Figma에서 색 변수를 하나도 바인딩하지 않았다
(타이포 스타일만 있음).

### 2. 고대비 대응

미바인딩 색은 대부분 **어두운 텍스트**다. 고대비에서는 검정으로 가야 하지만
현재는 변수를 거치지 않아 고정된다. `Text/Kiosk/*` 계열로 바인딩하면 코드도 따라갈 수 있다.

### 3. 레거시 컬렉션

`#0d0d0d`는 Figma에서 `Gray/1600`에 바인딩되어 있다. `Gray/*`는 `Color/Neutral/*`과
중복되는 레거시 컬렉션이라 export되는 `ASAK / Primitive`에 포함되지 않는다.
Semantic으로 승격하거나 `Color/Neutral/*`으로 옮겨야 코드에서 토큰으로 쓸 수 있다.

## 진행 현황

전 파일 완료. 시작 시점은 60%(하드코딩 169건)였다.

| 파일 | 시작 | 완료 |
| --- | --- | --- |
| `menu.css` | 98% | **100%** |
| `menu-detail.css` | 78% | 91% |
| `shared.css` | 64% | 87% |
| `payment.css` | 70% | 87% |
| `commonStyle.css` | 68% | 84% |
| `cart.css` | 29% | 83% |
| `feedback.css` | 32% | 82% |
| `accessibility.css` | 68% | 75% |
| `complete.css` | 4% | 74% |
| `home.css` | 20% | 60% (고대비 블록 3건 보존) |
| `receipt.css` | 12% | 41% (고대비 블록 13건 보존) |
| **합계** | **60%** | **83%** |

치환한 값은 전부 기존과 동일하므로 시각 변화는 없다.

`home.css`와 `receipt.css`의 비율이 낮은 것은 고대비 블록을 그대로 두었기 때문이다.
고대비 구현 작업에서 토큰 재정의 방식으로 교체하면 함께 올라간다.

## 남은 70건의 내역

| 분류 | 건수 | 처리 |
| --- | --- | --- |
| 고대비 블록 (`home.css`, `receipt.css`) | 16 | 고대비 구현 작업에서 교체 |
| Figma Variable 미바인딩 | 30 | 디자인 확인 필요 |
| 바인딩됐으나 Kiosk 토큰 없음 | 6 | 디자인 확인 필요 |
| 역할 불일치 (값만 같음) | 8 | 그대로 유지가 맞음 |
| 주석·fallback (실제 하드코딩 아님) | 10 | 해당 없음 |

코드에서 더 줄일 수 있는 것은 없다. 나머지는 Figma 쪽 정리가 선행되어야 한다.

## 부수적으로 고친 것

`accessibility.css`가 정의되지 않은 `--asak-text-primary`를 3곳에서 참조하고 있었다.
fallback도 없어 해당 선언이 무효화되고 색이 부모에서 상속되고 있었다.
`--asak-text`(`#1a1a1a`, `Text/Kiosk/Primary`)로 교체했다.

**이 3곳은 실제로 렌더링이 바뀐다.** 다른 모든 변경은 값이 동일하다.

---

## Spacing 토큰화

### 전제

**고대비와 무관한 작업이다.** Figma 고대비 세트의 차이 30개는 전부 색과
`Border/Width`이고 `Semantic/Spacing/*`은 Default와 값이 같다.
색 토큰화가 테마 전환을 가능하게 한 것과 달리, 이쪽 효용은 일관성 정리에 그친다.

### 결과

`padding` / `margin` / `gap` 계열만 대상으로 했다. `width`, `height`, `top`,
`font-size`, `border-radius`는 여백이 아니므로 제외했다.

| | 시작 | 완료 |
| --- | --- | --- |
| 하드코딩 px | 227 | **88** |
| 치환 | — | **125건** |
| 스케일 내 잔존 | 144 | 20 |

### 치환 규칙

선언 안의 px 값이 **전부** Kiosk 스케일(4·8·12·16·20·24·32·40·48)에 있을 때만
치환했다. 일부만 스케일 안이면 그대로 두었다.

```css
padding: 32px 60px;   →   padding: var(--asak-space-7) 60px;   ← 원본보다 읽기 나쁨
```

의미 있는 쪽이 raw 값으로 남는 하이브리드는 가독성을 떨어뜨린다.

### `--asak-page-pad` 일반화

위 규칙의 예외가 하나 있다. 좌우 페이지 여백 `60px`은 화면 11곳이 공유하는
레이아웃 상수라, 부분 치환이 되더라도 토큰으로 묶는 편이 낫다.
여백을 조정할 때 11개 화면이 함께 움직이는 것이 이 토큰의 목적이기 때문이다.

```css
- --asak-page-pad-menu: 60px;  /* 메뉴 그리드 좌우 실측 */
+ --asak-page-pad: 60px;       /* 화면 콘텐츠 좌우 여백 (메뉴·상세·영수증·모달 공통) */
```

기존 이름은 메뉴 그리드 전용이었으나 실제로는 `commonStyle`, `menu-detail`,
`receipt`, `feedback`, `accessibility`가 모두 같은 값을 쓴다. 사용처가 0건이라
이름 변경에 따른 영향은 없었다.

적용 결과 7곳은 완전 토큰화, 4곳은 부분 토큰화(`80px var(--asak-page-pad)` 형태)다.

값이 `60px`이지만 적용하지 않은 곳이 둘 있다. 역할이 페이지 여백이 아니다.

| 위치 | 값 | 역할 |
| --- | --- | --- |
| `accessibility.css:34` | `gap: 60px` | 세로 섹션 간격 |
| `home.css:84` | `padding: 60px` | 버튼 내부 4방향 여백 |

### 남은 88건

68건(77%)이 스케일 밖 실측값이다. 고유 37종이며 `5px`, `9px`, `15px`, `21px`,
`42px`, `43px`, `49px`, `51px` 같은 값이 포함된다.

**스케일에 맞추려면 값을 바꿔야 하므로 레이아웃이 실제로 움직인다.**
색과 달리 "값은 같고 표현만 토큰으로" 바꾸는 것이 불가능하다.
디자인에서 여백 스케일을 확정한 뒤에 처리할 일이다.

나머지 20건은 혼합 선언 안에 남은 스케일 내 값이다.

### Figma 쪽 현황

`Semantic/Spacing/XS·SM·MD`는 메뉴 상세(`134:7810`)에 실제로 바인딩되어 있다.
`LG`·`XL`·`XXL`은 확인한 화면에서 바인딩된 곳이 없었다.

Kiosk 토큰 `--asak-space-3`(12px), `--asak-space-5`(20px), `--asak-space-8`(40px)은
대응하는 Figma Semantic이 없는 코드 전용 단계다.

`receipt.css`의 `.is-high-contrast` 블록은 고대비 구현 작업에서 토큰 재정의 방식으로
교체할 예정이라 그대로 두었다.
