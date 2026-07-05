# ASAK

`ASAK`는 `A Salad A Kiosk`의 **통합 Git 저장소**입니다. (로컬 워크스페이스 경로 `C:\greens`는 Cursor 개발용이며, 공식 저장소명은 **ASAK**입니다.)

**9주 (7/2~9/2)** · Week 5 MVP SCR-001~008 (8/1) · 최종 발표 9/2(수). 산출물·진행 허브: [Notion 키오스크 풀스택 프로젝트](https://app.notion.com/p/39151ef04f0b808f99f8ea068efb5790) · 일일 워크로그: [팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) · Git [`worklog/guide-personal-worklog.md`](worklog/guide-personal-worklog.md) · [확인 순서](worklog/README.md)

## 클론

```powershell
git clone https://github.com/hagenie128/ASAK.git
# 또는 로컬 경로 지정
git clone https://github.com/hagenie128/ASAK.git C:\greens
```

이 저장소는 프론트, 실제 백엔드, 데이터 파이프라인 작업을 한곳에서 관리하기 위한 루트이며, 실제 구현은 아래처럼 분리되어 있습니다.

- `frontend/`: ASAK 정적 뷰어와 배포 자산
- `backend/`: 실제 백엔드 앱 기본 구조
- `data-pipeline/phase1/`: 1차 크롤링, 데이터 가공, DB 문서

## 로컬 구조

```text
frontend/   프론트엔드 뷰어
backend/    실제 백엔드 앱
data-pipeline/
  phase1/   1차 크롤링/데이터 파이프라인
.github/    통합 워크플로우
```

## 별도 저장소

- `ASAK-front`
- `ASAK-back`

각 저장소는 이 통합 구조를 기준으로 별도 폴더와 원격으로도 분리됩니다.

## 작업 방식 (중요)

세 폴더는 **서로 다른 Git 저장소**입니다. 작업 후 ASAK 통합 저장소에 다시 합칠 필요는 없습니다.

- 프론트 개발 → `c:\ASAK-front` → `ASAK-front` 저장소에 푸시
- 백엔드 개발 → `c:\ASAK-back` → `ASAK-back` 저장소에 푸시
- 문서/파이프라인 → `C:\greens` (또는 `c:\ha-team`) → **ASAK** 저장소에 푸시

자세한 설명은 [`docs/guides/01-team-setup.md`](docs/guides/01-team-setup.md)의 **2. Git 저장소 관계**를 참고하세요.

## 저장소

- 통합: `https://github.com/hagenie128/ASAK`
- 프론트: `https://github.com/hagenie128/ASAK-front`
- 백엔드: `https://github.com/hagenie128/ASAK-back`

## 데이터·이미지

키오스크 **학원 과제·포트폴리오**용입니다. 메뉴 데이터·이미지는 [샐러디(salady.com)](https://salady.com) 공개 정보를 참고했습니다. 상업적 서비스·실매장 배포에는 그대로 사용하지 마세요.

```powershell
python asak-data/scripts/download_menu_images.py
python asak-data/scripts/apply_original_images.py
```

- 원본 썸네일: `asak-data/images/original/`
- 키오스크용 경로: `asak-data/images/menu/` → `menu.json`의 `/assets/menu/{id}.png`

## 문서 — Notion vs Git

| Git (ASAK repo) 유지 | Notion (본문 정본) |
|----------------------|-------------------|
| 스크립트, JSON, HTML (`color-swatches.html`, `figma-links.template.json`) | [📐 디자인 & 화면](https://app.notion.com/p/39451ef04f0b8163b1f9ebb477917efc) 하위 가이드 |
| `asak-data/scripts/*`, `docs/screens/*` export | [04. 화면 설계](https://app.notion.com/p/1c751ef04f0b825ea3aa8145f563bbc8) · SCR DB |
| `docs/wiki/*` DevCopilot source | DevCopilot Wiki + Notion 링크 |
| `docs/guides/*` 팀 온보딩·Issue·작업 기록 | [📖 문서 읽는 순서](https://app.notion.com/p/39451ef04f0b81088a91d914f985fb11) |
| `worklog/daily/` sync | [📅 일일 워크로그 DB](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) · 사용법 [팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) |

Git `docs/design/*.md`는 **Notion 링크 stub**만 유지합니다. Notion 페이지 상단 **Git 도구만** 섹션에서 로컬 도구 링크를 제공합니다.

## 디자인 · Figma (가이드 본문 → Notion)

| Git stub | Notion (편집) |
|----------|---------------|
| [`SCR_TABLET_PORTRAIT_FRAMES.md`](docs/design/SCR_TABLET_PORTRAIT_FRAMES.md) | [SCR 화면별 가이드](https://app.notion.com/p/39451ef04f0b81109d07c01293d73c6d) |
| [`BRAND_DESIGN_OPTIONS.md`](docs/design/BRAND_DESIGN_OPTIONS.md) | [브랜드 · Trend 컬러](https://app.notion.com/p/39451ef04f0b814a9447f6fbf171b3b7) |
| [`TABLET_PORTRAIT_FIGMA_SETUP.md`](docs/design/TABLET_PORTRAIT_FIGMA_SETUP.md) | [Figma 태블릿 세로 Setup](https://app.notion.com/p/39451ef04f0b81c1b71accd381097699) |
| [`FIGMA_GUIDE.md`](docs/design/FIGMA_GUIDE.md) | [Figma 가이드 + SCR×Figma](https://app.notion.com/p/39451ef04f0b81849dc7d81f8106b5ad) |
| [`SCREENS_UPLOAD_GUIDE.md`](docs/design/SCREENS_UPLOAD_GUIDE.md) | [DevCopilot/Wiki 업로드](https://app.notion.com/p/39451ef04f0b81bc83a1f291eeb1ce31) |
| [`NOTION_DB_COLOR_GUIDE.md`](docs/design/NOTION_DB_COLOR_GUIDE.md) | [DB 색상 수동 가이드](https://app.notion.com/p/39451ef04f0b810d81f6eea53c4d0682) |

Hub (**시작**: [📐 디자인 & 화면](https://app.notion.com/p/39451ef04f0b8163b1f9ebb477917efc)) · 화면 목록 정본: [04. 화면 설계 SCR DB](https://app.notion.com/p/1c751ef04f0b825ea3aa8145f563bbc8)

읽기 순서: 1 브랜드 → 2 Figma Setup → 3 SCR wireframe → 4 Figma 매트릭스 → 5 DevCopilot 업로드

Git 로컬 도구: [`color-swatches.html`](docs/design/color-swatches.html) · [`figma-links.template.json`](docs/design/figma-links.template.json) · [`SCR_FIGMA_CHECKLIST.md`](docs/design/SCR_FIGMA_CHECKLIST.md)

## 팀 세팅 가이드

팀원 온보딩·Issue·작업 기록 템플릿은 [`docs/guides/`](docs/guides/README.md)에 있습니다. **읽기 순서**는 [`docs/guides/README.md`](docs/guides/README.md)를 따르세요.

| 순서 | Git | 내용 |
|------|-----|------|
| 01 | [`01-team-setup.md`](docs/guides/01-team-setup.md) | 클론·세팅·Git·9주 일정 |
| 02 | [`02-github-issues-guide.md`](docs/guides/02-github-issues-guide.md) | Issue·라벨·WBS |
| 03–06 | [`03`](docs/guides/03-work-log-template.md) · [`04`](docs/guides/04-sample-work-log-example.md) · [`05`](docs/guides/05-personal-portfolio-template.md) · [`06`](docs/guides/06-team-ai-prompt.md) | 작업 기록·포트폴리오·AI 프롬프트 |

- `worklog/` — 일일 워크로그 + [캘린더 뷰](worklog/calendar/index.html) · [README 확인 순서](worklog/README.md) · 개인 stub: [`guide-personal-worklog.md`](worklog/guide-personal-worklog.md) → Notion [팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95)
