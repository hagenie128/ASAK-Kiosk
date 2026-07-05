# Cursor 프롬프트 — 일일 워크로그 자동 작성·동기화

아래 블록을 Cursor 채팅에 붙여넣고, 오늘 작업 맥락(브랜치·이슈·PR)을 함께 전달하세요.

---

## 프롬프트 A: 오늘 daily 작성

```text
ASAK worklog 규칙에 맞춰 오늘 worklog/daily/{본인}/YYYY-MM-DD.md 를 채워줘.

요구사항:
1. 파일이 없으면 `python worklog/scripts/init_daily.py` 로 생성 (개인 폴더)
2. `## 오늘 요약` 표 — 담당자 | 저장소 | 작업 | WBS/Issue | 상태 | 블로커
3. `## 오늘 작업` — 미니 카드 + `entries/{본인}/YYYY-MM-DD-주제.md` 링크
4. 내가 오늘 한 작업·PR·이슈를 반영 (없으면 물어봐)
5. WBS ID, GitHub Issue (#번호), PR 링크를 작업 열에 포함

참고: worklog/guide-team-daily.md, worklog/templates/template-daily-auto.md
```

## 프롬프트 B: Notion 동기화

```text
방금 작성한 worklog/daily/{본인}/YYYY-MM-DD.md 를 Notion 일일 워크로그 DB에 올려줘.

순서:
1. `python worklog/scripts/sync_daily_to_notion.py --date today --dry-run`
2. NOTION_TOKEN 이 있으면 sync 실행 (기본: git user → 본인 파일)
3. 토큰 없으면 `--json` + Notion MCP upsert
```

## 프롬프트 C: 퇴근 전 5분 (올인원)

```text
퇴근 전 worklog 루틴:
1. init_daily.py (오늘 본인 파일 없으면 생성)
2. 오늘 커밋/PR/이슈 기준으로 daily md 채우기
3. sync_daily_to_notion.py --date today
4. Notion 캘린더 확인 방법 안내
```

## 수동 명령 (비-Cursor)

```powershell
cd C:\greens
python worklog/scripts/init_daily.py
# worklog/daily/{본인}/YYYY-MM-DD.md 편집 후
python worklog/scripts/sync_daily_to_notion.py --date today
```
