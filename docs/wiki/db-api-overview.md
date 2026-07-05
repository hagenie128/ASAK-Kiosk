# ASAK DB / API 개요

> DevCopilot·Notion export 기준 요약. 상세 스키마·명세는 DevCopilot workspace 2.

## DB 핵심 테이블 (21개)

| 영역 | 테이블 |
|------|--------|
| 마스터 | `category`, `code_group`, `common_code`, `tag`, `allergen` |
| 메뉴 | `menu`, `menu_tag`, `menu_nutrition`, `menu_ingredient` |
| 재료·알레르기 | `ingredient`, `ingredient_allergen` |
| 옵션 | `option_group`, `option_item`, `option_item_component`, `menu_option_group`, `menu_option` |
| 주문·결제 | `orders`, `order_item`, `order_item_option`, `item_exclusion`, `payment`, `payment_method_config` |

FK는 `테이블.컬럼` dot notation으로 DevCopilot ERD에 반영됩니다.

## API 목록 (API-001 ~ API-017)

| ID | 연계 요구사항 | 용도 (요약) |
|----|---------------|-------------|
| API-001~004 | FWD-MENU-* | 메뉴·카테고리·상세 조회 |
| API-005, 016 | FWD-ORDER/CART | 주문·장바구니 |
| API-006, 013~014 | FWD/LMIS-PAY | 결제 |
| API-007~008, 015 | LMIS-ORDER | 관리자 주문 |
| API-009~012 | LMIS-MENU | 관리자 메뉴·품절 |
| API-017 | FWD-UI | UI 보조 |

전체 endpoint·request/response는 DevCopilot **APIs** 탭 또는 `asak-data/scripts/notion_data.json` 참고.

## 요구사항·시나리오

- **요구사항 ID**: `FWD-*` (고객 키오스크), `LMIS-*` (관리자)
- **화면 ID**: `SCR-001` ~ `SCR-019` — Wiki 「ASAK 화면설계」 참고
- **시나리오 ID**: `SC-001` 등 — DevCopilot Scenarios

## 시드 데이터

```
asak-data/seed/
  menu.json, menu_option.json, ingredient.json, ...
  asak_seed_bundle.json  # 일괄 번들
```

로컬 적재: 백엔드 시드 스크립트 또는 phase1 파이프라인 산출물 연동.

## 관련 스크립트

```powershell
python asak-data/scripts/devcopilot_upload.py --data-only
python asak-data/scripts/export_screens.py
```
