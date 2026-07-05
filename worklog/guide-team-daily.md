# ASAK 팀 일일 워크로그 가이드



> **Notion (편집 정본):** [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) · **일일 기록 DB:** [📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9)  

> **매일 퇴근 전 5분** — Git에 정본을 남기고 Notion Calendar로 팀과 공유합니다.



| 항목 | 링크 |

|---|---|

| Notion 허브 | [🧾 키오스크 풀스택 프로젝트](https://app.notion.com/p/39151ef04f0b808f99f8ea068efb5790) |

| Notion Calendar | [📅 일일 워크로그](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) |

| Git 정본 | [`worklog/daily/{이름}/`](daily/) · 공유 [`_team/`](daily/_team/) |

| 상세 템플릿 (12섹션) | [`docs/guides/03-work-log-template.md`](../docs/guides/03-work-log-template.md) |

| 상세 작성 예시 | [`docs/guides/04-sample-work-log-example.md`](../docs/guides/04-sample-work-log-example.md) |

| 팀 일정 (9주) | [01. 팀/역할/일정](https://app.notion.com/p/15451ef04f0b821c83568124e6ebb32f) |

| 폴더·확인 순서 | [`worklog/README.md`](README.md) |

| 개인별 가이드 | Notion [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95) · Git [`guide-personal-worklog.md`](guide-personal-worklog.md) |



---



## daily ↔ 상세 기록 (한 시스템)



| | **일일** `daily/{이름}/YYYY-MM-DD.md` | **상세** `entries/{이름}/` + [03 템플릿](../docs/guides/03-work-log-template.md) |

|---|---|---|

| 단위 | 하루 | 기능·이슈·PR 하나 |

| Notion | **오늘 요약** 표 → 캘린더 DB | Git 링크로만 (표·미니 카드에 연결) |

| 분량 | 표 1줄 + **오늘 작업** 미니 카드 | 12섹션 전체 |

| 공통 이름 | 작업 목적 · 직접 구현 · AI 도움 · 이슈 · 검증 · 포트폴리오 요약 | §2 · §3 · §5 · §6·§7 · §10 · §11 |



**매일:** 표에 팀 공유 한 줄 → 작업 카드에 미니 필드 → `entries/` 상세 링크. 12섹션을 daily에 매일 복붙하지 않습니다.



---



## Quick Start (3단계)



### 1. 오늘 파일 준비



```powershell

cd C:\greens   # ASAK 통합 저장소

python worklog/scripts/init_daily.py

# → worklog/daily/{본인}/YYYY-MM-DD.md (git user → team_config.json)

# 다른 팀원·팀 공유: --person 김나연 | --person team

```



`worklog/daily/{이름}/YYYY-MM-DD.md` 가 없으면 `templates/template-daily-auto.md` 기준으로 생성됩니다.



수동 템플릿: `templates/template-daily-manual.md` 복사 또는 `init_daily.py --template manual`



### 2. 표 + 작업 카드 작성



**① 오늘 요약** — Notion 캘린더용 한 줄:



| 담당자 | 저장소 | 작업 | WBS / Issue | 상태 | 블로커 |

|---|---|---|---|---|---|

| 이하진 | ASAK-front | SCR-003 메뉴 옵션 UI — 가격 즉시 반영 | WBS-012 / #12 | ✅ 완료 | - |



- **WBS** · **GitHub Issue** (`#번호`) · **PR URL** 을 작업 열에 함께 적으면 Notion·캘린더에서 추적이 쉽습니다.



**② 오늘 작업** — 기능·이슈마다 미니 카드 (상세와 같은 섹션 이름, 1~2줄씩):



- **작업 목적** · **직접 구현** · **AI 도움** · **이슈** · **검증** · **포트폴리오 요약**

- 마지막 줄 **상세 기록 →** `entries/{이름}/YYYY-MM-DD-주제.md` 링크



디버깅·구현 흐름·첨부 등 **깊은 내용**은 [`entries/`](entries/) + [03-work-log-template.md](../docs/guides/03-work-log-template.md) 12섹션.



### 3. Notion 동기화



```powershell

# Windows one-liner

.\worklog\scripts\sync_today.ps1



# 또는

python worklog/scripts/sync_daily_to_notion.py --date today

```



동기화 후 Notion **📅 일일 워크로그 → 캘린더** 뷰에서 오늘 날짜를 확인하세요.



> **참고:** sync 스크립트는 **오늘 요약 표**만 Notion DB에 올립니다. **오늘 작업** 미니 카드와 `entries/` 상세는 Git `daily/`·`entries/`가 정본입니다.



---



## daily ↔ entries 예시



아래는 [04-sample-work-log-example.md](../docs/guides/04-sample-work-log-example.md) (SCR-003 · 이하진 · 12섹션)과 **같은 작업**을 daily에 적은 모습입니다.



```markdown

## 오늘 요약



| 담당자 | 저장소 | 작업 | WBS / Issue | 상태 | 블로커 |

|---|---|---|---|---|---|

| 이하진 | ASAK-front | SCR-003 메뉴 옵션 UI — 옵션·수량 변경 시 가격 즉시 반영 | WBS-012 / #12 | ✅ 완료 | - |



## 오늘 작업



### SCR-003 메뉴 옵션 UI — SCR-003 · WBS-012 / #12 · `feature`



- **작업 목적:** 옵션·수량 변경 시 화면·장바구니 가격 불일치 해소

- **직접 구현:** 옵션 상태 구조, 합계 계산, 필수 옵션 검증, 장바구니 payload 정렬

- **AI 도움:** Cursor — 계산 함수 분리 아이디어 (상태·payload는 직접 수정)

- **이슈:** 화면/장바구니 가격 불일치 → 공통 계산 함수로 통일

- **검증:** `npm run dev` — 옵션·수량·필수옵션·장바구니 총액 ✅

- **포트폴리오 요약:** React SCR-003 옵션 UI 상태·가격 계산 직접 설계

- **상세 기록 →** [`entries/2026-07-02-scr-003-menu-option-ui.md`](entries/이하진/2026-07-02-scr-003-menu-option-ui.md) · [04 예시](../docs/guides/04-sample-work-log-example.md)

```



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

오늘 worklog/daily/YYYY-MM-DD.md 채워주고 sync_daily_to_notion.py --date today 실행해줘 (표 + 오늘 작업 미니 카드, entries 링크, WBS/PR/Issue 포함)

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
| 담당자 지정 | `python worklog/scripts/init_daily.py --person 이하진` |
| 전원 동기화 | `python worklog/scripts/sync_daily_to_notion.py --date today --all` |

| 파싱만 확인 | `python worklog/scripts/sync_daily_to_notion.py --date today --dry-run` |

| Notion 업로드 | `.\worklog\scripts\sync_today.ps1` |

| MCP용 JSON | `python worklog/scripts/sync_daily_to_notion.py --date today --json` |


