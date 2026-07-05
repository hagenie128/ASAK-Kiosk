#!/usr/bin/env python3
"""크롤링 산출물 → ASAK 3NF 시드 JSON 변환."""

from __future__ import annotations

import json
import re
import unicodedata
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
PHASE1 = Path(__file__).resolve().parent
INPUT_DIR = PHASE1 / "output"
OUTPUT_DIR = ROOT / "asak-data" / "seed"

# 샐러디 참고 필드만 사용 (스크래핑 스키마 그대로 옮기지 않음)
SALADY_REFERENCE_FIELDS = (
    "name_ko",
    "image_url",
    "nutrition",
    "nutrition_pdf",
    "calorie_calculator",
    "toppings_text",
    "default_dressing",
    "allergy",
    "tags",
    "store_pricing",
    "set_variants",
)

EXTRA_TOPPING_TYPE = {
    "Base": "BASE",
    "Protein": "PROTEIN",
    "Veggies": "VEGGIE",
    "Crispy": "SIDE",
    "Side": "SIDE",
    "Drink": "BEVERAGE",
    "Dressing": "DRESSING",
    "Sauce & Mousse": "DRESSING",
}

CATEGORY_MAP = {
    "샌드위치": "샌드위치",
    "샐러디": "샐러디·볼",
    "누들볼": "샐러디·볼",
    "그레인볼": "샐러디·볼",
    "랩": "랩",
    "곡물랩": "랩",
    "올데이 세트": "세트",
    "세트": "세트",
    "새로운 메뉴": "신메뉴",
    "신메뉴": "신메뉴",
    "음료&사이드": "사이드·음료",
    "사이드": "사이드·음료",
    "음료": "사이드·음료",
    "프로틴 박스": "프로틴",
    "마이 샐러디": "커스텀",
}

CATEGORY_ORDER = [
    "신메뉴",
    "샌드위치",
    "샐러디·볼",
    "랩",
    "세트",
    "프로틴",
    "사이드·음료",
    "커스텀",
    "기타",
]

DEFAULT_PRICES = {
    "샌드위치": 8900,
    "샐러디·볼": 9900,
    "랩": 8500,
    "세트": 11400,
    "신메뉴": 9200,
    "사이드·음료": 2500,
    "프로틴": 10900,
    "커스텀": 8900,
    "기타": 8900,
}

TOPPING_EXTRA_PRICE = {
    "PROTEIN": 1900,
    "VEGGIE": 700,
    "SIDE": 900,
    "DRESSING": 500,
    "BASE": 1500,
    "BEVERAGE": 0,
}

BASE_ADDON_LABEL = {
    "vegetable": "채소 추가",
    "grain": "곡물/현미 추가",
    "buckwheat": "메밀면 추가",
    "noodles": "파스타면 추가",
}


class IdGen:
    def __init__(self, start: int = 1) -> None:
        self._n = start

    def next(self) -> int:
        val = self._n
        self._n += 1
        return val


def norm_name(name: str) -> str:
    text = unicodedata.normalize("NFKC", name or "")
    return re.sub(r"\s+", "", text).lower()


def parse_topping_names(text: str) -> list[str]:
    if not text:
        return []
    parts = re.split(r"[,/·]", text)
    return [p.strip() for p in parts if p.strip()]


def pick_price(menu: dict[str, Any], category_name: str) -> int:
    for entry in (menu.get("store_pricing") or {}).values():
        if entry.get("set_info"):
            continue
        price = entry.get("price_krw")
        if price:
            return int(price)
    variants = menu.get("set_variants") or []
    if variants and variants[0].get("base_price_krw"):
        return int(variants[0]["base_price_krw"])
    return DEFAULT_PRICES.get(category_name, 8900)


