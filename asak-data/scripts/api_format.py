"""Normalize DevCopilot API fields from Notion export (JSON body, query params)."""
from __future__ import annotations

import json
import re

PARAM_FIELD_RE = re.compile(
    r"(?:Path|Query|Param):\s*(.+?)(?:\(|$)",
    re.IGNORECASE,
)
FIELD_LIST_RE = re.compile(r"^[\w\[\],\s]+$")

# Sample query/path params (key=value&...)
API_PARAMS_SAMPLES: dict[str, str] = {
    "API-002": "categoryId=1",
    "API-003": "menuId=364",
    "API-004": "menuId=364",
    "API-007": "status=PAID",
    "API-008": "orderId=1",
    "API-010": "targetType=MENU&keyword=",
    "API-011": "categoryId=1&keyword=&isSoldOut=false",
    "API-014": "methodId=1",
    "API-015": "from=2026-07-01&to=2026-07-31",
}

# POST/PATCH JSON body samples when Notion has comma-separated field list only
API_BODY_SAMPLES: dict[str, dict] = {
    "API-005": {
        "orderType": "EAT_IN",
        "items": [
            {
                "menuId": 364,
                "quantity": 1,
                "optionItems": [{"optionItemId": 269, "quantity": 1}],
                "excludedIngredientIds": [],
            }
        ],
    },
    "API-006": {"orderId": 1, "paymentMethod": "CARD", "amount": 8900},
    "API-008": {"orderStatus": "PREPARING"},
    "API-009": {"targetType": "MENU", "targetId": 364, "isSoldOut": True},
    "API-012": {
        "categoryId": 1,
        "name": "새 메뉴",
        "price": 8900,
        "imageUrl": None,
        "description": "",
        "optionGroupIds": [240],
    },
    "API-014": {"isActive": True, "sortOrder": 1},
    "API-016": {
        "items": [
            {
                "menuId": 364,
                "quantity": 1,
                "optionItems": [],
                "excludedIngredientIds": [],
            }
        ],
    },
}

def _envelope(*, success: bool, status: int, code: str, message: str, data) -> dict:
    return {"success": success, "status": status, "code": code, "message": message, "data": data}


