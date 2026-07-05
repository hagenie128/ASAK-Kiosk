# ASAK REST API 명세서

> API 목록은 Notion DB 참조 — [06. API 명세](https://app.notion.com/p/34651ef04f0b838ca3a481e55eebfb2b)

> Notion 06. API 명세 · API-001~020 · 공통 응답 `{success,status,code,message,data}`

> **Week 5 MVP:** 고객 키오스크 주문 흐름(API-001~006) 완성이 최우선. 장치·멤버십·실결제·상세통계는 후반 확장.

## 작성 체크리스트

- [ ] API ID를 작성했는가?
- [ ] Method와 URL이 명확한가?
- [ ] Request Body 또는 Query String 예시가 있는가?
- [ ] 성공 Response Body 예시가 있는가?
- [ ] 실패 Response Body 예시가 있는가?
- [ ] 모든 응답이 `success`, `status`, `code`, `message`, `data` 구조를 따르는가?
- [ ] 관련 테이블을 적었는가?
- [ ] 처리 내용을 단계별로 적었는가?
- [ ] 화면 설계와 연결되는 API인지 확인했는가?
- [ ] Week 5 MVP 범위 밖 API를 9주 로드맵의 확장 기능으로 분리했는가?

## Part 0 — 공통

### ApiResponse envelope

모든 API 성공/실패 응답은 아래 필드를 포함한다. **비즈니스 payload는 `data`에만** 둔다.

```json
{ "success": true, "status": 200, "code": "...", "message": "...", "data": {} }
```

### 인증·공통 헤더·에러 처리

- Week 5 MVP(API-001~009): 별도 인증 없음. 관리자 API는 후반 JWT/세션 적용 예정.
- 공통 헤더: `Content-Type: application/json` (POST/PATCH), `Accept: application/json`
- 에러: HTTP status + `success=false` envelope. `code`로 프론트 분기.

### envelope 예시

#### API-001 카테고리 목록

**성공**

```json
{
  "success": true,
  "status": 200,
  "code": "CATEGORY_LIST_SUCCESS",
  "message": "카테고리 목록 조회 성공",
  "data": [
    {
      "categoryId": 231,
      "name": "신메뉴",
      "sortOrder": 0
    },
    {
      "categoryId": 236,
      "name": "샌드위치",
      "sortOrder": 1
    },
    {
      "categoryId": 233,
      "name": "샐러디·볼",
      "sortOrder": 2
    },
    {
      "categoryId": 235,
      "name": "랩",
      "sortOrder": 3
    },
    {
      "categoryId": 234,
      "name": "프로틴",
      "sortOrder": 5
    },
    {
      "categoryId": 232,
      "name": "기타",
      "sortOrder": 8
    }
  ]
}
```

**실패**

```json
{
  "success": false,
  "status": 500,
  "code": "CATEGORY_LIST_FAILED",
  "message": "카테고리 목록 조회 중 오류가 발생했습니다.",
  "data": null
}
```

#### API-005 주문 생성

**성공**

```json
{
  "success": true,
  "status": 201,
  "code": "ORDER_CREATE_SUCCESS",
  "message": "주문 생성 성공",
  "data": {
    "orderId": 1,
    "orderNo": "ASAK-20260703-001",
    "orderType": "TAKE_OUT",
    "totalPrice": 8900,
    "orderStatus": "RECEIVED",
    "paymentStatus": "READY"
  }
}
```

**실패**

```json
{
  "success": false,
  "status": 400,
  "code": "ORDER_INVALID",
  "message": "주문 정보가 올바르지 않습니다.",
  "data": null
}
```

#### API-006 결제 승인

**성공**

```json
{
  "success": true,
  "status": 200,
  "code": "PAYMENT_APPROVED",
  "message": "가상 결제가 승인되었습니다.",
  "data": {
    "paymentId": 1,
    "orderId": 1,
    "orderNo": "ASAK-20260703-001",
    "amount": 8900,
    "paymentStatus": "APPROVED",
    "paidAt": "2026-07-03T13:30:00"
  }
}
```

**실패**

```json
{
  "success": false,
  "status": 400,
  "code": "PAYMENT_AMOUNT_MISMATCH",
  "message": "결제 금액이 주문 금액과 일치하지 않습니다.",
  "data": null
}
```

#### API-007 관리자 주문 목록

**성공**

```json
{
  "success": true,
  "status": 200,
  "code": "ADMIN_ORDER_LIST_SUCCESS",
  "message": "관리자 주문 목록 조회 성공",
  "data": {
    "content": [
      {
        "orderId": 1,
        "orderNo": "ASAK-20260703-001",
        "orderType": "TAKE_OUT",
        "totalPrice": 8900,
        "orderStatus": "RECEIVED",
        "paymentStatus": "PAID",
        "createdAt": "2026-07-03T13:00:00",
        "items": [
          {
            "menuId": 364,
            "menuName": "스파이시 쉬림프 샌드위치",
            "quantity": 1,
            "unitPrice": 8900,
            "optionItems": [
              {
                "optionItemId": 269,
                "name": "크리미칠리",
                "quantity": 1
              }
            ],
            "excludedIngredients": [
              {
                "ingredientId": 169,
                "name": "양파"
              }
            ]
          }
        ]
      }
    ],
    "totalElements": 1
  }
}
```

**실패**

```json
{
  "success": false,
  "status": 400,
  "code": "ORDER_STATUS_INVALID",
  "message": "주문 상태값이 올바르지 않습니다.",
  "data": null
}
```

## 읽기 순서

1. **Part 0 — 공통** — envelope · 인증·헤더·에러
2. **Part 1 — 고객 키오스크 (Week 5 MVP)** — API-001~006
3. **Part 2 — 관리자 (Week 6)** — API-007~009
4. **Part 3 — Week 7~8 확장** — API-010~020

## Part 1 — 고객 키오스크 (Week 5 MVP)

키오스크 흐름: **카테고리 → 메뉴목록 → 메뉴상세 → 옵션 → 주문생성 → 결제**

| ID | Method | Endpoint | Request | Success (전체 envelope, data=payload) | 설명 |
|----|--------|----------|---------|---------------------------------------|------|
| API-001 | GET | `/api/categories` | — | `{"success":true,"status":200,"code":"CATEGORY_LIST_SUCCESS","message":"카테고리 목록 조회 성공","data":[{"categoryId":231,"name":"신메뉴","sortOrder":0},{"categoryId":236,"name":"샌드위치","sortOrder":1},{"categoryId":233,"name":"샐러디·볼","sortOrder":2},{"categoryId":235,"name":"랩","sortOrder":3},{"categoryId":234,"name":"프로틴","sortOrder":5},{"categoryId":232,"name":"기타","sortOrder":8}]}` | category 테이블에서 sort_order 기준으로 카테고리 목록 조회 |
| API-002 | GET | `/api/menus` | categoryId=1 | `{"success":true,"status":200,"code":"MENU_LIST_SUCCESS","message":"메뉴 목록 조회 성공","data":[{"menuId":364,"categoryId":231,"name":"스파이시 쉬림프 샌드위치","price":8900,"imageUrl":"/assets/menu/364.png","baseKcal":464,"isSoldOut":false,"hasSoldOutIngredient":false,"soldOutReason":null,"soldOutBadges":[]}]}` | 카테고리 조건에 따라 ASAK 메뉴 목록을 조회한다. |
| API-003 | GET | `/api/menus/{menuId}` | menuId=364 | `{"success":true,"status":200,"code":"MENU_DETAIL_SUCCESS","message":"메뉴 상세 조회 성공","data":{"menuId":364,"categoryId":231,"name":"스파이시 쉬림프 샌드위치","price":8900,"imageUrl":"/assets/menu/364.png","description":"케이준 쉬림프, 할라피뇨, 토마토, 슈레드치즈, 화이트치즈 · 기본 드레싱: 크리미칠리","baseKcal":464,"ingredients":[{"ingredientId":155,"name":"케이준쉬림프","canRemove":false,"isSoldOut":false},{"ingredientId":105,"name":"크리미칠리","canRemove":true,"isSoldOut":false},{"ingredientId":377,"name":"화이트치즈","canRemove":true,"isSoldOut":false}],"allergens":[],"allergyText":"","isSoldOut":false,"hasSoldOutIngredient":false,"isOrderable":true,"soldOutReason":null,"soldOutBadges":[]}}` | menuId로 메뉴 조회 |
| API-004 | GET | `/api/menus/{menuId}/options` | menuId=364 | `{"success":true,"status":200,"code":"MENU_OPTIONS_SUCCESS","message":"메뉴 옵션 조회 성공","data":[{"optionGroupId":240,"name":"드레싱 선택","groupType":"DRESSING","selectType":"SINGLE","minSelect":1,"maxSelect":1,"sortOrder":1,"isRequired":true,"items":[{"optionItemId":269,"ingredientId":105,"name":"크리미칠리","extraPrice":0,"originalPrice":null,"extraKcal":235,"servingAmount":50,"servingUnit":"g","proteinG":0,"iconUrl":null,"colorHex":null,"isRecommended":true,"isDefault":true,"isSoldOut":false},{"optionItemId":247,"ingredientId":219,"name":"(저당) 들기름소이","extraPrice":0,"originalPrice":null,"extraKcal":null,"servingAmount":50,"servingUnit":"g","isRecommended":false,"isDefault":false,"isSoldOut":false}]}]}` | 베이스/드레싱/토핑/세트 옵션 목록 조회 |
| API-005 | POST | `/api/orders` | {"orderType":"EAT_IN","items":[{"menuId":364,"quantity":1,"o | `{"success":true,"status":201,"code":"ORDER_CREATE_SUCCESS","message":"주문 생성 성공","data":{"orderId":1,"orderNo":"ASAK-20260703-001","orderType":"TAKE_OUT","totalPrice":8900,"orderStatus":"RECEIVED","paymentStatus":"READY"}}` | 장바구니 내용을 기준으로 주문을 생성한다. |
| API-006 | POST | `/api/payments` | {"orderId":1,"paymentMethod":"CARD","amount":8900} | `{"success":true,"status":200,"code":"PAYMENT_APPROVED","message":"가상 결제가 승인되었습니다.","data":{"paymentId":1,"orderId":1,"orderNo":"ASAK-20260703-001","amount":8900,"paymentStatus":"APPROVED","paidAt":"2026-07-03T13:30:00"}}` | 결제 승인 처리 및 결제 정보 저장 |

## Part 2 — 관리자 (Week 6)

| ID | Method | Endpoint | Request | Success (전체 envelope, data=payload) | 설명 |
|----|--------|----------|---------|---------------------------------------|------|
| API-007 | GET | `/api/admin/orders` | status=PAID | `{"success":true,"status":200,"code":"ADMIN_ORDER_LIST_SUCCESS","message":"관리자 주문 목록 조회 성공","data":{"content":[{"orderId":1,"orderNo":"ASAK-20260703-001","orderType":"TAKE_OUT","totalPrice":8900,"orderStatus":"RECEIVED","paymentStatus":"PAID","createdAt":"2026-07-03T13:00:00","items":[{"menuId":364,"menuName":"스파이시 쉬림프 샌드위치","quantity":1,"unitPrice":8900,"optionItems":[{"optionItemId":269,"name":"크리미칠리","quantity":1}],"excludedIngredients":[{"ingredientId":169,"name":"양파"}]}]}],"totalElements":1}}` | 관리자용 주문 목록과 상세 조회 |
| API-008 | PATCH | `/api/admin/orders/{orderId}/status` | {"orderStatus":"PREPARING"} | `{"success":true,"status":200,"code":"ORDER_STATUS_UPDATE_SUCCESS","message":"주문 상태 변경 성공","data":{"orderId":1,"orderNo":"ASAK-20260703-001","orderStatus":"PREPARING"}}` | 관리자가 주문 상태를 변경한다. |
| API-009 | PATCH | `/api/admin/sold-out-items` | {"targetType":"MENU","targetId":364,"isSoldOut":true} | `{"success":true,"status":200,"code":"SOLD_OUT_UPDATE_SUCCESS","message":"판매 항목 품절 상태 변경 성공","data":{"targetType":"INGREDIENT","targetId":155,"name":"케이준쉬림프","isSoldOut":true}}` | 메뉴/재료/옵션 품절 상태 변경 |

## Part 3 — Week 7~8 확장 (API-010~020)

| ID | Method | Endpoint | REQ | 설명 |
|----|--------|----------|-----|------|
| API-010 | GET | `/api/admin/sold-out-items` | targetType=MENU&keyword= | 품절 처리 대상 목록 조회 |
| API-011 | GET | `/api/admin/menus` | categoryId=1&keyword=&isSoldOut=false | 관리자 메뉴 목록 조회 |
| API-012 | POST | `/api/admin/menus` | {"categoryId":1,"name":"새 메뉴","price":8900,"imageU | 관리자 메뉴 등록/수정 |
| API-013 | GET | `/api/payment-methods` | — | 키오스크 결제수단 목록 조회 |
| API-014 | PATCH | `/api/admin/payment-methods/{methodId}` | {"isActive":true,"sortOrder":1} | 결제수단 노출/정렬 변경 |
| API-015 | GET | `/api/admin/sales/daily` | from=2026-07-01&to=2026-07-31 | 일자별 주문수와 결제금액 조회 |
| API-016 | POST | `/api/cart/validate` | {"items":[{"menuId":364,"quantity":1,"optionItems" | 장바구니 주문 가능 여부 검증 |
| API-017 | GET | `/api/ui/accessibility-options` | — | 접근성 옵션 목록 조회 |
| API-018 | POST | `/api/membership/stamps` | orderId, memberId, confirmStamp | 결제 후 스탬프 1회 확인·적립 (SC-006, 확장) |
| API-019 | POST | `/api/orders/{orderId}/receipt-print` | orderId | 모의 프린터 출력 요청 (SC-015, Week 5 MVP 제외) |
| API-020 | POST | `/api/device/scan` | scanType, code | 쿠폰/멤버십 인식 (SC-016, 확장) |

## 상태값 (common_code)

| 구분 | 코드 |
|------|------|
| 주문상태 | RECEIVED, PREPARING, COMPLETED |
| 결제상태 | READY, APPROVED, FAILED |
| 주문유형 | EAT_IN, TAKE_OUT |

상세 request/response JSON은 Notion 06. API 명세 본문 참고.
