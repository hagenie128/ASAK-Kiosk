#!/usr/bin/env python3
"""원본(샐러디 썸네일) 이미지를 메뉴 image_url에 반영."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
SEED_DIR = ROOT / "seed"
IMAGES_DIR = ROOT / "images"
ORIGINAL_DIR = IMAGES_DIR / "original"
MENU_IMG_DIR = IMAGES_DIR / "menu"
BACKEND_SEED = REPO_ROOT / "backend" / "src" / "main" / "resources" / "seed" / "menu.json"
BACKEND_STATIC = (
    REPO_ROOT / "backend" / "src" / "main" / "resources" / "static" / "assets" / "menu"
)


def find_original(menu_id: int) -> Path | None:
    matches = sorted(ORIGINAL_DIR.glob(f"{menu_id}_*"))
    return matches[0] if matches else None


def main() -> None:
    parser = argparse.ArgumentParser(description="menu.json image_url → 로컬 원본 이미지")
    parser.add_argument(
        "--prefix",
        default="/assets/menu/",
        help="image_url prefix (기본: /assets/menu/)",
    )
    parser.add_argument(
        "--copy-to",
        type=Path,
        default=MENU_IMG_DIR,
        help="id 기준 파일 복사 대상 (기본: asak-data/images/menu/)",
    )
    parser.add_argument(
        "--sync-backend",
        action="store_true",
        default=True,
        help="backend seed + static/assets/menu 동기화 (기본: 켜짐)",
    )
    parser.add_argument(
        "--no-sync-backend",
        action="store_false",
        dest="sync_backend",
        help="backend 동기화 생략",
    )
    args = parser.parse_args()

    menus_path = SEED_DIR / "menu.json"
    menus = json.loads(menus_path.read_text(encoding="utf-8"))

    args.copy_to.mkdir(parents=True, exist_ok=True)
    if args.sync_backend:
        BACKEND_STATIC.mkdir(parents=True, exist_ok=True)

    updated = 0
    missing = 0
    for menu in menus:
        src = find_original(menu["id"])
        if not src:
            missing += 1
            continue

        ext = src.suffix.lower() or ".png"
        filename = f"{menu['id']}{ext}"
        dest = args.copy_to / filename
        shutil.copy2(src, dest)
        if args.sync_backend:
            shutil.copy2(src, BACKEND_STATIC / filename)

        menu["image_url"] = f"{args.prefix}{filename}"
        updated += 1

    menus_path.write_text(json.dumps(menus, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.sync_backend and BACKEND_SEED.parent.exists():
        shutil.copy2(menus_path, BACKEND_SEED)

    print(f"menu.json 갱신: {updated}개 → {args.prefix}{{id}}.png")
    print(f"  복사: {args.copy_to}")
    if args.sync_backend:
        print(f"  backend static: {BACKEND_STATIC}")
        print(f"  backend seed: {BACKEND_SEED}")
    if missing:
        print(f"  건너뜀: {missing}개 (original/ 없음 — download_menu_images.py 실행)")


if __name__ == "__main__":
    main()