# Full success/error payloads (seed/menu.json id=364, category.json, option_item 269 등 기준)
_RESPONSE_BODIES: dict[str, tuple[dict, dict]] = {
    "API-001": (
        _envelope(
            success=True,
            status=200,
            code="CATEGORY_LIST_SUCCESS",
            message="카테고리 목록 조회 성공",
            data=[
                {"categoryId": 231, "name": "신메뉴", "sortOrder": 0},
                {"categoryId": 236, "name": "샌드위치", "sortOrder": 1},
                {"categoryId": 233, "name": "샐러디·볼", "sortOrder": 2},
                {"categoryId": 235, "name": "랩", "sortOrder": 3},
                {"categoryId": 234, "name": "프로틴", "sortOrder": 5},
                {"categoryId": 232, "name": "기타", "sortOrder": 8},
            ],
        ),
        _envelope(
            success=False,
            status=500,
            code="CATEGORY_LIST_FAILED",
            message="카테고리 목록 조회 중 오류가 발생했습니다.",
            data=None,
        ),
    ),
    "API-002": (
        _envelope(
            success=True,
            status=200,
            code="MENU_LIST_SUCCESS",
            message="메뉴 목록 조회 성공",
            data=[
                {
                    "menuId": 364,
                    "categoryId": 231,
                    "name": "스파이시 쉬림프 샌드위치",
                    "price": 8900,
                    "imageUrl": "/assets/menu/364.png",
                    "baseKcal": 464,
                    "isSoldOut": False,
                    "hasSoldOutIngredient": False,
                    "soldOutReason": None,
                    "soldOutBadges": [],
                }
            ],
        ),
        _envelope(
            success=False,
            status=404,
            code="CATEGORY_NOT_FOUND",
            message="존재하지 않는 카테고리입니다.",
            data=None,
        ),
    ),
    "API-003": (
        _envelope(
            success=True,
            status=200,
            code="MENU_DETAIL_SUCCESS",
            message="메뉴 상세 조회 성공",
            data={
                "menuId": 364,
                "categoryId": 231,
                "name": "스파이시 쉬림프 샌드위치",
                "price": 8900,
                "imageUrl": "/assets/menu/364.png",
                "description": "케이준 쉬림프, 할라피뇨, 토마토, 슈레드치즈, 화이트치즈 · 기본 드레싱: 크리미칠리",
                "baseKcal": 464,
                "ingredients": [
                    {"ingredientId": 155, "name": "케이준쉬림프", "canRemove": False, "isSoldOut": False},
                    {"ingredientId": 105, "name": "크리미칠리", "canRemove": True, "isSoldOut": False},
                    {"ingredientId": 377, "name": "화이트치즈", "canRemove": True, "isSoldOut": False},
                ],
                "allergens": [],
                "allergyText": "",
                "isSoldOut": False,
                "hasSoldOutIngredient": False,
                "isOrderable": True,
                "soldOutReason": None,
                "soldOutBadges": [],
            },
        ),
        _envelope(
            success=False,
            status=404,
            code="MENU_NOT_FOUND",
            message="존재하지 않는 메뉴입니다.",
            data=None,
        ),
    ),
    "API-004": (
        _envelope(
            success=True,
            status=200,
            code="MENU_OPTIONS_SUCCESS",
            message="메뉴 옵션 조회 성공",
            data=[
                {
                    "optionGroupId": 240,
                    "name": "드레싱 선택",
                    "groupType": "DRESSING",
                    "selectType": "SINGLE",
                    "minSelect": 1,
                    "maxSelect": 1,
                    "sortOrder": 1,
                    "isRequired": True,
                    "items": [
                        {
                            "optionItemId": 269,
                            "ingredientId": 105,
                            "name": "크리미칠리",
                            "extraPrice": 0,
                            "originalPrice": None,
                            "extraKcal": 235,
                            "servingAmount": 50,
                            "servingUnit": "g",
                            "proteinG": 0,
                            "iconUrl": None,
                            "colorHex": None,
                            "isRecommended": True,
                            "isDefault": True,
                            "isSoldOut": False,
                        },
                        {
                            "optionItemId": 247,
                            "ingredientId": 219,
                            "name": "(저당) 들기름소이",
                            "extraPrice": 0,
                            "originalPrice": None,
                            "extraKcal": None,
                            "servingAmount": 50,
                            "servingUnit": "g",
                            "isRecommended": False,
                            "isDefault": False,
                            "isSoldOut": False,
                        },
                    ],
                }
            ],
        ),
        _envelope(
            success=False,
            status=404,
            code="MENU_NOT_FOUND",
            message="존재하지 않는 메뉴입니다.",
            data=None,
        ),
    ),
    "API-005": (
        _envelope(
            success=True,
            status=201,
            code="ORDER_CREATE_SUCCESS",
            message="주문 생성 성공",
            data={
                "orderId": 1,
                "orderNo": "ASAK-20260703-001",
                "orderType": "TAKE_OUT",
                "totalPrice": 8900,
                "orderStatus": "RECEIVED",
                "paymentStatus": "READY",
            },
        ),
        _envelope(
            success=False,
            status=400,
            code="ORDER_INVALID",
            message="주문 정보가 올바르지 않습니다.",
            data=None,
        ),
    ),
    "API-006": (
        _envelope(
            success=True,
            status=200,
            code="PAYMENT_APPROVED",
            message="가상 결제가 승인되었습니다.",
            data={
                "paymentId": 1,
                "orderId": 1,
                "orderNo": "ASAK-20260703-001",
                "amount": 8900,
                "paymentStatus": "APPROVED",
                "paidAt": "2026-07-03T13:30:00",
            },
        ),
        _envelope(
            success=False,
            status=400,
            code="PAYMENT_AMOUNT_MISMATCH",
            message="결제 금액이 주문 금액과 일치하지 않습니다.",
            data=None,
        ),
    ),
    "API-007": (
        _envelope(
            success=True,
            status=200,
            code="ADMIN_ORDER_LIST_SUCCESS",
            message="관리자 주문 목록 조회 성공",
            data={
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
                                    {"optionItemId": 269, "name": "크리미칠리", "quantity": 1}
                                ],
                                "excludedIngredients": [
                                    {"ingredientId": 169, "name": "양파"}
                                ],
                            }
                        ],
                    }
                ],
                "totalElements": 1,
            },
        ),
        _envelope(
            success=False,
            status=400,
            code="ORDER_STATUS_INVALID",
            message="주문 상태값이 올바르지 않습니다.",
            data=None,
        ),
    ),
    "API-008": (
        _envelope(
            success=True,
            status=200,
            code="ORDER_STATUS_UPDATE_SUCCESS",
            message="주문 상태 변경 성공",
            data={
                "orderId": 1,
                "orderNo": "ASAK-20260703-001",
                "orderStatus": "PREPARING",
            },
        ),
        _envelope(
            success=False,
            status=400,
            code="ORDER_STATUS_INVALID",
            message="변경할 수 없는 주문 상태입니다.",
            data=None,
        ),
    ),
    "API-009": (
        _envelope(
            success=True,
            status=200,
            code="SOLD_OUT_UPDATE_SUCCESS",
            message="판매 항목 품절 상태 변경 성공",
            data={
                "targetType": "INGREDIENT",
                "targetId": 155,
                "name": "케이준쉬림프",
                "isSoldOut": True,
            },
        ),
        _envelope(
            success=False,
            status=404,
            code="SOLD_OUT_TARGET_NOT_FOUND",
            message="존재하지 않는 판매 항목입니다.",
            data=None,
        ),
    ),
    "API-010": (
        _envelope(
            success=True,
            status=200,
            code="SOLD_OUT_ITEM_LIST_SUCCESS",
            message="품절 항목 목록 조회 성공",
            data={
                "content": [
                    {
                        "targetType": "MENU",
                        "targetId": 364,
                        "name": "스파이시 쉬림프 샌드위치",
                        "isSoldOut": False,
                    },
                    {
                        "targetType": "INGREDIENT",
                        "targetId": 155,
                        "name": "케이준쉬림프",
                        "isSoldOut": False,
                    },
                ],
                "totalElements": 2,
            },
        ),
        _envelope(
            success=False,
            status=500,
            code="SOLD_OUT_ITEM_LIST_FAILED",
            message="품절 항목 목록 조회 실패",
            data=None,
        ),
    ),
    "API-011": (
        _envelope(
            success=True,
            status=200,
            code="ADMIN_MENU_LIST_SUCCESS",
            message="관리자 메뉴 목록 조회 성공",
            data={
                "content": [
                    {
                        "menuId": 364,
                        "categoryId": 231,
                        "name": "스파이시 쉬림프 샌드위치",
                        "price": 8900,
                        "isSoldOut": False,
                    }
                ],
                "totalElements": 1,
            },
        ),
        _envelope(
            success=False,
            status=500,
            code="ADMIN_MENU_LIST_FAILED",
            message="관리자 메뉴 목록 조회 실패",
            data=None,
        ),
    ),
    "API-012": (
        _envelope(
            success=True,
            status=200,
            code="ADMIN_MENU_UPSERT_SUCCESS",
            message="메뉴 저장 성공",
            data={
                "menuId": 364,
                "categoryId": 231,
                "name": "스파이시 쉬림프 샌드위치",
                "price": 8900,
                "imageUrl": "/assets/menu/364.png",
                "isSoldOut": False,
            },
        ),
        _envelope(
            success=False,
            status=500,
            code="ADMIN_MENU_SAVE_FAILED",
            message="메뉴 저장 실패",
            data=None,
        ),
    ),
    "API-013": (
        _envelope(
            success=True,
            status=200,
            code="PAYMENT_METHOD_LIST_SUCCESS",
            message="결제수단 목록 조회 성공",
            data=[
                {
                    "methodId": 19,
                    "code": "CARD",
                    "name": "카드",
                    "isActive": True,
                    "sortOrder": 1,
                }
            ],
        ),
        _envelope(
            success=False,
            status=500,
            code="PAYMENT_METHOD_LIST_FAILED",
            message="결제수단 목록 조회 실패",
            data=None,
        ),
    ),
    "API-014": (
        _envelope(
            success=True,
            status=200,
            code="PAYMENT_METHOD_UPDATE_SUCCESS",
            message="결제수단 설정 변경 성공",
            data={"methodId": 19, "code": "CARD", "name": "카드", "isActive": True, "sortOrder": 1},
        ),
        _envelope(
            success=False,
            status=500,
            code="PAYMENT_METHOD_UPDATE_FAILED",
            message="결제수단 설정 변경 실패",
            data=None,
        ),
    ),
    "API-015": (
        _envelope(
            success=True,
            status=200,
            code="ADMIN_DAILY_SALES_SUCCESS",
            message="일별 매출 조회 성공",
            data=[
                {"date": "2026-07-03", "orderCount": 1, "totalAmount": 8900},
                {"date": "2026-07-04", "orderCount": 0, "totalAmount": 0},
            ],
        ),
        _envelope(
            success=False,
            status=500,
            code="SALES_DAILY_FAILED",
            message="일별 매출 조회 실패",
            data=None,
        ),
    ),
    "API-016": (
        _envelope(
            success=True,
            status=200,
            code="CART_VALIDATE_SUCCESS",
            message="장바구니 검증 성공",
            data={
                "valid": True,
                "totalPrice": 8900,
                "items": [
                    {
                        "menuId": 364,
                        "menuName": "스파이시 쉬림프 샌드위치",
                        "quantity": 1,
                        "unitPrice": 8900,
                        "isAvailable": True,
                    }
                ],
            },
        ),
        _envelope(
            success=False,
            status=400,
            code="CART_INVALID",
            message="장바구니 검증 실패",
            data=None,
        ),
    ),
    "API-017": (
        _envelope(
            success=True,
            status=200,
            code="ACCESSIBILITY_SETTINGS_SUCCESS",
            message="접근성 설정 조회 성공",
            data=[
                {"code": "HIGH_CONTRAST", "name": "고대비", "isEnabled": True},
                {"code": "LARGE_TEXT", "name": "큰 글씨", "isEnabled": False},
            ],
        ),
        _envelope(
            success=False,
            status=500,
            code="ACCESSIBILITY_OPTION_FAILED",
            message="접근성 설정 조회 실패",
            data=None,
        ),
    ),
}


