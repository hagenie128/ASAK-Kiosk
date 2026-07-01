#!/usr/bin/env python3
"""Salady menu / nutrition / allergy data scraper."""

from __future__ import annotations

import argparse
import csv
import json
import re
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse, parse_qs

import pdfplumber
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://salady.com"
REQUEST_DELAY = 1.0
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "ko-KR,ko;q=0.9",
}

LIST_URLS = [
    f"{BASE_URL}/menu/list_1",
    f"{BASE_URL}/menu/list_2?type=topping",
    f"{BASE_URL}/menu/list_3?type=side",
    f"{BASE_URL}/menu2/list_1?menu2=1",
]

CALORIE_AJAX_URL = f"{BASE_URL}/_subpage/kor/menu/ajax.menupop2.php"
NUTRITION_PDF_URL = f"{BASE_URL}/pdf/nutrition.pdf?ver=3"
ALLERGY_PDF_URL = f"{BASE_URL}/pdf/allergy.pdf?ver=3"

NUTRITION_COLUMNS = [
    "menu",
    "calories_kcal",
    "carbs_g",
    "sugar_g",
    "protein_g",
    "fat_g",
    "saturated_fat_g",
    "sodium_mg",
]


@dataclass
class MenuItem:
    id: str
    name_ko: str
    name_en: str = ""
    category: str = ""
    brand: str = "salady"
    url: str = ""
    description: str = ""
    image_url: str = ""
    tags: list[str] = field(default_factory=list)
    base: str = ""
    toppings_text: str = ""
    default_dressing: str = ""
    vegetables: list[dict[str, str]] = field(default_factory=list)
    nutrition: dict[str, Any] = field(default_factory=dict)
    calorie_calculator: dict[str, Any] = field(default_factory=dict)
    allergy: list[str] = field(default_factory=list)


def _normalize_menu_name(name: str) -> str:
    return re.sub(r"\s+", "", (name or "").strip().lower())