def nutrition_from_menu(menu: dict[str, Any]) -> dict[str, float | None]:
    pdf = menu.get("nutrition_pdf") or {}
    nut = menu.get("nutrition") or {}
    cc = menu.get("calorie_calculator") or {}
    return {
        "kcal": _num(pdf.get("calories_kcal"))
        or _num(cc.get("base_kcal"))
        or _num(nut.get("열량(kcal)")),
        "protein_g": _num(pdf.get("protein_g")) or _num(nut.get("단백질(g)")),
        "carb_g": _num(pdf.get("carbs_g")) or _num(nut.get("탄수화물(g)")),
        "fat_g": _num(pdf.get("fat_g")) or _num(nut.get("지방(g)")),
        "sodium_mg": _num(pdf.get("sodium_mg")) or _num(nut.get("나트륨(mg)")),
    }


def _num(v: Any) -> float | None:
    if v is None or v == "":
        return None
    try:
        return round(float(v), 1)
    except (TypeError, ValueError):
        return None


def build_common_codes(ids: IdGen) -> tuple[list[dict], list[dict], dict[str, int]]:
    groups_spec = [
        ("ORDER_STATUS", "주문 상태"),
        ("PAYMENT_STATUS", "결제 상태"),
        ("ORDER_TYPE", "주문 유형"),
        ("PAYMENT_METHOD", "결제 수단"),
        ("OPTION_GROUP_TYPE", "옵션 그룹 유형"),
        ("INGREDIENT_TYPE", "재료 유형"),
        ("MENU_INGREDIENT_ROLE", "메뉴 재료 역할"),
        ("UNIT_TYPE", "단위"),
        ("TAG_TYPE", "태그 유형"),
        ("DATA_SOURCE", "데이터 출처"),
    ]
    codes_spec: dict[str, list[tuple[str, str]]] = {
        "ORDER_STATUS": [
            ("RECEIVED", "접수"),
            ("PREPARING", "준비중"),
            ("COMPLETED", "완료"),
        ],
        "PAYMENT_STATUS": [
            ("READY", "결제 대기"),
            ("APPROVED", "결제 승인"),
            ("FAILED", "결제 실패"),
        ],
        "ORDER_TYPE": [("EAT_IN", "먹고가기"), ("TAKE_OUT", "포장")],
        "PAYMENT_METHOD": [("CARD", "카드")],
        "OPTION_GROUP_TYPE": [
            ("TOPPING", "토핑 추가"),
            ("DRESSING", "드레싱 선택"),
            ("BASE", "베이스 선택/추가"),
            ("SET_SIDE", "세트 사이드 선택"),
            ("SET_DRINK", "세트 음료 선택"),
            ("REQUEST", "빼기/요청사항"),
        ],
        "INGREDIENT_TYPE": [
            ("VEGGIE", "채소"),
            ("PROTEIN", "단백질"),
            ("DRESSING", "드레싱"),
            ("BASE", "베이스"),
            ("SIDE", "사이드"),
            ("BEVERAGE", "음료"),
        ],
        "MENU_INGREDIENT_ROLE": [
            ("CORE", "핵심 재료"),
            ("BASE", "베이스 재료"),
            ("DEFAULT", "일반 기본 재료"),
        ],
        "UNIT_TYPE": [("G", "g"), ("ML", "ml"), ("EA", "개")],
        "TAG_TYPE": [
            ("BEST", "베스트"),
            ("NEW", "신규"),
            ("LOW_SUGAR", "저당"),
        ],
        "DATA_SOURCE": [
            ("SALADY_REFERENCE", "샐러디 참고 데이터"),
            ("ASAK_CURATED", "ASAK 큐레이션"),
        ],
    }

    code_groups: list[dict] = []
    group_id_by_code: dict[str, int] = {}
    for group_code, group_name in groups_spec:
        gid = ids.next()
        group_id_by_code[group_code] = gid
        code_groups.append(
            {"id": gid, "group_code": group_code, "name": group_name}
        )

    common_codes: list[dict] = []
    code_id_by_key: dict[str, int] = {}
    sort = 1
    for group_code, items in codes_spec.items():
        gid = group_id_by_code[group_code]
        for code, name in items:
            cid = ids.next()
            code_id_by_key[f"{group_code}.{code}"] = cid
            common_codes.append(
                {
                    "id": cid,
                    "code_group_id": gid,
                    "code": code,
                    "name": name,
                    "sort_order": sort,
                    "is_active": True,
                }
            )
            sort += 1
    return code_groups, common_codes, code_id_by_key


