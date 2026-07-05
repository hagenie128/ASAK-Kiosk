# ASAK 팀 일일 워크로그 가이드

> **Notion (편집 정본):** [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) · **일일 기록 DB:** [📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9)  
> **매일 퇴근 전 5분** — Git에 정본을 남기고 Notion Calendar로 팀과 공유합니다.

| 항목 | 링크 |
|---|---|
| Notion 허브 | [🧾 키오스크 풀스택 프로젝트](https://app.notion.com/p/39151ef04f0b808f99f8ea068efb5790) |
| Notion Calendar | [📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) |
| Git 정본 | [`worklog/daily/`](daily/) |
| 팀 일정 (9주) | [01. 팀/역할/일정](https://app.notion.com/p/15451ef04f0b821c83568124e6ebb32f) |
| 폴더·확인 순서 | [`worklog/README.md`](README.md) |
| 개인별 가이드 | Notion [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) · Git [`guide-personal-worklog.md`](guide-personal-worklog.md) |

---

## Quick Start (3단계)

### 1. 오늘 파일 준비

```powershell
cd C:\greens   # ASAK 통합 저장소
python worklog/scripts/init_daily.py
```

`worklog/daily/YYYY-MM-DD.md` 가 없으면 `templates/template-daily-auto.md` 기준으로 생성됩니다.

수동 템플릿: `templates/template-daily-manual.md` 복사 또는 `init_daily.py --template manual`

### 2. 표 작성 (팀 형식)

`## 오늘 요약` 표에 한 줄씩:

| 담당자 | 저장소 | 작업 | WBS / Issue | 상태 | 블로커 |
|---|---|---|---|---|---|
| 이하진 | ASAK-back | 주문 API 구현 | WBS-015 / #42 | ✅ 완료 | - |

- **WBS** · **GitHub Issue** (`#번호`) · **PR URL** 을 작업 열에 함께 적으면 Notion·캘린더에서 추적이 쉽습니다.
- 상세 디버깅·AI 활용 내용은 [`worklog/entries/`](entries/) + [`docs/guides/03-work-log-template.md`](../docs/guides/03-work-log-template.md).

### 3. Notion 동기화

```powershell
# Windows one-liner
.\worklog\scripts\sync_today.ps1

# 또는
python worklog/scripts/sync_daily_to_notion.py --date today
```

동기화 후 Notion **📅 일일 워크로그 → 캘린더** 뷰에서 오늘 날짜를 확인하세요.

---

## NOTION_TOKEN 설정 (Integration)

1. [Notion Integrations](https://www.notion.so/my-integrations) → 새 Integration 생성
2. [📅 일일 워크로그 DB](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) 우측 상단 **연결** → Integration 추가
3. PowerShell (세션 또는 사용자 환경 변수):

```powershell
$env:NOTION_TOKEN = "secret_xxxxxxxx"
```

4. `python worklog/scripts/sync_daily_to_notion.py --date today` 재실행

> 토큰은 **저장소에 커밋하지 마세요.** 로컬 환경 변수만 사용합니다.

---

## Cursor 사용자

채팅에 아래 프롬프트 파일을 참고하거나 그대로 붙여넣으세요.

- [`worklog/prompts/prompt-daily-sync.md`](prompts/prompt-daily-sync.md)

예시 한 줄:

```text
오늘 worklog/daily/YYYY-MM-DD.md 채워주고 sync_daily_to_notion.py --date today 실행해줘 (WBS/PR/Issue 링크 포함)
```

Cursor + Notion MCP로 토큰 없이 동기화하는 방법은 [`guide-mcp-sync.md`](guide-mcp-sync.md) 를 참고하세요.

---

## 비-Cursor 사용자 (Python만)

```powershell
python worklog/scripts/init_daily.py
notepad worklog\daily\2026-07-05.md   # 날짜는 오늘로 변경
python worklog/scripts/sync_daily_to_notion.py --date today
```

`NOTION_TOKEN` 이 없으면:

```powershell
python worklog/scripts/sync_daily_to_notion.py --date today --json > _sync.json
```

출력 JSON을 팀 Notion 관리자에게 전달하거나, Notion 웹에서 수동 입력합니다.

---

## Notion Calendar 뷰

1. [📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) 열기
2. 상단 뷰 탭에서 **캘린더** 선택
3. 날짜 속성 **날짜** 기준으로 팀원별 일일 요약 표시
4. **9/2(수) 최종 발표** 마일스톤 행이 캘린더에 고정되어 있습니다

로컬 HTML 미리보기(선택): `python worklog/scripts/build_calendar.py` → `worklog/calendar/`

---

## GitHub Issue milestone 연동

주차별 라벨 `week-1` … `week-9` 와 맞춰 이슈·PR에 라벨을 붙이고, daily 표의 **WBS / Issue** 열에 `#이슈번호` 를 적습니다.

- 가이드: [`docs/guides/02-github-issues-guide.md`](../docs/guides/02-github-issues-guide.md)
- 일정표: [01. 팀/역할/일정](https://app.notion.com/p/15451ef04f0b821c83568124e6ebb32f)

---

## 자주 쓰는 명령

| 목적 | 명령 |
|---|---|
| 오늘 파일 생성 | `python worklog/scripts/init_daily.py` |
| 파싱만 확인 | `python worklog/scripts/sync_daily_to_notion.py --date today --dry-run` |
| Notion 업로드 | `.\worklog\scripts\sync_today.ps1` |
| MCP용 JSON | `python worklog/scripts/sync_daily_to_notion.py --date today --json` |
