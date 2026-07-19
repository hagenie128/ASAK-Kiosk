# 키오스크 Mock 데이터

정본: `kiosk.json`  
현재 `MenuListPage` / `MenuDetailPage`가 직접 import. 이후 API 붙으면 adapter 경유로 통일.

## 경우의 수 (`scenarios` 키 참고)

| 케이스 | 찾는 법 | 기대 |
|--------|---------|------|
| 빈 카테고리 | categoryId `232` 기타 | empty-state |
| 메뉴 품절 | menuId `502`, `601`, `902` | 품절 뱃지·클릭 불가 |
| 재료 품절 메뉴 | menuId `602` | hasSoldOutIngredient |
| 알레르기 고지 | menuId `901` | allergens / allergyText |
| 필수옵션 기본값 없음 | menuId `701` | 담기 전 선택 필요 |
| 베이스 품절 옵션 | `1167` option `9102` | isSoldOut |
| 토핑·세트 품절 | `9203`, `9302` | 선택 불가 |
| 결제수단 | `paymentMethods` | 비활성 cash · 점검 payco |
| 결제 성공/거절/네트워크 | `paymentScenarios` | approve / declined / network |

카테고리별 메뉴: 신메뉴·샌드위치·샐러디·랩·프로틴 채움, **기타는 빈 목록**.
