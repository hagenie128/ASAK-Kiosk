# 키오스크 Mock 데이터

정본: `kiosk.json`

## 규모 (대량 보강)

| 항목 | 규모 |
|------|------|
| 카테고리 | 신메뉴·샌드위치·샐러디·랩·프로틴·기타(빈)·시즌오프(전체품절)·사이드·음료 |
| 메뉴 | 100개+ (카테고리별 분산) |
| 상세/옵션 | **모든 메뉴**에 `menuDetail` + `menuOptions` |
| 결제수단 | 8종 (활성/비활성/점검) |
| 결제 시나리오 | approve, approveHigh, declined, insufficient, network, timeout, duplicate, methodDisabled |
| 완료 샘플 | 20건 |

## 경우의 수

| 케이스 | 찾는 법 |
|--------|---------|
| 빈 카테고리 | `232` 기타 |
| 전부 품절 카테고리 | `239` 시즌오프 |
| 사이드·음료 | `240` |
| 메뉴 품절 / 재료 품절 | `scenarios.menuList.soldOutMenus` / `ingredientSoldOutMenus` |
| 옵션 변형 | 메뉴마다 6종 로테이션 (품절옵션·필수미선택·토핑 min 등) |
| 알레르기 | 상세마다 allergen 세트 순환 |
| 에러 envelope | `errorSamples` |

상세 인덱스는 JSON 안 `scenarios` 키.