def _compact_json(obj: dict | list) -> str:
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))


API_RESPONSE_SAMPLES: dict[str, tuple[str, str]] = {
    api_id: (_compact_json(ok), _compact_json(err)) for api_id, (ok, err) in _RESPONSE_BODIES.items()
}


def extract_code_blocks(text: str) -> list[str]:
    return [
        m.group(1).strip()
        for m in re.finditer(r"```(?:json|plain text)?\s*(.*?)```", text or "", re.DOTALL)
    ]


def _looks_like_json(s: str) -> bool:
    s = (s or "").strip()
    return s.startswith("{") or s.startswith("[")


def _pretty_json(obj: dict | list) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)


def _is_envelope(obj: dict) -> bool:
    return "success" in obj and "status" in obj and "code" in obj


def _extract_code(value: str | dict) -> str:
    if isinstance(value, dict):
        return str(value.get("code") or "").strip()
    s = (value or "").strip()
    if _looks_like_json(s):
        try:
            obj = json.loads(s)
            if isinstance(obj, dict):
                return str(obj.get("code") or "").strip()
        except json.JSONDecodeError:
            pass
    if re.fullmatch(r"[A-Z0-9_]+", s):
        return s
    return ""


def _expand_code_envelope(api_id: str, code: str, *, success: bool) -> str:
    if api_id in API_RESPONSE_SAMPLES:
        return _pretty_json(json.loads(API_RESPONSE_SAMPLES[api_id][0 if success else 1]))
    status = 200 if success else 400
    if success and code.endswith("_CREATE_SUCCESS"):
        status = 201
    elif not success and code.endswith("_NOT_FOUND"):
        status = 404
    elif not success and code.endswith("_FAILED"):
        status = 500
    return _pretty_json(
        {
            "success": success,
            "status": status,
            "code": code,
            "message": "",
            "data": {} if success else None,
        }
    )


