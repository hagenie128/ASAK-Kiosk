# 2026-07-05 Notion·문서·DevCopilot 일괄 정리

> **템플릿:** [03-work-log-template.md](../../../docs/guides/03-work-log-template.md) · **일일:** [2026-07-05.md](../../daily/이하진/2026-07-05.md)

---

## 1. 기본 정보

- 작업 날짜: 2026-07-05 (7/6 새벽 세션 포함)
- 담당자: 이하진
- 저장소: ASAK (모노레포)
- 브랜치: `main`
- 관련 이슈/PR: worklog, Notion QA, DevCopilot workspace/2, `68e4631`·`3133be3`·`2f05f54`
- 작업 유형: `docs`

## 2. 작업 목적

- Day 1~10·8주 잔존 용어를 Week·9주 로드맵으로 통일하고 Notion·Git 문서 정본을 정리
- 워크로그를 daily 표 + 미니 카드 + entries 12섹션 한 시스템으로 통합
- API envelope·seed·DevCopilot 동기화 후 origin/main에 반영하고 중복 stub·임시 스크립트 제거

## 3. 직접 구현 영역

- Notion 허브 TOC, 01 팀 운영 레퍼런스 통합, 디자인 hub 5개 하위 역할 분리
- `docs/guides/` 01~06 이동·stub, `worklog/` 가이드·템플릿·sync 스크립트 정비
- `ApiResponse`·`GlobalExceptionHandler`·`api_format.py`, asak-data seed·static assets
- Notion QA 48건 수동·스크립트 수정, Day10 DB 47건 일괄 치환
- DevCopilot Wiki/16·SCR 19건 업로드, Git push (`1982a02`~`2f05f54`)
- `daily/이하진/2026-07-05.md` 표·미니 카드 재작성, redirect stub·일회성 스크립트 삭제

## 4. 구현 로직 / 적용한 방식

- Notion: 허브→하위 페이지 순서로 읽기 경로 고정, 중복 가이드는 archive
- Git: `worklog/daily/{이름}/` 정본 → `sync_daily_to_notion.py`가 표만 Notion DB 업로드
- DevCopilot: Day10 잔여 검증 후 upload 스크립트 실행
- 워크로그: daily 미니 카드 6필드 ↔ entries §2·§3·§5·§6·§10·§11 동일 어휘

## 5. AI 도움 영역

- 사용한 AI 도구: Cursor
- 어떤 질문/요청을 했는지: 대량 QA·치환 스크립트, 가이드 통합, daily 재작성·Notion sync
- AI가 도움 준 내용: 스크립트 초안, 가이드 통합 문서, 화면설계 마크다운, 미니 카드 구조
- 그대로 사용한 부분: sync 스크립트 JSON 출력 구조, 미니 카드 필드 이름
- 수정해서 사용한 부분: Notion 페이지별 예외, API envelope 세부, entries 12섹션 본문

## 6. 발생 이슈

- 이슈 1:
  - 증상: `http://CHECKLIST.md`·hex 이스케이프·Day10 잔존 문구 다수
  - 원인: 이전 8주·Day 기준 문서가 Notion·Git에 혼재
  - 해결: 검색·일괄 치환 후 잔여 0건 확인
- 이슈 2:
  - 증상: Notion 일일 DB에 구형 11행 중복, Git은 신형식인데 캘린더가 구버전 표시
  - 원인: MCP sync 시 기존 행 archive 없이 create만 반복
  - 해결: 구 행 `[중복·통합됨]` 처리 후 신규 11행 재생성

## 7. 디버깅 기록

- 확인한 로그/에러 메시지: `NOTION_TOKEN not set`, Notion query Business plan upsell
- 의심했던 지점: Notion DB 중복 행, daily md 파싱, entries 섹션 번호 불일치
- 실제 원인: Notion은 구형 요약만 반영·중복 생성, entries는 §8~12 이름이 템플릿과 달랐음
- 다시 같은 문제가 생기면 먼저 볼 파일/명령어:
  - `worklog/daily/이하진/2026-07-05.md`
  - `python worklog/scripts/sync_daily_to_notion.py --date 2026-07-05 --person 이하진 --json`
  - Notion 📅 일일 워크로그 캘린더 뷰

## 8. 이번 작업에서 배운 점

- 새로 배운 기술/개념: daily에 12섹션 전체를 복붙하지 않고 미니 카드 + entries 링크가 유지보수에 유리
- 이번에 이해가 선명해진 부분: Notion 캘린더는 표 행만 올리고 상세는 Git이 정본
- 다음 작업에 적용해보고 싶은 점: sync 시 날짜+담당 기존 행 archive 후 upsert 자동화

## 9. 개선사항 / TODO

- 아직 임시 처리한 부분: DevCopilot Screens localStorage — 학원 PC 수동 확인 대기
- 다음 스프린트에서 개선할 부분: `NOTION_TOKEN` 로컬 설정으로 REST sync 경로 활성화
- 성능/구조적으로 아쉬운 부분: Notion MCP query가 Business 플랜 필요 — search+fetch 우회

## 10. 검증 내용

- 실행한 명령어:
  - `python worklog/scripts/sync_daily_to_notion.py --date 2026-07-05 --person 이하진 --json`
  - `python worklog/scripts/init_daily.py`
- 테스트한 시나리오:
  - Notion 허브·01 일정·디자인 5종·워크로그 DB UI 수동 열람
  - DevCopilot workspace/2 요구·시나리오·API·WBS·QA·DB·Wiki 카운트 대조
- 확인 결과:
  - daily 표 4행·미니 카드 4개 파싱 정상
  - `git log`·origin/main push 확인

## 11. 포트폴리오용 요약

9주 키오스크 프로젝트의 Notion·Git·DevCopilot 문서 체계를 Week 용어로 통일하고, daily 미니 카드 + entries 12섹션 2단계 워크로그 시스템을 설계·적용했다.

## 12. 첨부하면 좋은 자료

- [Notion 허브](https://app.notion.com/p/39151ef04f0b808f99f8ea068efb5790)
- [일일 워크로그 DB](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9)
- [DevCopilot Wiki/16](https://devcopilot.ai.kr/workspace/2/wiki/16)
- Git daily: `worklog/daily/이하진/2026-07-05.md`
