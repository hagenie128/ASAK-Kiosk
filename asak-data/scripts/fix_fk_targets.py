#!/usr/bin/env python3
"""Fix DevCopilot column fk_target to table.column dot notation."""
from __future__ import annotations

import json
import re
import sys
import time
from typing import Any

import requests

BASE = "https://devproject-hub-backend.onrender.com"
WS = 2
HEADERS = {"Content-Type": "application/json", "x-user-username": "hagenie128"}

SERVER_ID_TO_NAME: dict[int, str] = {
    41: "category", 42: "code_group", 43: "common_code", 44: "tag", 45: "menu",
    46: "menu_tag", 47: "menu_nutrition", 48: "ingredient", 49: "allergen",
    50: "ingredient_allergen", 51: "menu_ingredient", 52: "option_group",
    53: "menu_option_group", 54: "menu_option", 55: "option_item",
    56: "option_item_component", 57: "payment_method_config", 58: "orders",
    59: "order_item", 60: "order_item_option", 61: "item_exclusion", 62: "payment",
}

# (table_name, column_name) -> expected fk_target (dot notation)
FK_TARGET_MAP: dict[tuple[str, str], str] = {
    ("common_code", "code_group_id"): "code_group.id",
    ("menu", "category_id"): "category.id",
    ("menu", "category.id"): "category.id",
    ("menu_tag", "menu_id"): "menu.id",
    ("menu_tag", "tag_id"): "tag.id",
    ("menu_nutrition", "menu_id"): "menu.id",
    ("menu_nutrition", "source_id"): "common_code.id",
    ("ingredient", "type_id"): "common_code.id",
    ("ingredient_allergen", "ingredient_id"): "ingredient.id",
    ("ingredient_allergen", "allergen_id"): "allergen.id",
    ("menu_ingredient", "menu_id"): "menu.id",
    ("menu_ingredient", "ingredient_id"): "ingredient.id",
    ("menu_ingredient", "role_id"): "common_code.id",
    ("menu_ingredient", "unit_id"): "common_code.id",
    ("option_group", "group_type_id"): "common_code.id",
    ("menu_option_group", "menu_id"): "menu.id",
    ("menu_option_group", "option_group_id"): "option_group.id",
    ("menu_option", "menu_id"): "menu.id",
    ("menu_option", "option_item_id"): "option_item.id",
    ("option_item", "option_group_id"): "option_group.id",
    ("option_item", "ingredient_id"): "ingredient.id",
    ("option_item", "unit_id"): "common_code.id",
    ("option_item_component", "option_item_id"): "option_item.id",
    ("option_item_component", "ingredient_id"): "ingredient.id",
    ("option_item_component", "unit_id"): "common_code.id",
    ("payment_method_config", "method_id"): "common_code.id",
    ("orders", "order_type_id"): "common_code.id",
    ("orders", "status_id"): "common_code.id",
    ("order_item", "order_id"): "orders.id",
    ("order_item", "menu_id"): "menu.id",
    ("order_item_option", "order_item_id"): "order_item.id",
    ("order_item_option", "option_item_id"): "option_item.id",
    ("item_exclusion", "order_item_id"): "order_item.id",
    ("item_exclusion", "ingredient_id"): "ingredient.id",
    ("payment", "order_id"): "orders.id",
    ("payment", "method_id"): "common_code.id",
    ("payment", "status_id"): "common_code.id",
}


def api(method: str, path: str, **kwargs) -> requests.Response:
    url = f"{BASE}{path}"
    for attempt in range(3):
        try:
            r = requests.request(method, url, headers=HEADERS, timeout=120, **kwargs)
            if r.status_code >= 500 and attempt < 2:
                time.sleep(3)
                continue
            return r
        except requests.RequestException:
            if attempt == 2:
                raise
            time.sleep(3)
    raise RuntimeError("unreachable")


def is_numeric_fk_target(ft: Any) -> bool:
    return ft is not None and bool(re.fullmatch(r"\d+", str(ft)))


def is_bad_fk_target(ft: Any) -> bool:
    if ft is None:
        return False
    s = str(ft)
    if is_numeric_fk_target(s):
        return True
    return "." not in s


def resolve_fk_target(table_name: str, col: dict) -> str | None:
    key = (table_name, col["name"])
    if key in FK_TARGET_MAP:
        return FK_TARGET_MAP[key]
    ft = col.get("fk_target")
    if is_numeric_fk_target(ft):
        ref_table = SERVER_ID_TO_NAME.get(int(ft))
        if ref_table:
            return f"{ref_table}.id"
    return None


