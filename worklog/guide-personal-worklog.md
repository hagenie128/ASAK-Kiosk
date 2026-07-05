# 개인별 일일 워크로그 가이드 (Git stub)

> **Notion (편집 정본):** [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95)  
> **Notion DB:** [📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9)  
> **팀 Quick Start:** [`guide-team-daily.md`](guide-team-daily.md) · **확인 순서:** [`README.md`](README.md)

팀 4인(강민준 · 김나연 · 이하진 · 박유진)이 **개인별 파일**로 daily를 작성하고 Notion Calendar에 반영하는 로컬 명령어 요약입니다.

---

## 파일 위치

| 구분 | 경로 |
|---|---|
| 일일 (본인) | `worklog/daily/{이름}/YYYY-MM-DD.md` |
| 상세 (본인) | `worklog/entries/{이름}/YYYY-MM-DD-주제.md` |
| 팀 공유 인프라 (선택) | `worklog/daily/_team/YYYY-MM-DD.md` → Notion 담당 **미지정** |

예: 이하진 → `daily/이하진/2026-07-05.md` · `entries/이하진/2026-07-05-scr-003.md`

---

## 매일 (로컬)

```powershell
cd C:\greens
python worklog/scripts/init_daily.py
# → worklog/daily/{본인}/YYYY-MM-DD.md 생성 (git user → team_config.json)
.\worklog\scripts\sync_today.ps1
```

| 목적 | 명령 |
|---|---|
| 오늘 파일 생성 (본인) | `python worklog/scripts/init_daily.py` |
| 담당자 지정 | `python worklog/scripts/init_daily.py --person 김나연` |
| 팀 공유 작업 | `python worklog/scripts/init_daily.py --person team` |
| 파싱 확인 | `python worklog/scripts/sync_daily_to_notion.py --date today --dry-run` |
| Notion 업로드 (본인) | `.\worklog\scripts\sync_today.ps1` |
| 전원 동기화 | `python worklog/scripts/sync_daily_to_notion.py --date today --all` |

### Git 사용자 등록

`worklog/team_config.json` 의 `git_user_map` 에 본인 GitHub ID·이메일을 등록하면 `--person` 없이 `init_daily`·`sync` 가 동작합니다.

```json
"git_user_map": {
  "hagenie128": "이하진",
  "your-github-id": "김나연"
}
```

---

## 표 + 미니 카드 (본인 파일만)

**① 오늘 요약** — 담당자에 **본인 실명**:

| 담당자 | 저장소 | 작업 | WBS / Issue | 상태 | 블로커 |
|---|---|---|---|---|---|
| 이하진 | ASAK-back | 주문 API | WBS-015 / #42 | ✅ 완료 | - |

**② 오늘 작업** — 미니 카드 + [`entries/{이름}/`](entries/) 링크

Notion 필터 탭(이하진·김나연·박유진·강민준)은 **담당** 속성 기준 — sync 시 본인 파일의 표 행이 해당 탭에 표시됩니다.

---

## 주간 회고 (Git)

금요일: `worklog/weekly/YYYY-Www.md` — 템플릿은 Notion [팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) 참고.
