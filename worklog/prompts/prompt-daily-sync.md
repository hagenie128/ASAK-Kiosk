# Cursor 프롬프트 — 일일 워크로그 자동 작성·동기화

아래 블록을 Cursor 채팅에 붙여넣고, 오늘 작업 맥락(브랜치·이슈·PR)을 함께 전달하세요.

---

## 프롬프트 A: 오늘 daily 작성

```text
ASAK worklog 규칙에 맞춰 오늘 worklog/daily/YYYY-MM-DD.md 를 채워줘.

요구사항:
1. 파일이 없으면 `python worklog/scripts/init_daily.py` 로 생성
2. `## 오늘 요약` 표는 팀 표 형식 (담당자 | 저장소 | 작업 | WBS/Issue | 상태 | 블로커)
3. 내가 오늘 한 작업·PR·이슈를 반영 (없으면 물어봐)
4. WBS ID, GitHub Issue (#번호), PR 링크를 작업 열에 포함
5. 블로커·내일 계획 섹션도 짧게 정리
6. 상세 내용은 worklog/entries/ 파일 1건 제안 (파일명: YYYY-MM-DD-주제.md)

참고: worklog/guide-team-daily.md, worklog/templates/template-daily-auto.md
```

## 프롬프트 B: Notion 동기화

```text
방금 작성한 worklog/daily/YYYY-MM-DD.md 를 Notion 일일 워크로그 DB에 올려줘.

순서:
1. `python worklog/scripts/sync_daily_to_notion.py --date today --dry-run` 으로 파싱 확인
2. NOTION_TOKEN 이 있으면 `python worklog/scripts/sync_daily_to_notion.py --date today`
3. 토큰이 없으면 `--json` 출력 후 Notion MCP notion-create-pages / notion-update-page 로 upsert
4. 완료 후 Notion Calendar 뷰 URL 안내

DB: https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9
```

## 프롬프트 C: 퇴근 전 5분 (올인원)

```text
퇴근 전 worklog 루틴 실행해줘:
1. init_daily.py (오늘 파일 없으면 생성)
2. 오늘 커밋/PR/이슈 기준으로 daily md 채우기
3. sync_daily_to_notion.py --date today 실행
4. Notion 캘린더에서 오늘 행 확인 방법 알려주기
```

## 수동 명령 (비-Cursor)

```powershell
cd C:\greens
python worklog/scripts/init_daily.py
# daily 파일 편집 후
python worklog/scripts/sync_daily_to_notion.py --date today
```
