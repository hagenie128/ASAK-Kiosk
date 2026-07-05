"""Prepare markdown for Notion upload — strip Git-centric headers, add Git tools section."""
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
GIT_TOOLS = """<callout icon="🔗" color="gray_bg">
**Git 도구만** (로컬·스크립트 — 본문은 Notion이 정본)
- [color-swatches.html](https://github.com/hagenie128/ASAK/tree/main/docs/design/color-swatches.html)
- [figma-links.template.json](https://github.com/hagenie128/ASAK/tree/main/docs/design/figma-links.template.json)
- [SCR_FIGMA_CHECKLIST.md](https://github.com/hagenie128/ASAK/tree/main/docs/design/SCR_FIGMA_CHECKLIST.md)
</callout>

---

"""

GUIDES = [
    ("SCR 화면별 가이드 (태블릿 세로)", REPO / "docs/design/SCR_TABLET_PORTRAIT_FRAMES.md", "📱"),
    ("브랜드 · Trend 컬러", REPO / "docs/design/BRAND_DESIGN_OPTIONS.md", "🎨"),
    ("Figma 태블릿 세로 Setup", REPO / "docs/design/TABLET_PORTRAIT_FIGMA_SETUP.md", "📐"),
    ("Figma 가이드 + SCR×Figma 매트릭스", REPO / "docs/design/FIGMA_GUIDE.md", "🖼"),
    ("화면설계 DevCopilot/Wiki 업로드", REPO / "docs/design/SCREENS_UPLOAD_GUIDE.md", "⬆"),
    ("DB 색상 수동 가이드", REPO / "docs/design/NOTION_DB_COLOR_GUIDE.md", "🎨"),
]

STUB_MARKER = "편집·전체 내용은 Notion에서 관리"

SKIP_PREFIXES = (
    "> **Notion (편집 허브):**",
    "> **Git (원본",
    "> **Git (원본/스크립트):**",
    "> **Git (원본/백업):**",
)


def strip_header(text: str) -> str:
    lines = text.splitlines()
    out = []
    i = 0
    # drop first # title line
    if lines and lines[0].startswith("# "):
        i = 1
    while i < len(lines):
        line = lines[i]
        if any(line.startswith(p) for p in SKIP_PREFIXES):
            i += 1
            continue
        if line.strip() == "" and i + 1 < len(lines) and any(
            lines[i + 1].startswith(p) for p in SKIP_PREFIXES
        ):
            i += 1
            continue
        break
    out = lines[i:]
    # drop leading blank lines
    while out and out[0].strip() == "":
        out.pop(0)
    return "\n".join(out)


def main():
    out_dir = REPO / "asak-data/scripts/_notion_upload"
    out_dir.mkdir(exist_ok=True)
    manifest = []
    for title, path, icon in GUIDES:
        raw = path.read_text(encoding="utf-8")
        if STUB_MARKER in raw:
            print(f"SKIP {title}: Git stub — Notion이 정본 ({path.relative_to(REPO)})")
            continue
        body = strip_header(raw)
        content = GIT_TOOLS + body
        safe = path.stem
        out_path = out_dir / f"{safe}.md"
        out_path.write_text(content, encoding="utf-8")
        manifest.append(
            {
                "title": title,
                "icon": icon,
                "file": str(out_path),
                "chars": len(content),
                "source": str(path.relative_to(REPO)),
            }
        )
    import json

    (out_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    for m in manifest:
        print(f"{m['icon']} {m['title']}: {m['chars']} chars -> {m['file']}")


if __name__ == "__main__":
    main()