class SaladyScraper:
    def __init__(self, output_dir: Path, delay: float = REQUEST_DELAY, download_images: bool = False):
        self.output_dir = output_dir
        self.delay = delay
        self.download_images = download_images
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.images_dir = output_dir / "images"
        self.pdf_dir = output_dir / "pdf"

    def _get(self, url: str) -> requests.Response:
        time.sleep(self.delay)
        response = self.session.get(url, timeout=60)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or "utf-8"
        return response

    def _download_file(self, url: str, dest: Path) -> Path:
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists():
            return dest
        time.sleep(self.delay)
        response = self.session.get(url, timeout=120)
        response.raise_for_status()
        dest.write_bytes(response.content)
        return dest

    def collect_menu_links(self) -> list[dict[str, str]]:
        links: dict[str, dict[str, str]] = {}

        for list_url in LIST_URLS:
            soup = BeautifulSoup(self._get(list_url).text, "lxml")
            brand = "salady_sandwich" if "/menu2/" in list_url else "salady"

            for li in soup.select(".menu_list li"):
                anchor = li.select_one('a[href*="view_1"]')
                if not anchor:
                    continue

                href = anchor.get("href", "")
                if "idx=" not in href:
                    continue

                full_url = urljoin(BASE_URL, href)
                parsed = urlparse(full_url)
                params = parse_qs(parsed.query)
                idx = params.get("idx", [""])[0]
                if not idx:
                    continue

                name_ko = ""
                name_en = ""
                h6 = li.select_one("h6")
                en_el = li.select_one("p")
                if h6:
                    name_ko = h6.get_text(" ", strip=True)
                if en_el:
                    name_en = re.sub(
                        r"\s*(NEW|BEST|LOW\s*SUGAR|VEGAN)+\s*",
                        " ",
                        en_el.get_text(" ", strip=True),
                        flags=re.I,
                    ).strip()

                category = ""
                heading = li.find_previous(["h4", "h5"])
                if heading:
                    category = heading.get_text(strip=True)

                ca_id = params.get("ca_id", [""])[0]
                key = f"{brand}:{idx}"
                if key in links:
                    continue

                links[key] = {
                    "id": idx,
                    "url": full_url,
                    "name_ko": name_ko,
                    "name_en": name_en,
                    "category": category,
                    "brand": brand,
                    "ca_id": ca_id,
                    "list_source": list_url,
                }

        return list(links.values())

    def parse_menu_detail(self, link: dict[str, str]) -> MenuItem:
        soup = BeautifulSoup(self._get(link["url"]).text, "lxml")

        title_el = soup.select_one(".view_top h3, .view_tit h3, h3.conTit")
        name_ko = title_el.get_text(strip=True) if title_el else link.get("name_ko", "")

        name_en = link.get("name_en", "")
        if not name_en:
            sub_el = soup.select_one(".view_top p, .view_top .en")
            if sub_el:
                name_en = sub_el.get_text(strip=True)

        desc_el = soup.select_one(".view_top .txt, .view_top > p")
        description = desc_el.get_text(" ", strip=True) if desc_el else ""

        image_url = ""
        img_el = soup.select_one(".left_img img, .view_cont .left_img img")
        if img_el and img_el.get("src"):
            image_url = urljoin(BASE_URL, img_el["src"])

        tags = [span.get_text(strip=True) for span in soup.select(".tag_box span") if span.get_text(strip=True)]

        base = toppings_text = default_dressing = ""
        for block in soup.select(".right_txt .text, .view_cont .right_txt .text"):
            label = block.select_one("strong")
            value = block.select_one("p")
            if not label or not value:
                continue
            label_text = label.get_text(strip=True)
            value_text = value.get_text(" ", strip=True)
            if "베이스" in label_text:
                base = value_text
            elif "토핑" in label_text:
                toppings_text = value_text
            elif "드레싱" in label_text:
                default_dressing = value_text

        vegetables: list[dict[str, str]] = []
        for li in soup.select(".info_box ul li"):
            name_el = li.select_one("p")
            img = li.select_one("img")
            if not name_el:
                continue
            veg: dict[str, str] = {"name": name_el.get_text(strip=True)}
            if img and img.get("src"):
                veg["image_url"] = urljoin(BASE_URL, img["src"])
            vegetables.append(veg)

        nutrition: dict[str, Any] = {}
        table = soup.select_one(".ing_table table, .ingredient table")
        if table:
            rows = table.select("tr")
            if len(rows) >= 2:
                headers = [th.get_text(strip=True) for th in rows[0].select("th")]
                values = [td.get_text(strip=True) for td in rows[1].select("td")]
                if headers and values:
                    nutrition = dict(zip(headers, values))

        category = link.get("category", "")
        if not category:
            for anchor in soup.select(".location a, .path a, .breadcrumb a"):
                text = anchor.get_text(strip=True)
                if text and text not in ("홈", "메뉴", "메뉴 소개", "HOME"):
                    category = text
                    break

        return MenuItem(
            id=link["id"],
            name_ko=name_ko or link.get("name_ko", ""),
            name_en=name_en,
            category=category,
            brand=link.get("brand", "salady"),
            url=link["url"],
            description=description,
            image_url=image_url,
            tags=tags,
            base=base,
            toppings_text=toppings_text,
            default_dressing=default_dressing,
            vegetables=vegetables,
            nutrition=nutrition,
        )

    def parse_calorie_calculator(self) -> dict[str, Any]:
        soup = BeautifulSoup(self._get(CALORIE_AJAX_URL).text, "lxml")

        note_el = soup.select_one(".kalCon .top span")
        note = note_el.get_text(" ", strip=True) if note_el else ""

        base_addons: dict[str, float] = {}
        for label in soup.select(".checkbox label"):
            input_el = label.select_one("input")
            if not input_el:
                continue
            name = input_el.get("name", "")
            text = label.get_text(strip=True)
            base_addons[name] = {"label": text}

        menus: list[dict[str, Any]] = []
        menu_select = soup.select_one("#menuData")
        if menu_select:
            for option in menu_select.select("option"):
                name = option.get_text(strip=True)
                value = option.get("value", "")
                if not name or not value:
                    continue
                menus.append(
                    {
                        "name": name,
                        "base_kcal": float(value),
                        "addon_kcal": {
                            "vegetable": float(option.get("data-vegetable", 0) or 0),
                            "grain": float(option.get("data-grain", 0) or 0),
                            "buckwheat": float(option.get("data-buckwheat", 0) or 0),
                            "noodles": float(option.get("data-noodles", 0) or 0),
                        },
                    }
                )

        topping_categories: dict[str, list[dict[str, Any]]] = {}
        for li in soup.select(".addTopping li"):
            title_el = li.select_one(".tit")
            select_el = li.select_one("select")
            if not title_el or not select_el:
                continue
            category = title_el.get_text(strip=True)
            if category == "메뉴 선택":
                continue
            items: list[dict[str, Any]] = []
            for option in select_el.select("option"):
                name = option.get_text(strip=True)
                value = option.get("value", "")
                if not name or not value:
                    continue
                items.append({"name": name, "kcal": float(value)})
            topping_categories[category] = items

        return {
            "note": note,
            "menus": menus,
            "topping_categories": topping_categories,
        }

    def _normalize_header(self, text: str) -> str:
        text = re.sub(r"\s+", "", (text or "").replace("\n", ""))
        mapping = {
            "구분": "category",
            "메뉴": "menu",
            "메뉴명": "menu",
            "내용량(g)": "weight_g",
            "중량(g)": "weight_g",
            "내용량": "weight_g",
            "열량(kcal)": "calories_kcal",
            "열량(Kcal)": "calories_kcal",
            "열량": "calories_kcal",
            "탄수화물(g)": "carbs_g",
            "탄수화물": "carbs_g",
            "당류(g)": "sugar_g",
            "당류": "sugar_g",
            "단백질(g)": "protein_g",
            "단백질": "protein_g",
            "지방(g)": "fat_g",
            "지방": "fat_g",
            "포화지방(g)": "saturated_fat_g",
            "포화지방": "saturated_fat_g",
            "나트륨(mg)": "sodium_mg",
            "나트륨": "sodium_mg",
        }
        return mapping.get(text, text)

    def _parse_numeric(self, value: str) -> str | float:
        value = (value or "").strip().replace(",", "")
        if not value or value in ("-", "–"):
            return ""
        try:
            return float(value)
        except ValueError:
            return value

    def _is_nutrition_header(self, cells: list[str]) -> bool:
        joined = "".join(cells).lower()
        return "메뉴" in joined and ("kcal" in joined or "열량" in joined)

    def parse_pdf_tables(self, pdf_path: Path) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        column_keys: list[str] | None = None
        current_category = ""

        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                for table in page.extract_tables() or []:
                    if not table:
                        continue
                    for raw_row in table:
                        cells = [(cell or "").strip() for cell in raw_row]
                        if not any(cells):
                            continue

                        if self._is_nutrition_header(cells):
                            column_keys = [self._normalize_header(c) for c in cells]
                            current_category = ""
                            continue

                        if not column_keys:
                            continue

                        row_map = {
                            key: cell
                            for key, cell in zip(column_keys, cells)
                            if key not in ("", None)
                        }
                        menu_name = row_map.get("menu", "")
                        if not menu_name:
                            continue

                        category = row_map.get("category") or current_category
                        if row_map.get("category"):
                            current_category = row_map["category"]

                        row: dict[str, Any] = {
                            "category": category,
                            "menu": menu_name,
                        }
                        for key, cell in row_map.items():
                            if key in ("category", "menu"):
                                continue
                            row[key] = self._parse_numeric(cell)
                        rows.append(row)

        return rows

    def _is_allergy_marker(self, value: str) -> bool:
        value = (value or "").strip()
        return value in ("●", "•", "◯", "○", "O", "o", "◎", "■")

    def parse_allergy_pdf(self, pdf_path: Path) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        allergen_names: list[str] = []
        current_category = ""

        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                for table in page.extract_tables() or []:
                    if not table:
                        continue

                    for raw_row in table:
                        cells = [(cell or "").strip().replace("\n", " ") for cell in raw_row]
                        if not any(cells):
                            continue

                        if "메뉴" in cells[0] and "표시대상" in "".join(cells):
                            allergen_names = []
                            continue

                        if not allergen_names and cells[0] == "" and any(
                            name in "".join(cells) for name in ("달걀", "우유", "메밀", "땅콩", "대두")
                        ):
                            allergen_names = [c for c in cells[2:] if c]
                            continue

                        if not allergen_names:
                            continue

                        category = cells[0] or current_category
                        menu_name = cells[1] if len(cells) > 1 else ""
                        if cells[0]:
                            current_category = cells[0]
                        if not menu_name:
                            continue

                        markers = [
                            allergen
                            for allergen, value in zip(allergen_names, cells[2:])
                            if self._is_allergy_marker(value)
                        ]
                        rows.append(
                            {
                                "category": category,
                                "menu": menu_name,
                                "allergens": markers,
                            }
                        )

        return rows

    def _save_image(self, url: str, menu_id: str) -> str:
        if not url or not self.download_images:
            return ""
        parsed = urlparse(url)
        ext = Path(parsed.path).suffix or ".jpg"
        dest = self.images_dir / f"{menu_id}{ext}"
        self._download_file(url, dest)
        return str(dest.relative_to(self.output_dir))

    def merge_data(
        self,
        menus: list[MenuItem],
        calorie_data: dict[str, Any],
        nutrition_pdf_rows: list[dict[str, Any]],
        allergy_rows: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        calorie_by_name = {
            _normalize_menu_name(m["name"]): m for m in calorie_data.get("menus", [])
        }
        nutrition_by_name = {
            _normalize_menu_name(r.get("menu", "")): r
            for r in nutrition_pdf_rows
            if r.get("menu")
        }
        allergy_by_name = {
            _normalize_menu_name(r.get("menu", "")): r.get("allergens", [])
            for r in allergy_rows
            if r.get("menu")
        }

        merged: list[dict[str, Any]] = []
        for menu in menus:
            data = asdict(menu)
            key = _normalize_menu_name(menu.name_ko)
            calc = calorie_by_name.get(key)
            if calc:
                data["calorie_calculator"] = calc

            pdf_nutrition = nutrition_by_name.get(key)
            if pdf_nutrition:
                data["nutrition_pdf"] = pdf_nutrition
            elif menu.nutrition:
                data["nutrition_pdf"] = menu.nutrition

            allergy = allergy_by_name.get(key)
            if allergy:
                data["allergy"] = allergy if isinstance(allergy, list) else [allergy]

            if menu.image_url:
                local_image = self._save_image(menu.image_url, menu.id)
                if local_image:
                    data["image_local"] = local_image

            merged.append(data)

        return merged

    def save_outputs(
        self,
        menus: list[dict[str, Any]],
        calorie_data: dict[str, Any],
        nutrition_pdf_rows: list[dict[str, Any]],
        allergy_rows: list[dict[str, Any]],
    ) -> None:
        self.output_dir.mkdir(parents=True, exist_ok=True)

        (self.output_dir / "menus.json").write_text(
            json.dumps(menus, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        (self.output_dir / "calorie_calculator.json").write_text(
            json.dumps(calorie_data, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        (self.output_dir / "nutrition_pdf.json").write_text(
            json.dumps(nutrition_pdf_rows, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        (self.output_dir / "allergy_pdf.json").write_text(
            json.dumps(allergy_rows, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        if menus:
            keys = sorted({key for item in menus for key in item.keys()})
            with (self.output_dir / "menus.csv").open("w", newline="", encoding="utf-8-sig") as f:
                writer = csv.DictWriter(f, fieldnames=keys, extrasaction="ignore")
                writer.writeheader()
                for item in menus:
                    flat = {
                        k: json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else v
                        for k, v in item.items()
                    }
                    writer.writerow(flat)

    def run(self, skip_pdfs: bool = False, max_menus: int | None = None) -> None:
        print("메뉴 링크 수집 중...")
        links = self.collect_menu_links()
        if max_menus:
            links = links[:max_menus]
        print(f"  → {len(links)}개 메뉴 발견")

        print("메뉴 상세 페이지 크롤링 중...")
        menus: list[MenuItem] = []
        for i, link in enumerate(links, 1):
            print(f"  [{i}/{len(links)}] {link.get('name_ko') or link['id']}")
            menus.append(self.parse_menu_detail(link))

        print("칼로리 계산기 데이터 수집 중...")
        calorie_data = self.parse_calorie_calculator()
        print(f"  → 메뉴 {len(calorie_data.get('menus', []))}개, "
              f"토핑 카테고리 {len(calorie_data.get('topping_categories', {}))}개")

        nutrition_pdf_rows: list[dict[str, Any]] = []
        allergy_rows: list[dict[str, Any]] = []

        if not skip_pdfs:
            print("영양성분 PDF 다운로드 및 파싱 중...")
            nutrition_pdf = self._download_file(NUTRITION_PDF_URL, self.pdf_dir / "nutrition.pdf")
            nutrition_pdf_rows = self.parse_pdf_tables(nutrition_pdf)
            print(f"  → {len(nutrition_pdf_rows)}행 추출")

            print("알레르기 PDF 다운로드 및 파싱 중...")
            allergy_pdf = self._download_file(ALLERGY_PDF_URL, self.pdf_dir / "allergy.pdf")
            allergy_rows = self.parse_allergy_pdf(allergy_pdf)
            print(f"  → {len(allergy_rows)}행 추출")

        print("데이터 병합 및 저장 중...")
        merged = self.merge_data(menus, calorie_data, nutrition_pdf_rows, allergy_rows)
        self.save_outputs(merged, calorie_data, nutrition_pdf_rows, allergy_rows)
        print(f"완료: {self.output_dir.resolve()}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Salady 메뉴/영양 데이터 크롤러")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=Path("output"),
        help="결과 저장 디렉터리 (기본: output)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=REQUEST_DELAY,
        help="요청 간 대기 시간(초)",
    )
    parser.add_argument(
        "--images",
        action="store_true",
        help="메뉴 이미지 다운로드",
    )
    parser.add_argument(
        "--skip-pdfs",
        action="store_true",
        help="PDF 다운로드/파싱 생략",
    )
    parser.add_argument(
        "--max-menus",
        type=int,
        default=None,
        help="테스트용 최대 메뉴 수",
    )
    args = parser.parse_args()

    scraper = SaladyScraper(
        output_dir=args.output,
        delay=args.delay,
        download_images=args.images,
    )
    scraper.run(skip_pdfs=args.skip_pdfs, max_menus=args.max_menus)


if __name__ == "__main__":
    main()
