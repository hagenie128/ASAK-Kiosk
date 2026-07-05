# 개인별 일일 워크로그 가이드 (Git stub)

> **Notion (편집 정본):** [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95)  
> **Notion DB:** [📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) · [📖 문서 읽는 순서](https://app.notion.com/p/39451ef04f0b81088a91d914f985fb11) (01. 팀/일정 하위)  
> **팀 Quick Start:** [`guide-team-daily.md`](guide-team-daily.md) · **확인 순서:** [`README.md`](README.md)

팀 4인(강민준 · 김나연 · 이하진 · 박유진)이 **개인별**로 daily를 작성하고 Notion Calendar에 반영하는 로컬 명령어 요약입니다. 상세·필터 뷰·주간 회고는 Notion 가이드를 참고하세요.

---

## 매일 (로컬)

```powershell
cd C:\greens
python worklog/scripts/init_daily.py
# worklog/daily/YYYY-MM-DD.md — 본인 행만 표에 추가
.\worklog\scripts\sync_today.ps1
```

| 목적 | 명령 |
|---|---|
| 오늘 파일 생성 | `python worklog/scripts/init_daily.py` |
| 파싱 확인 | `python worklog/scripts/sync_daily_to_notion.py --date today --dry-run` |
| Notion 업로드 | `.\worklog\scripts\sync_today.ps1` |
| MCP용 JSON | `python worklog/scripts/sync_daily_to_notion.py --date today --json` |

`NOTION_TOKEN` 없으면 `--json` 출력을 Cursor Notion MCP로 upsert — [`guide-mcp-sync.md`](guide-mcp-sync.md)

---

## 표 작성 (본인 1줄)

`## 오늘 요약` 표 — 담당자에 **본인 실명** (강민준 / 김나연 / 이하진 / 박유진):

| 담당자 | 저장소 | 작업 | WBS / Issue | 상태 | 블로커 |
|---|---|---|---|---|---|
| 이하진 | ASAK-back | 주문 API | WBS-015 / #42 | ✅ 완료 | - |

---

## 주간 회고 (Git)

금요일: `worklog/weekly/YYYY-Www.md` — 템플릿은 Notion [팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) 참고.