def _ensure_envelope(api_id: str, value: str, *, success: bool) -> str:
    if not value:
        return ""
    s = value.strip()
    if _looks_like_json(s):
        try:
            obj = json.loads(s)
            if isinstance(obj, dict):
                if _is_envelope(obj):
                    return _pretty_json(obj)
                code = _extract_code(obj)
                if code:
                    return _expand_code_envelope(api_id, code, success=success)
        except json.JSONDecodeError:
            pass
    code = _extract_code(s)
    if code:
        return _expand_code_envelope(api_id, code, success=success)
    return s


def _parse_property_json(raw: str) -> str:
    if not raw:
        return ""
    text = raw.replace("<br>", "\n").replace("\\{", "{").replace("\\}", "}")
    text = re.sub(r"\\\"", '"', text)
    if _looks_like_json(text.strip()):
        try:
            return _pretty_json(json.loads(text))
        except json.JSONDecodeError:
            pass
    m = re.search(r'"code"\s*:\s*"([A-Z0-9_]+)"', text)
    if m:
        return _compact_json({"code": m.group(1)})
    return text.strip()[:2000]


def _json_block_after(text: str, *keywords: str) -> str:
    lower = (text or "").lower()
    for kw in keywords:
        idx = lower.find(kw.lower())
        if idx < 0:
            continue
        rest = text[idx:]
        for block in extract_code_blocks(rest):
            if _looks_like_json(block):
                try:
                    return _pretty_json(json.loads(block))
                except json.JSONDecodeError:
                    continue
    for block in extract_code_blocks(text or ""):
        if _looks_like_json(block) and '"success"' in block:
            try:
                return _pretty_json(json.loads(block))
            except json.JSONDecodeError:
                continue
    return ""


