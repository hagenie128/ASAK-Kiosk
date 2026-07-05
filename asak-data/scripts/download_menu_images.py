#!/usr/bin/env python3
"""menu.json 기준 샐러디 원본 썸네일 다운로드 (images/original/)."""

from __future__ import annotations

import json
import re
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
SEED_DIR = ROOT / "seed"
IMAGES_DIR = ROOT / "images"
ORIGINAL_DIR = IMAGES_DIR / "original"
PHASE1_MENUS = REPO_ROOT / "data-pipeline" / "phase1" / "output" / "menus.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}


def slugify(name: str, menu_id: int) -> str:
    safe = re.sub(r"[^\w가-힣]+", "-", name).strip("-")
    return f"{menu_id}_{safe[:40]}"


def load_salady_image_urls() -> dict[str, str]:
    if not PHASE1_MENUS.exists():
        return {}
    menus = json.loads(PHASE1_MENUS.read_text(encoding="utf-8"))
    return {
        str(m["id"]): m.get("image_url") or ""
        for m in menus
        if m.get("image_url")
    }


def resolve_image_url(menu: dict, salady_urls: dict[str, str]) -> str:
    url = menu.get("image_url") or ""
    if url.startswith("http"):
        return url
    ref = menu.get("_source_ref") or {}
    salady_id = str(ref.get("salady_id") or "")
    return salady_urls.get(salady_id, "")


def download_image(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 0:
        return True
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
        return True
    except requests.RequestException as exc:
        print(f"  다운로드 실패: {dest.name} ({exc})")
        return False


def main() -> None:
    menus = json.loads((SEED_DIR / "menu.json").read_text(encoding="utf-8"))
    salady_urls = load_salady_image_urls()
    ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)

    ok = 0
    skipped = 0
    for menu in menus:
        mid = menu["id"]
        name = menu["name"]
        url = resolve_image_url(menu, salady_urls)
        slug = slugify(name, mid)
        ext = ".png"
        if url.lower().endswith(".jpg") or url.lower().endswith(".jpeg"):
            ext = ".jpg"
        dest = ORIGINAL_DIR / f"{slug}{ext}"

        if not url:
            if dest.exists():
                ok += 1
            else:
                skipped += 1
            continue

        if download_image(url, dest):
            ok += 1
        time.sleep(0.15)

    print(f"원본 이미지: {ORIGINAL_DIR}")
    print(f"  메뉴 {len(menus)}개 · 파일 {ok}개 · URL 없음 {skipped}개")
    print()
    print("다음: python asak-data/scripts/apply_original_images.py")


if __name__ == "__main__":
    main()
