# ASAK 워크로그

> **Notion:** 사용법 [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) · 일일 기록 [📅 일일 워크로그 DB](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) · [📖 문서 읽는 순서](https://app.notion.com/p/39451ef04f0b81088a91d914f985fb11)  
> **Git (원본):** [worklog/](https://github.com/hagenie128/ASAK/tree/main/worklog) — ASAK repo

4인 팀 · **9주** ASAK 프로젝트 (7/2~9/2 발표)의 **일일 요약 + 상세 기록 + 캘린더 뷰**를 한곳에서 관리합니다.

관련 문서: [`docs/guides/01-team-setup.md`](../docs/guides/01-team-setup.md) · [`docs/guides/03-work-log-template.md`](../docs/guides/03-work-log-template.md) · [`docs/guides/02-github-issues-guide.md`](../docs/guides/02-github-issues-guide.md)

---

## 확인 순서 (처음 읽을 때)

1. **팀·개인 가이드** — [`guide-team-daily.md`](guide-team-daily.md) (Quick Start) · [`guide-personal-worklog.md`](guide-personal-worklog.md) (개인 stub) · Notion [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95)
2. **daily 템플릿 선택** — 기본: [`templates/template-daily-auto.md`](templates/template-daily-auto.md) (`init_daily.py` 기본값, WBS/Issue 열 포함) · 수동 복사: [`templates/template-daily-manual.md`](templates/template-daily-manual.md)
3. **로컬 작성** — `python worklog/scripts/init_daily.py` → `daily/YYYY-MM-DD.md` 편집
4. **Notion 동기화** — `.\worklog\scripts\sync_today.ps1` 또는 `sync_daily_to_notion.py --date today` → [일일 워크로그 DB](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) 캘린더 뷰 확인
5. **주간 회고** — 금요일 `weekly/YYYY-Www.md` · (선택) `python worklog/scripts/build_calendar.py` → `calendar/` 로컬 미리보기

**Cursor / MCP:** [`guide-mcp-sync.md`](guide-mcp-sync.md) · 프롬프트 [`prompts/prompt-daily-sync.md`](prompts/prompt-daily-sync.md)

---

## 하이브리드 워크플로 (권장)

| 기록 | 위치 |
|---|---|
| 계획·마일스톤 | Notion WBS (기존, 수정 없음) |
| 오늘 한 일 (짧게) | [Notion 📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) → Calendar 뷰 |
| 디버깅·AI·면접용 상세 | Git `entries/` |
| **정본** | Git `daily/YYYY-MM-DD.md` |
| 팀 캘린더 보기 | Notion Calendar + (선택) 로컬 `calendar/` |

---

## 폴더 구조

```text
worklog/
  README.md                 이 파일 — 구조 + 확인 순서
  guide-team-daily.md       팀 Quick Start (3단계)
  guide-personal-worklog.md 개인별 stub (Notion 정본 링크)
  guide-mcp-sync.md         Cursor Notion MCP 동기화
  templates/
    template-daily-auto.md  init_daily.py 기본 템플릿
    template-daily-manual.md  수동 복사용 (`--template manual`)
  prompts/
    prompt-daily-sync.md    Cursor 채팅 프롬프트
  daily/                    YYYY-MM-DD.md — 하루 팀 요약
  entries/                  기능·이슈 단위 상세 (03-work-log-template)
  weekly/                   주간 rollup (YYYY-Www.md)
  calendar/                 정적 캘린더 뷰어 (Vanilla JS)
  scripts/                  init_daily, sync, build_calendar
  notion_config.json        Notion Daily DB ID
```

---

## daily 작성법

1. `python worklog/scripts/init_daily.py` (또는 `templates/template-daily-manual.md` 복사)
2. **오늘 요약** 표에 담당자·저장소·작업·WBS/Issue·상태·블로커 작성
3. 상세 내용은 `entries/`에 별도 파일로 작성하고 daily에 링크

| 담당자 | 저장소 | 작업 | WBS / Issue | 상태 | 블로커 |
|---|---|---|---|---|---|
| 홍길동 | ASAK-front | 옵션 UI | WBS-001 / #12 | ✅ 완료 | - |

---

## 캘린더 (로컬 미리보기)

```powershell
python worklog/scripts/build_calendar.py
cd worklog/calendar
python -m http.server 8080
```

브라우저: [http://localhost:8080](http://localhost:8080) — `file://` 직접 열기 금지.

---

## Notion 동기화

```powershell
python worklog/scripts/sync_daily_to_notion.py --date today --dry-run
python worklog/scripts/sync_daily_to_notion.py --date today --json   # MCP용
$env:NOTION_TOKEN = "secret_..."
python worklog/scripts/sync_daily_to_notion.py --date today
```

- **경로 A (API)**: Notion Integration → Daily DB 연결 → `NOTION_TOKEN`
- **경로 B (MCP)**: `--json` → Cursor Notion MCP — [`guide-mcp-sync.md`](guide-mcp-sync.md)

DB: [📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) · 설정: `notion_config.json`

---

## Issue ↔ WBS ↔ worklog

1. **GitHub Issue** — WBS ID·완료 조건 ([`docs/guides/02-github-issues-guide.md`](../docs/guides/02-github-issues-guide.md))
2. **WBS / DevCopilot** — Notion·학원 WBS 동기화
3. **worklog** — `entries/` 상세 + `daily/` 팀 일일 요약