def _json_error_block(text: str) -> str:
    for block in extract_code_blocks(text or ""):
        if _looks_like_json(block) and '"success": false' in block.replace(" ", ""):
            try:
                return _pretty_json(json.loads(block))
            except json.JSONDecodeError:
                continue
    lower = (text or "").lower()
    for kw in ("에러", "실패", "error"):
        idx = lower.find(kw)
        if idx >= 0:
            for block in extract_code_blocks(text[idx:]):
                if _looks_like_json(block):
                    try:
                        return _pretty_json(json.loads(block))
                    except json.JSONDecodeError:
                        continue
    return ""


def normalize_request_params(api_id: str, req: str, method: str, endpoint: str) -> str:
    if api_id in API_PARAMS_SAMPLES:
        return API_PARAMS_SAMPLES[api_id]
    req = (req or "").strip()
    if not req or req in ("없음", "none"):
        return ""
    m = PARAM_FIELD_RE.search(req)
    if m:
        fields = [f.strip() for f in re.split(r"[,，]", m.group(1)) if f.strip()]
        parts = []
        for f in fields:
            name = re.sub(r"\[\].*$", "", f.split("(")[0].strip())
            if name.lower() in ("from", "to"):
                parts.append(f"{name}=2026-07-01" if name == "from" else f"{name}=2026-07-31")
            elif name.lower() == "status":
                parts.append("status=PAID")
            elif name.lower() == "targettype":
                parts.append("targetType=MENU")
            elif name.lower() == "keyword":
                parts.append("keyword=")
            elif name.lower() == "issoldout":
                parts.append("isSoldOut=false")
            elif name.lower() == "categoryid":
                parts.append("categoryId=1")
            elif name.lower() == "menuid":
                parts.append("menuId=364")
            elif name.lower() == "orderid":
                parts.append("orderId=1")
            elif name.lower() == "methodid":
                parts.append("methodId=1")
            else:
                parts.append(f"{name}=1")
        return "&".join(parts)
    if "{" in endpoint and not req.startswith("{"):
        path_vars = re.findall(r"\{(\w+)\}", endpoint)
        if path_vars:
            samples = {"menuId": "364", "orderId": "1", "methodId": "1"}
            return "&".join(f"{v}={samples.get(v, '1')}" for v in path_vars)
    return req


def normalize_request_body(api_id: str, req: str, method: str, text: str) -> str:
    if method == "GET":
        return ""
    for block in extract_code_blocks(text or ""):
        if _looks_like_json(block) and '"success"' not in block:
            try:
                return _pretty_json(json.loads(block))
            except json.JSONDecodeError:
                continue
    req = (req or "").strip()
    if req and _looks_like_json(req):
        try:
            return _pretty_json(json.loads(req))
        except json.JSONDecodeError:
            return req
    if api_id in API_BODY_SAMPLES:
        return _pretty_json(API_BODY_SAMPLES[api_id])
    if req and FIELD_LIST_RE.match(req.replace(" ", "")):
        obj = {f.strip().rstrip("[]"): [] if "[]" in f else "" for f in req.split(",")}
        return _pretty_json(obj)
    return req


def normalize_response(api_id: str, raw: str, text: str, *, success: bool) -> str:
    if success:
        from_text = _json_block_after(text or "", "성공", "success", "response")
        if from_text:
            return _ensure_envelope(api_id, from_text, success=True)
        parsed = _parse_property_json(raw)
        if parsed:
            return _ensure_envelope(api_id, parsed, success=True)
        if api_id in API_RESPONSE_SAMPLES:
            return _pretty_json(json.loads(API_RESPONSE_SAMPLES[api_id][0]))
        return ""
    from_text = _json_error_block(text or "")
    if from_text:
        return _ensure_envelope(api_id, from_text, success=False)
    parsed = _parse_property_json(raw)
    if parsed:
        return _ensure_envelope(api_id, parsed, success=False)
    if api_id in API_RESPONSE_SAMPLES:
        return _pretty_json(json.loads(API_RESPONSE_SAMPLES[api_id][1]))
    return ""


def format_api_fields(
    api_id: str,
    method: str,
    endpoint: str,
    req: str,
    response_raw: str,
    error_raw: str,
    text: str,
) -> dict[str, str]:
    req = "" if (req or "").strip() == "없음" else (req or "").strip()
    if method == "GET":
        params = normalize_request_params(api_id, req, method, endpoint)
        body = ""
    else:
        params = normalize_request_params(api_id, "", method, endpoint)
        body = normalize_request_body(api_id, req, method, text)
    return {
        "request_params": params,
        "request_body": body,
        "response_success": normalize_response(api_id, response_raw, text, success=True),
        "response_error": normalize_response(api_id, error_raw, text, success=False),
    }
