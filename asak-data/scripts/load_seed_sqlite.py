#!/usr/bin/env python3
"""Load ASAK seed JSON into a local SQLite sample database.

The canonical sample JSON under asak-data/seed is generated from
data-pipeline/phase1/output by data-pipeline/phase1/build_asak_seed.py.
This loader turns those JSON files into a queryable SQLite database for local
backend/API prototyping.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import subprocess
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
SEED_DIR = ROOT / "asak-data" / "seed"
DEFAULT_DB_PATH = ROOT / "asak-data" / "asak_sample.db"
BUILD_SEED_SCRIPT = ROOT / "data-pipeline" / "phase1" / "build_asak_seed.py"

TABLE_ORDER = [
    "category",
    "code_group",
    "common_code",
    "tag",
    "allergen",
    "ingredient",
    "ingredient_allergen",
    "menu",
    "menu_tag",
    "menu_nutrition",
    "menu_ingredient",
    "option_group",
    "option_item",
    "option_item_component",
    "menu_option_group",
    "menu_option",
    "payment_method_config",
]

# Tables documented in docs/wiki/db-table-definition.md but not included in the
# current sample seed. They are created empty so API prototypes can reference
# them without failing.
EMPTY_ORDER_TABLES: dict[str, dict[str, str]] = {
    "orders": {
        "id": "INTEGER PRIMARY KEY",
        "order_number": "TEXT",
        "order_type_id": "INTEGER",
        "order_status_id": "INTEGER",
        "total_price": "INTEGER",
        "created_at": "TEXT",
        "updated_at": "TEXT",
    },
    "order_item": {
        "id": "INTEGER PRIMARY KEY",
        "order_id": "INTEGER",
        "menu_id": "INTEGER",
        "quantity": "INTEGER",
        "unit_price": "INTEGER",
        "total_price": "INTEGER",
    },
    "order_item_option": {
        "id": "INTEGER PRIMARY KEY",
        "order_item_id": "INTEGER",
        "option_item_id": "INTEGER",
        "quantity": "INTEGER",
        "extra_price": "INTEGER",
    },
    "item_exclusion": {
        "id": "INTEGER PRIMARY KEY",
        "order_item_id": "INTEGER",
        "ingredient_id": "INTEGER",
    },
    "payment": {
        "id": "INTEGER PRIMARY KEY",
        "order_id": "INTEGER",
        "method_id": "INTEGER",
        "payment_status_id": "INTEGER",
        "amount": "INTEGER",
        "approved_at": "TEXT",
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a local SQLite DB from ASAK sample seed JSON."
    )
    parser.add_argument(
        "--db",
        type=Path,
        default=DEFAULT_DB_PATH,
        help=f"SQLite DB path. Default: {DEFAULT_DB_PATH}",
    )
    parser.add_argument(
        "--seed-dir",
        type=Path,
        default=SEED_DIR,
        help=f"Seed JSON directory. Default: {SEED_DIR}",
    )
    parser.add_argument(
        "--rebuild-seed",
        action="store_true",
        help="Regenerate asak-data/seed from data-pipeline/phase1/output first.",
    )
    parser.add_argument(
        "--keep",
        action="store_true",
        help="Keep an existing DB file and replace table contents only.",
    )
    return parser.parse_args()


def infer_sqlite_type(values: list[Any]) -> str:
    non_null = [value for value in values if value is not None]
    if not non_null:
        return "TEXT"
    if all(isinstance(value, bool) for value in non_null):
        return "INTEGER"
    if all(isinstance(value, int) and not isinstance(value, bool) for value in non_null):
        return "INTEGER"
    if all(isinstance(value, (int, float)) and not isinstance(value, bool) for value in non_null):
        return "REAL"
    return "TEXT"


def to_sqlite_value(value: Any) -> Any:
    if isinstance(value, bool):
        return 1 if value else 0
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False)
    return value


def load_rows(seed_dir: Path, table: str) -> list[dict[str, Any]]:
    path = seed_dir / f"{table}.json"
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError(f"{path} must contain a JSON array")
    return data


def collect_columns(rows: list[dict[str, Any]]) -> list[str]:
    columns: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for column in row:
            if column not in seen:
                seen.add(column)
                columns.append(column)
    return columns


def quote_ident(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'


def create_and_insert(
    conn: sqlite3.Connection,
    table: str,
    rows: list[dict[str, Any]],
) -> int:
    if not rows:
        return 0

    columns = collect_columns(rows)
    column_defs = []
    for column in columns:
        values = [row.get(column) for row in rows]
        sql_type = infer_sqlite_type(values)
        if column == "id":
            column_defs.append(f"{quote_ident(column)} INTEGER PRIMARY KEY")
        else:
            column_defs.append(f"{quote_ident(column)} {sql_type}")

    conn.execute(f"DROP TABLE IF EXISTS {quote_ident(table)}")
    conn.execute(f"CREATE TABLE {quote_ident(table)} ({', '.join(column_defs)})")

    placeholders = ", ".join("?" for _ in columns)
    column_list = ", ".join(quote_ident(column) for column in columns)
    sql = f"INSERT INTO {quote_ident(table)} ({column_list}) VALUES ({placeholders})"
    values = [
        [to_sqlite_value(row.get(column)) for column in columns]
        for row in rows
    ]
    conn.executemany(sql, values)
    return len(rows)


def create_empty_tables(conn: sqlite3.Connection) -> None:
    for table, columns in EMPTY_ORDER_TABLES.items():
        conn.execute(f"DROP TABLE IF EXISTS {quote_ident(table)}")
        defs = ", ".join(
            f"{quote_ident(column)} {sql_type}" for column, sql_type in columns.items()
        )
        conn.execute(f"CREATE TABLE {quote_ident(table)} ({defs})")


def rebuild_seed() -> None:
    if not BUILD_SEED_SCRIPT.exists():
        raise FileNotFoundError(f"Seed builder not found: {BUILD_SEED_SCRIPT}")
    subprocess.run([sys.executable, str(BUILD_SEED_SCRIPT)], cwd=ROOT, check=True)


def main() -> None:
    args = parse_args()
    seed_dir = args.seed_dir.resolve()
    db_path = args.db.resolve()

    if args.rebuild_seed:
        rebuild_seed()

    manifest_path = seed_dir / "manifest.json"
    if not manifest_path.exists():
        raise FileNotFoundError(f"Seed manifest not found: {manifest_path}")

    db_path.parent.mkdir(parents=True, exist_ok=True)
    if db_path.exists() and not args.keep:
        db_path.unlink()

    conn = sqlite3.connect(db_path)
    try:
        conn.execute("PRAGMA foreign_keys = OFF")
        counts: dict[str, int] = {}
        for table in TABLE_ORDER:
            counts[table] = create_and_insert(conn, table, load_rows(seed_dir, table))
        create_empty_tables(conn)
        conn.commit()
    finally:
        conn.close()

    print(f"SQLite sample DB created: {db_path}")
    for table in TABLE_ORDER:
        print(f"  {table}: {counts[table]}")
    for table in EMPTY_ORDER_TABLES:
        print(f"  {table}: 0")


if __name__ == "__main__":
    main()