def main() -> None:
    menus: list[dict] = json.loads((INPUT_DIR / "menus.json").read_text("utf-8"))
    dressings_doc: dict = json.loads((INPUT_DIR / "dressings.json").read_text("utf-8"))
    extra_toppings: dict = json.loads(
        (INPUT_DIR / "extra_toppings.json").read_text("utf-8")
    )
    allergy_rows: list[dict] = json.loads(
        (INPUT_DIR / "allergy_pdf.json").read_text("utf-8")
    )

    ids = IdGen()
    now = datetime.now(timezone.utc).isoformat()

    code_groups, common_codes, code_ids = build_common_codes(ids)

    # --- allergen ---
    allergen_name_to_id: dict[str, int] = {}
    allergens: list[dict] = []
    for row in allergy_rows:
        for name in row.get("allergens") or []:
            name = name.strip()
            if not name or name in allergen_name_to_id:
                continue
            aid = ids.next()
            allergen_name_to_id[name] = aid
            allergens.append({"id": aid, "name": name})
    for menu in menus:
        for name in menu.get("allergy") or []:
            if name not in allergen_name_to_id:
                aid = ids.next()
                allergen_name_to_id[name] = aid
                allergens.append({"id": aid, "name": name})
    for item in dressings_doc.get("items") or []:
        for name in item.get("allergens") or []:
            if name not in allergen_name_to_id:
                aid = ids.next()
                allergen_name_to_id[name] = aid
                allergens.append({"id": aid, "name": name})

    # --- ingredient master ---
    ingredient_by_norm: dict[str, int] = {}
    ingredients: list[dict] = []
    ingredient_allergens: list[dict] = []
    allergy_by_item: dict[str, list[str]] = {
        row["menu"]: row.get("allergens") or [] for row in allergy_rows
    }

    def upsert_ingredient(
        name: str,
        type_code: str,
        nutrition: dict[str, Any] | None = None,
        allergen_names: list[str] | None = None,
    ) -> int:
        key = norm_name(name)
        if key in ingredient_by_norm:
            return ingredient_by_norm[key]
        iid = ids.next()
        ingredient_by_norm[key] = iid
        nut = nutrition or {}
        ingredients.append(
            {
                "id": iid,
                "name": name,
                "type_id": code_ids[f"INGREDIENT_TYPE.{type_code}"],
                "kcal": _num(nut.get("calories_kcal") or nut.get("kcal")),
                "protein_g": _num(nut.get("protein_g")),
                "is_sold_out": False,
            }
        )
        for an in allergen_names or allergy_by_item.get(name) or []:
            if an not in allergen_name_to_id:
                allergen_name_to_id[an] = ids.next()
                allergens.append({"id": allergen_name_to_id[an], "name": an})
            ingredient_allergens.append(
                {
                    "id": ids.next(),
                    "ingredient_id": iid,
                    "allergen_id": allergen_name_to_id[an],
                }
            )
        return iid

    for section, rows in extra_toppings.items():
        type_code = EXTRA_TOPPING_TYPE.get(section, "SIDE")
        for row in rows:
            name = row.get("menu")
            if not name:
                continue
            upsert_ingredient(name, type_code, row, allergy_by_item.get(name))

    for item in dressings_doc.get("items") or []:
        name = item.get("name")
        if not name:
            continue
        nut = item.get("nutrition_pdf") or {}
        if item.get("kcal"):
            nut = {**nut, "calories_kcal": item["kcal"]}
        upsert_ingredient(
            name,
            "DRESSING",
            nut,
            item.get("allergens") or allergy_by_item.get(name),
        )

    # --- category ---
    category_name_to_id: dict[str, int] = {}
    categories: list[dict] = []

    def category_for(menu: dict) -> str:
        raw = menu.get("nav_category") or menu.get("category") or "기타"
        return CATEGORY_MAP.get(raw, raw if raw in CATEGORY_ORDER else "기타")

    main_menus = [m for m in menus if m.get("menu_type") == "main"]
    for menu in main_menus:
        cat = category_for(menu)
        if cat not in category_name_to_id:
            cid = ids.next()
            category_name_to_id[cat] = cid
            categories.append(
                {
                    "id": cid,
                    "name": cat,
                    "sort_order": CATEGORY_ORDER.index(cat)
                    if cat in CATEGORY_ORDER
                    else 99,
                    "is_active": True,
                }
            )

    # --- tag ---
    tag_code_to_id = {
        "BEST": ids.next(),
        "NEW": ids.next(),
        "LOW_SUGAR": ids.next(),
    }
    tags = [
        {
            "id": tag_code_to_id["BEST"],
            "code": "BEST",
            "name": "BEST",
            "color_hex": "#2d8a4e",
            "is_active": True,
        },
        {
            "id": tag_code_to_id["NEW"],
            "code": "NEW",
            "name": "NEW",
            "color_hex": "#2563eb",
            "is_active": True,
        },
        {
            "id": tag_code_to_id["LOW_SUGAR"],
            "code": "LOW_SUGAR",
            "name": "저당",
            "color_hex": "#b45309",
            "is_active": True,
        },
    ]

    # --- global option groups ---
    option_groups: list[dict] = []
    og_ids: dict[str, int] = {}
    og_specs = [
        ("dressing_select", "드레싱 선택", "DRESSING", 1, 1),
        ("dressing_extra", "드레싱 추가", "DRESSING", 0, 2),
        ("topping_add", "토핑 추가", "TOPPING", 0, 5),
        ("base_change", "베이스 변경", "BASE", 0, 1),
        ("set_side", "세트 사이드", "SET_SIDE", 1, 1),
        ("set_drink", "세트 음료", "SET_DRINK", 1, 1),
        ("remove_item", "재료 빼기", "REQUEST", 0, 10),
    ]
    for key, name, gtype, min_s, max_s in og_specs:
        ogid = ids.next()
        og_ids[key] = ogid
        option_groups.append(
            {
                "id": ogid,
                "name": name,
                "group_type_id": code_ids[f"OPTION_GROUP_TYPE.{gtype}"],
                "min_select": min_s,
                "max_select": max_s,
            }
        )

    # --- option items (dressings, toppings, bases, set sides/drinks) ---
    option_items: list[dict] = []
    dressing_option_ids: dict[str, int] = {}
    topping_option_ids: dict[str, int] = {}
    base_option_ids: dict[str, int] = {}
    side_option_ids: dict[str, int] = {}
    drink_option_ids: dict[str, int] = {}

    for item in dressings_doc.get("items") or []:
        name = item["name"]
        iid = ingredient_by_norm.get(norm_name(name))
        nut = item.get("nutrition_pdf") or {}
        oid = ids.next()
        dressing_option_ids[name] = oid
        option_items.append(
            {
                "id": oid,
                "option_group_id": og_ids["dressing_select"],
                "ingredient_id": iid,
                "name": name,
                "extra_price": 0,
                "original_price": None,
                "amount": nut.get("weight_g") or 50,
                "unit_id": code_ids["UNIT_TYPE.G"],
                "icon_url": None,
                "color_hex": None,
                "is_sold_out": False,
                "created_at": now,
                "updated_at": now,
            }
        )
        extra_oid = ids.next()
        option_items.append(
            {
                **option_items[-1],
                "id": extra_oid,
                "option_group_id": og_ids["dressing_extra"],
                "extra_price": TOPPING_EXTRA_PRICE["DRESSING"],
            }
        )

    for section in ("Protein", "Veggies", "Crispy"):
        type_code = EXTRA_TOPPING_TYPE[section]
        for row in extra_toppings.get(section, []):
            name = row["menu"]
            iid = ingredient_by_norm.get(norm_name(name))
            oid = ids.next()
            topping_option_ids[name] = oid
            option_items.append(
                {
                    "id": oid,
                    "option_group_id": og_ids["topping_add"],
                    "ingredient_id": iid,
                    "name": name,
                    "extra_price": TOPPING_EXTRA_PRICE[type_code],
                    "original_price": None,
                    "amount": row.get("weight_g"),
                    "unit_id": code_ids["UNIT_TYPE.G"],
                    "icon_url": None,
                    "color_hex": None,
                    "is_sold_out": False,
                    "created_at": now,
                    "updated_at": now,
                }
            )

    for row in extra_toppings.get("Base", []):
        name = row["menu"]
        if name in ("채소볼",):
            continue
        iid = ingredient_by_norm.get(norm_name(name))
        oid = ids.next()
        base_option_ids[name] = oid
        option_items.append(
            {
                "id": oid,
                "option_group_id": og_ids["base_change"],
                "ingredient_id": iid,
                "name": name,
                "extra_price": TOPPING_EXTRA_PRICE["BASE"],
                "original_price": None,
                "amount": row.get("weight_g"),
                "unit_id": code_ids["UNIT_TYPE.G"],
                "icon_url": None,
                "color_hex": None,
                "is_sold_out": False,
                "created_at": now,
                "updated_at": now,
            }
        )

    for row in extra_toppings.get("Side", []):
        name = row["menu"]
        iid = ingredient_by_norm.get(norm_name(name))
        oid = ids.next()
        side_option_ids[name] = oid
        option_items.append(
            {
                "id": oid,
                "option_group_id": og_ids["set_side"],
                "ingredient_id": iid,
                "name": name,
                "extra_price": 0,
                "original_price": None,
                "amount": row.get("weight_g"),
                "unit_id": code_ids["UNIT_TYPE.G"],
                "icon_url": None,
                "color_hex": None,
                "is_sold_out": False,
                "created_at": now,
                "updated_at": now,
            }
        )

    for row in extra_toppings.get("Drink", []):
        name = row["menu"]
        iid = ingredient_by_norm.get(norm_name(name))
        oid = ids.next()
        drink_option_ids[name] = oid
        option_items.append(
            {
                "id": oid,
                "option_group_id": og_ids["set_drink"],
                "ingredient_id": iid,
                "name": name,
                "extra_price": 0,
                "original_price": None,
                "amount": row.get("weight_g") or 350,
                "unit_id": code_ids["UNIT_TYPE.ML"],
                "icon_url": None,
                "color_hex": None,
                "is_sold_out": False,
                "created_at": now,
                "updated_at": now,
            }
        )

    option_items_by_group: dict[int, list[dict]] = defaultdict(list)
    for oi in option_items:
        option_items_by_group[oi["option_group_id"]].append(oi)

    # --- menus ---
    asak_menus: list[dict] = []
    menu_tags: list[dict] = []
    menu_nutritions: list[dict] = []
    menu_ingredients: list[dict] = []
    menu_option_groups: list[dict] = []
    menu_options: list[dict] = []
    option_item_components: list[dict] = []

    protein_keywords = ("닭", "치킨", "연어", "새우", "쉬림프", "스테이크", "베이컨", "참치", "두부", "에그", "계란", "고기", "햄")
    remove_option_by_ingredient: dict[int, int] = {}

    for menu in main_menus:
        mid = ids.next()
        cat = category_for(menu)
        cat_id = category_name_to_id[cat]
        price = pick_price(menu, cat)
        desc_parts = []
        if menu.get("toppings_text"):
            desc_parts.append(menu["toppings_text"])
        if menu.get("default_dressing"):
            desc_parts.append(f"기본 드레싱: {menu['default_dressing']}")
        description = " · ".join(desc_parts)

        asak_menus.append(
            {
                "id": mid,
                "category_id": cat_id,
                "name": menu["name_ko"],
                "price": price,
                "image_url": menu.get("image_url") or "",
                "description": description,
                "is_sold_out": False,
                "created_at": now,
                "updated_at": now,
                "_source_ref": {
                    "salady_id": menu.get("id"),
                    "fields_used": list(SALADY_REFERENCE_FIELDS),
                },
            }
        )

        for tag_name in menu.get("tags") or []:
            code = "LOW_SUGAR" if "저당" in tag_name else tag_name.upper()
            if code in tag_code_to_id:
                menu_tags.append(
                    {"id": ids.next(), "menu_id": mid, "tag_id": tag_code_to_id[code]}
                )

        nut = nutrition_from_menu(menu)
        if nut["kcal"]:
            menu_nutritions.append(
                {
                    "id": ids.next(),
                    "menu_id": mid,
                    "kcal": nut["kcal"],
                    "protein_g": nut["protein_g"],
                    "carb_g": nut["carb_g"],
                    "fat_g": nut["fat_g"],
                    "sodium_mg": nut["sodium_mg"],
                    "source_id": code_ids["DATA_SOURCE.SALADY_REFERENCE"],
                }
            )

        sort = 1
        base_name = (menu.get("base") or "").strip()
        if base_name:
            bid = upsert_ingredient(base_name, "BASE", allergen_names=[])
            menu_ingredients.append(
                {
                    "id": ids.next(),
                    "menu_id": mid,
                    "ingredient_id": bid,
                    "role_id": code_ids["MENU_INGREDIENT_ROLE.BASE"],
                    "quantity": None,
                    "unit_id": None,
                    "is_default": True,
                    "can_remove": False,
                    "sort_order": sort,
                }
            )
            sort += 1

        default_dressing = (menu.get("default_dressing") or "").strip()
        if default_dressing:
            did = ingredient_by_norm.get(norm_name(default_dressing))
            if did:
                menu_ingredients.append(
                    {
                        "id": ids.next(),
                        "menu_id": mid,
                        "ingredient_id": did,
                        "role_id": code_ids["MENU_INGREDIENT_ROLE.DEFAULT"],
                        "quantity": 50,
                        "unit_id": code_ids["UNIT_TYPE.G"],
                        "is_default": True,
                        "can_remove": True,
                        "sort_order": sort,
                    }
                )
                sort += 1

        for topping_name in parse_topping_names(menu.get("toppings_text") or ""):
            if topping_name == default_dressing:
                continue
            tid = ingredient_by_norm.get(norm_name(topping_name))
            if not tid:
                tid = upsert_ingredient(topping_name, "VEGGIE")
            role = "CORE" if any(k in topping_name for k in protein_keywords) else "DEFAULT"
            menu_ingredients.append(
                {
                    "id": ids.next(),
                    "menu_id": mid,
                    "ingredient_id": tid,
                    "role_id": code_ids[f"MENU_INGREDIENT_ROLE.{role}"],
                    "quantity": None,
                    "unit_id": code_ids["UNIT_TYPE.G"],
                    "is_default": True,
                    "can_remove": role != "CORE",
                    "sort_order": sort,
                }
            )
            sort += 1
            if role == "DEFAULT" and tid not in remove_option_by_ingredient:
                oid = ids.next()
                remove_option_by_ingredient[tid] = oid
                option_items.append(
                    {
                        "id": oid,
                        "option_group_id": og_ids["remove_item"],
                        "ingredient_id": tid,
                        "name": f"{topping_name} 빼기",
                        "extra_price": 0,
                        "original_price": None,
                        "amount": None,
                        "unit_id": None,
                        "icon_url": None,
                        "color_hex": None,
                        "is_sold_out": False,
                        "created_at": now,
                        "updated_at": now,
                    }
                )
                option_items_by_group[og_ids["remove_item"]].append(option_items[-1])

        this_menu_og_keys: list[str] = []
        mog_sort = 1

        def attach_option_group(key: str, *, required: bool) -> None:
            nonlocal mog_sort
            menu_option_groups.append(
                {
                    "id": ids.next(),
                    "menu_id": mid,
                    "option_group_id": og_ids[key],
                    "sort_order": mog_sort,
                    "is_required": required,
                }
            )
            this_menu_og_keys.append(key)
            mog_sort += 1

        if default_dressing or cat in ("샐러디·볼", "샌드위치", "랩", "신메뉴"):
            attach_option_group("dressing_select", required=bool(default_dressing))
            attach_option_group("dressing_extra", required=False)

        if cat in ("샐러디·볼", "커스텀") and menu.get("calorie_calculator"):
            attach_option_group("base_change", required=False)

        attach_option_group("topping_add", required=False)

        variants = menu.get("set_variants") or []
        set_comps = variants[0].get("set_components") or [] if variants else []
        if variants:
            attach_option_group("set_side", required=True)
            attach_option_group("set_drink", required=True)

        removable = [
            mi
            for mi in menu_ingredients
            if mi["menu_id"] == mid and mi.get("can_remove")
        ]
        removable_ids = {row["ingredient_id"] for row in removable}
        if removable:
            attach_option_group("remove_item", required=False)

        default_option_names: set[str] = set()
        if default_dressing:
            default_option_names.add(default_dressing)
        if set_comps:
            default_option_names.add(set_comps[0])
            if len(set_comps) > 1:
                default_option_names.add(set_comps[1])

        for key in this_menu_og_keys:
            mo_sort = 1
            default_assigned = False
            for oi in option_items_by_group.get(og_ids[key], []):
                if key == "remove_item" and oi.get("ingredient_id") not in removable_ids:
                    continue
                is_default = (
                    not default_assigned
                    and key in ("dressing_select", "set_side", "set_drink")
                    and oi["name"] in default_option_names
                )
                if is_default:
                    default_assigned = True
                is_recommended = is_default or (
                    key == "dressing_select" and oi["name"] == default_dressing
                )
                menu_options.append(
                    {
                        "id": ids.next(),
                        "menu_id": mid,
                        "option_item_id": oi["id"],
                        "is_recommended": is_recommended,
                        "is_default": is_default,
                        "sort_order": mo_sort,
                        "is_active": True,
                    }
                )
                mo_sort += 1

    payment_method_config = [
        {
            "id": ids.next(),
            "method_id": code_ids["PAYMENT_METHOD.CARD"],
            "name": "카드",
            "is_active": True,
            "sort_order": 1,
        }
    ]

    # dedupe ingredient_allergen
    seen_ia = set()
    dedup_ia = []
    for row in ingredient_allergens:
        key = (row["ingredient_id"], row["allergen_id"])
        if key in seen_ia:
            continue
        seen_ia.add(key)
        dedup_ia.append(row)

    tables = {
        "category": categories,
        "code_group": code_groups,
        "common_code": common_codes,
        "tag": tags,
        "menu": asak_menus,
        "menu_tag": menu_tags,
        "menu_nutrition": menu_nutritions,
        "ingredient": ingredients,
        "allergen": allergens,
        "ingredient_allergen": dedup_ia,
        "menu_ingredient": menu_ingredients,
        "option_group": option_groups,
        "menu_option_group": menu_option_groups,
        "menu_option": menu_options,
        "option_item": option_items,
        "option_item_component": [
            c for c in option_item_components if c.get("option_item_id")
        ],
        "payment_method_config": payment_method_config,
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, rows in tables.items():
        path = OUTPUT_DIR / f"{name}.json"
        path.write_text(
            json.dumps(rows, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    manifest = {
        "generated_at": now,
        "source": "salady_reference",
        "note": "ASAK 3NF v2 시드 (menu_option 분리, option_item.is_default 제거). 주문 테이블은 미포함.",
        "schema_version": 2,
        "reference_fields": list(SALADY_REFERENCE_FIELDS),
        "counts": {k: len(v) for k, v in tables.items()},
        "paths": {k: f"seed/{k}.json" for k in tables},
    }
    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (OUTPUT_DIR / "asak_seed_bundle.json").write_text(
        json.dumps({"manifest": manifest, "tables": tables}, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"ASAK 시드 생성 완료: {OUTPUT_DIR}")
    for k, n in manifest["counts"].items():
        print(f"  {k}: {n}")


if __name__ == "__main__":
    main()
