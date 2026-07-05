# ASAK 워크로그

> **Notion:** 사용법 [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) · 일일 기록 [📅 일일 워크로그 DB](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) · [📖 문서 읽는 순서](https://app.notion.com/p/39451ef04f0b81088a91d914f985fb11)  
> **Git (원본):** [worklog/](https://github.com/hagenie128/ASAK/tree/main/worklog) — ASAK repo

4인 팀 · **9주** ASAK 프로젝트 (7/2~9/2 발표)의 **일일 요약 + 상세 기록 + 캘린더 뷰**를 한곳에서 관리합니다.

관련 문서: [`docs/guides/01-team-setup.md`](../docs/guides/01-team-setup.md) · [`docs/guides/03-work-log-template.md`](../docs/guides/03-work-log-template.md) · [`docs/guides/04-sample-work-log-example.md`](../docs/guides/04-sample-work-log-example.md) · [`docs/guides/02-github-issues-guide.md`](../docs/guides/02-github-issues-guide.md)

---

## daily ↔ 상세 (한 시스템)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  daily/{이름}/YYYY-MM-DD.md    entries/{이름}/YYYY-MM-DD-주제.md          │
│  ─────────────────────────     ─────────────────────────────────         │
│  오늘 요약 (표 1줄) ──────────► Notion 캘린더 (담당=본인)                  │
│  오늘 작업 (미니 카드) ───────► entries 링크 (같은 섹션 이름)              │
│       │                              │                                   │
│       │    작업 목적 · 직접 구현 ·     │    §2~§12 전체                      │
│       │    AI · 이슈 · 검증 ·         │    (03 템플릿)                      │
│       │    포트폴리오 요약            │                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

| 기록 | 위치 | 분량 |
|---|---|---|
| 팀·캘린더 한 줄 | `daily/{이름}/` **오늘 요약** 표 → Notion DB | 1행씩 (본인 파일) |
| 하루 미니 요약 | `daily/{이름}/` **오늘 작업** 카드 | 섹션당 1~2줄 |
| 기능·이슈 깊은 기록 | `entries/{이름}/` + [03-work-log-template](../docs/guides/03-work-log-template.md) | 12섹션 |
| 공유 인프라 (선택) | `daily/_team/` | 담당 **미지정** 행 |

팀원: **이하진 · 김나연 · 박유진 · 강민준** — Git 사용자 매핑은 [`team_config.json`](team_config.json)

---

## 확인 순서 (처음 읽을 때)

1. **상세가 어떻게 생겼는지** — [04-sample-work-log-example.md](../docs/guides/04-sample-work-log-example.md) · [03-work-log-template.md](../docs/guides/03-work-log-template.md) 「일일 워크로그와의 관계」
2. **팀·개인 daily 가이드** — [`guide-team-daily.md`](guide-team-daily.md) · [`guide-personal-worklog.md`](guide-personal-worklog.md) · Notion [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95)
3. **daily 템플릿** — [`templates/template-daily-auto.md`](templates/template-daily-auto.md)
4. **로컬 작성** — `python worklog/scripts/init_daily.py` → `daily/{본인}/YYYY-MM-DD.md`
5. **Notion 동기화** — `.\worklog\scripts\sync_today.ps1` (본인 파일의 표 행만 DB 업로드)
6. **주간 회고** — 금요일 `weekly/YYYY-Www.md` · (선택) `python worklog/scripts/build_calendar.py`

**Cursor / MCP:** [`guide-mcp-sync.md`](guide-mcp-sync.md) · [`prompts/prompt-daily-sync.md`](prompts/prompt-daily-sync.md)

---

## 폴더 구조

```text
worklog/
  README.md
  team_config.json          Git user → 담당자 매핑
  guide-team-daily.md
  guide-personal-worklog.md
  templates/
  daily/
    이하진/YYYY-MM-DD.md
    김나연/
    박유진/
    강민준/
    _team/                  공유 인프라 (담당 미지정, 선택)
  entries/
    {이름}/YYYY-MM-DD-주제.md
  weekly/
  calendar/
  scripts/
```

---

## daily 작성법

```powershell
cd C:\greens
python worklog/scripts/init_daily.py              # git user → 본인 폴더
python worklog/scripts/init_daily.py --person 이하진
python worklog/scripts/init_daily.py --person team   # _team/ 공유 작업
```

1. **오늘 요약** — 표에 담당자·저장소·작업·WBS/Issue·상태·블로커 (Notion sync 대상)
2. **오늘 작업** — 미니 카드 + `entries/{이름}/` 링크
3. 상세 12섹션은 `entries/{이름}/` — [03-work-log-template.md](../docs/guides/03-work-log-template.md)

---

## Notion 동기화

```powershell
python worklog/scripts/sync_daily_to_notion.py --date today --dry-run
python worklog/scripts/sync_daily_to_notion.py --date today              # 본인 파일
python worklog/scripts/sync_daily_to_notion.py --date today --all        # 모든 팀원 파일
$env:NOTION_TOKEN = "secret_..."
python worklog/scripts/sync_daily_to_notion.py --date today
```

- **업로드 범위:** **오늘 요약** 표만 (미니 카드·entries는 Git 링크로 확인)
- **Git daily URL:** `worklog/daily/{이름}/YYYY-MM-DD.md`

DB: [📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) · 설정: `notion_config.json`

---

## Issue ↔ WBS ↔ worklog

1. **GitHub Issue** — [`docs/guides/02-github-issues-guide.md`](../docs/guides/02-github-issues-guide.md)
2. **WBS / DevCopilot** — Notion·학원 WBS 동기화
3. **worklog** — `entries/{이름}/` 12섹션 + `daily/{이름}/` 표·미니 카드