def find_duplicates(columns: list[dict]) -> list[dict]:
    """menu: category_id vs category.id duplicate FK."""
    names = {c["name"] for c in columns}
    dups: list[dict] = []
    if "category_id" in names and "category.id" in names:
        for c in columns:
            if c["name"] == "category.id":
                dups.append(c)
    return dups


def main() -> None:
    tables = api("GET", f"/api/workspaces/{WS}/tables").json()
    targets = [t for t in tables if 41 <= t["id"] <= 62]

    before_bad = 0
    samples: list[dict] = []
    deleted: list[dict] = []
    failed: list[str] = []
    fixed = 0

    for tbl in sorted(targets, key=lambda x: x["id"]):
        tname = tbl["name"]
        cols = tbl.get("columns", [])

        for dup in find_duplicates(cols):
            r = api("DELETE", f"/api/workspaces/{WS}/columns/{dup['id']}")
            if r.status_code not in (200, 204):
                failed.append(f"DELETE {tname}.{dup['name']} id={dup['id']}: {r.status_code}")
                print(f"FAIL DELETE {dup['name']}", file=sys.stderr)
                sys.exit(1)
            deleted.append({"table": tname, "id": dup["id"], "name": dup["name"]})
            print(f"  DELETE duplicate {tname}.{dup['name']} id={dup['id']}")
            cols = [c for c in cols if c["id"] != dup["id"]]

        for col in cols:
            if not col.get("is_fk"):
                continue
            ft = col.get("fk_target")
            if is_bad_fk_target(ft):
                before_bad += 1

            expected = resolve_fk_target(tname, col)
            if not expected:
                if col.get("is_fk") and is_bad_fk_target(ft):
                    failed.append(f"No mapping: {tname}.{col['name']} fk_target={ft}")
                continue

            new_name = col["name"]  # keep existing name (category_id or category.id)
            needs_update = (
                col.get("fk_target") != expected
                or not col.get("is_fk")
            )
            if not needs_update:
                continue

            old = {
                "name": col["name"],
                "fk_target": col.get("fk_target"),
                "is_fk": col.get("is_fk"),
            }
            body = {
                "name": new_name,
                "data_type": col["data_type"],
                "is_pk": col["is_pk"],
                "is_fk": True,
                "fk_target": expected,
                "is_nullable": col["is_nullable"],
                "description": col.get("description") or "",
            }
            r = api("PUT", f"/api/workspaces/{WS}/columns/{col['id']}", json=body)
            if r.status_code not in (200, 201):
                failed.append(f"PUT {tname}.{col['name']} id={col['id']}: {r.status_code} {r.text[:100]}")
                print(f"FAIL PUT {tname}.{col['name']}", file=sys.stderr)
                sys.exit(1)
            fixed += 1
            if len(samples) < 5:
                samples.append({
                    "table": tname,
                    "column": col["name"],
                    "before": old,
                    "after": {"name": new_name, "fk_target": expected, "is_fk": True},
                })
            print(f"  FIX {tname}.{col['name']}: {old['fk_target']!r} -> {expected!r}")

    # verify
    tables2 = api("GET", f"/api/workspaces/{WS}/tables").json()
    after_bad = 0
    for tbl in tables2:
        if tbl["id"] < 41 or tbl["id"] > 62:
            continue
        for col in tbl.get("columns", []):
            if col.get("is_fk") and is_bad_fk_target(col.get("fk_target")):
                after_bad += 1

    report = {
        "before_numeric_or_bad": before_bad,
        "after_bad": after_bad,
        "fixed": fixed,
        "deleted": deleted,
        "failed": failed,
        "samples": samples,
    }
    out = __file__.replace("fix_fk_targets.py", "fk_fix_report.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\n=== Before bad fk_target: {before_bad} ===")
    print(f"=== Fixed: {fixed}, Deleted: {len(deleted)}, After bad: {after_bad} ===")
    if failed:
        print("FAILED:", failed)
    print("\n=== Samples ===")
    for s in samples:
        print(f"  {s['table']}.{s['column']}")
        print(f"    BEFORE: {s['before']}")
        print(f"    AFTER:  {s['after']}")


if __name__ == "__main__":
    main()
