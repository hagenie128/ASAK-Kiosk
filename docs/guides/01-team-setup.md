# ASAK 팀 세팅 가이드

> **Notion:** [01. 팀/역할/일정](https://app.notion.com/p/15451ef04f0b821c83568124e6ebb32f) · [📖 문서 읽는 순서](https://app.notion.com/p/39451ef04f0b81088a91d914f985fb11)  
> **Git:** [`docs/guides/README.md`](README.md) — 가이드 읽기 순서 **01**

이 문서는 팀원이 `ASAK (A Salad A Kiosk)` 구조를 같은 방식으로 세팅하고 작업을 시작할 수 있도록 만든 공용 가이드입니다.

## 1. 저장소 구조

사용 저장소는 3개입니다.

- 통합 문서/운영: `ASAK`
- 프론트엔드 뷰어: `ASAK-front`
- 실제 백엔드 앱: `ASAK-back`
- 1차 크롤링 파이프라인: `ASAK` 통합 저장소 내부 `data-pipeline/phase1`

권장 로컬 폴더:

```text
C:\greens        -> ASAK (통합, Cursor 워크스페이스 — 공식 저장소명은 ASAK)
c:\ha-team       -> ASAK (통합, 동일 원격의 다른 로컬 클론)
c:\ASAK-front    -> ASAK-front
c:\ASAK-back     -> ASAK-back
```

## 2. Git 저장소 관계 (자주 헷갈리는 부분)

세 폴더는 **서로 다른 Git 저장소**입니다. 하나로 합쳐서 관리하는 구조가 아닙니다.

| 로컬 폴더 | GitHub 원격 | 역할 |
|---|---|---|
| `c:\ha-team` | [ASAK](https://github.com/hagenie128/ASAK) | 통합 문서, 파이프라인, 팀 가이드 |
| `c:\ASAK-front` | [ASAK-front](https://github.com/hagenie128/ASAK-front) | 프론트 실제 개발 |
| `c:\ASAK-back` | [ASAK-back](https://github.com/hagenie128/ASAK-back) | 백엔드 실제 개발 |

각 저장소는 `main`, `develop` 브랜치가 있으며, 기능 작업은 `feature/...`, 버그 수정은 `fix/...` 브랜치를 사용합니다.

### 작업 후 `ha-team`에 다시 합쳐야 하나?

**아니요.** 작업이 끝날 때마다 통합 저장소에 다시 모을 필요는 없습니다.

- 프론트 작업 → `c:\ASAK-front`에서 커밋/푸시
- 백엔드 작업 → `c:\ASAK-back`에서 커밋/푸시
- 문서/파이프라인 → `c:\ha-team`에서 커밋/푸시

즉, **어디서 작업했으면 그 저장소에만 올리면** 됩니다.

### `ha-team` 안의 `frontend/`, `backend/`는?

`c:\ha-team\frontend`와 `c:\ASAK-front`는 **다른 Git 저장소**입니다.  
`c:\ha-team\backend`와 `c:\ASAK-back`도 마찬가지입니다.

`ha-team` 안의 `frontend/`, `backend/`는 통합 구조를 보여주는 참고용 폴더에 가깝고, 실제 프론트/백 개발은 각각 `ASAK-front`, `ASAK-back`에서 진행하는 것을 기준으로 합니다.

### 예외: 데이터만 복사하는 경우

코드를 합치는 것이 아니라, 1차 크롤링 JSON만 프론트로 가져올 때는 아래처럼 **파일 복사**만 하면 됩니다.

```powershell
sync_phase1_data_to_front.bat
```

이 경우에도 Git 저장소를 서로 merge할 필요는 없습니다.

## 3. 최초 클론

PowerShell에서:

```powershell
git clone https://github.com/hagenie128/ASAK.git c:\ha-team
git clone https://github.com/hagenie128/ASAK-front.git c:\ASAK-front
git clone https://github.com/hagenie128/ASAK-back.git c:\ASAK-back
```

## 4. 필수 프로그램

권장 설치 항목:

- Git
- Python 3.11
- Cursor 또는 VS Code

이미 이 PC에서는 Python 3.11, Git이 맞춰져 있습니다. 다른 팀원 PC에서는 아래 확인 명령을 먼저 실행하세요.

```powershell
git --version
python --version
py -3.11 --version
```

## 4-1. 기술 스택 · 라이브러리

팀 확정 스택과 **필수/권장 라이브러리**(도입 Week 포함)는 아래를 정본으로 봅니다.

- Git: [`docs/wiki/tech-stack-summary.md`](../wiki/tech-stack-summary.md)
- Notion: [기술 스택 & 라이브러리](https://app.notion.com/p/39051ef04f0b801cb506f1a930b847a5)

요약: 백엔드는 Spring Boot 3.3 + JPA + MySQL/H2, 프론트는 React 18 + Vite + Zustand + Axios(Tailwind 미사용). 실제 구현 repo는 `ASAK-front` / `ASAK-back`입니다.

## 5. 실제 백엔드 세팅

폴더:

```powershell
cd c:\ASAK-back
```

현재는 실제 백엔드 골격만 분리되어 있습니다.

구조:

```text
src/
  main/
    java/
    resources/
  test/
    java/
```

설정 파일:

- `src/main/resources/application.yml`

## 6. 1차 크롤링 파이프라인 세팅

폴더:

```powershell
cd c:\ha-team\data-pipeline\phase1
```

가상환경 생성 및 의존성 설치:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

1차 크롤링 전체 실행:

```powershell
.\.venv\Scripts\python.exe run_phase1.py
```

개별 실행:

```powershell
.\.venv\Scripts\python.exe run_store_menus.py
.\.venv\Scripts\python.exe run_dressing_nutrition.py
.\.venv\Scripts\python.exe run_dressings.py
.\.venv\Scripts\python.exe run_events.py
```

산출물 위치:

- `c:\ha-team\data-pipeline\phase1\output`

## 7. 프론트 세팅

폴더:

```powershell
cd c:\ASAK-front
```

로컬 뷰어 실행:

```powershell
python run_viewer.py
```

정적 빌드:

```powershell
python build_viewer.py
```

주요 폴더:

- `viewer/`: 개발용 프론트 소스
- `data/`: 프론트가 직접 읽는 JSON
- `docs/`: 배포용 정적 결과

데이터 동기화:

```powershell
sync_phase1_data_to_front.bat
```

## 8. 통합 저장소 사용법

통합 저장소 `c:\ha-team`은 작업 기준점입니다.

용도:

- 전체 구조/문서 확인
- 1차 크롤링 파이프라인 관리
- 공통 가이드 관리
- GitHub Actions / 운영용 설정 관리

실제 개발은 보통 아래처럼 나눕니다.

- 프론트 작업: `c:\ASAK-front`
- 백엔드 작업: `c:\ASAK-back`
- 데이터 파이프라인 작업: `c:\ha-team\data-pipeline\phase1`

## 9. 작업 순서 추천

1. `c:\ha-team\data-pipeline\phase1`에서 크롤링/가공 후 `output/` 데이터 최신화
2. 필요하면 `sync_phase1_data_to_front.bat` 또는 직접 복사로 `c:\ha-team\data-pipeline\phase1\output\`의 JSON을 `ASAK-front\data\`에 반영
3. `ASAK-back`에서 실제 API/서비스 로직 작업
4. `ASAK-front`에서 `python build_viewer.py` 실행
5. 화면 확인 후 각 저장소별 커밋

## 10. 팀 공통 Git 순서

브랜치 전략:

- 보호 브랜치: `main`
- 통합 작업 브랜치: `develop`
- 기능 브랜치: `feature/기능명`
- 버그 브랜치: `fix/버그명`

작업 시작:

```powershell
git checkout develop
git pull
git checkout -b feature/기능명
```

작업 확인:

```powershell
git status
git diff
```

커밋:

```powershell
git add .
git commit -m "feat: 작업 내용"
```

푸시:

```powershell
git push
```

권장 흐름:

1. `develop`에서 최신 코드를 당긴다.
2. `feature/...` 또는 `fix/...` 브랜치를 새로 판다.
3. 작업 후 `develop` 기준으로 PR을 만든다.
4. 충분히 검증된 내용만 `main`에 반영한다.

## 11. 프로젝트 일정 (9주 · 7/2~9/2)

> Notion 상세: [01. 팀/역할/일정](https://app.notion.com/p/15451ef04f0b821c83568124e6ebb32f) · GitHub Issue 라벨 `week-1` … `week-9` · [02-github-issues-guide.md](02-github-issues-guide.md)
>
> **4인·학원·평일 기준.** `Day 1~10`, 8주, 1차 발표 용어는 사용하지 않습니다. **8/15(금) 광복절** 휴일.

| Week | 날짜 (평일) | 목표 | 산출물 (현실적 분량) | Milestone |
|---|---|---|---|---|
| Week 1 | 7/2(수)~7/4(금) · 3일 | 기획·Notion·시드·ERD — **설계만, 구현 X** | WBS-001~006, ERD, API 명세 초안, 시드 JSON | `week-1` |
| Week 2 | 7/7(월)~7/11(금) | API/FE **골격** + 금 0.5일 연동 스모크 | API-001~002 골격, SCR 와이어·컴포넌트 뼈대, 금요일 연동 스모크 1회 | `week-2` |
| Week 3 | 7/14(월)~7/18(금) | 키오스크 (1) | SCR-001~002, API-001~002 | `week-3` |
| Week 4 | 7/21(월)~7/25(금) | 키오스크 (2) | SCR-003~004, API-003~004 | `week-4` |
| Week 5 | 7/28(월)~8/1(금) | **MVP** | SCR-001~008, API-001~006, **8/1 E2E 1일** | `week-5` |
| Week 6 | 8/4(월)~8/8(금) | 관리자 | SCR-009~011, API-007~009 | `week-6` |
| Week 7 | 8/11(월)~8/13(수) · **3일** | **스모크 QA만 (필수)** | TC-001~008 + 관리자 상태 변경 최소셋 | `week-7` |
| Week 8 | 8/25(화)~8/28(금) | 통합 E2E + 리허설 | TC-014, 회귀·시연 리허설 (DevCopilot·문서 정합은 여유 시 또는 본 주) | `week-8` |
| Week 9 | 8/31(월)~9/2(수) | 발표 준비·**발표 9/2** | 발표자료, 최종 시연 | `week-9` |

> **Week 7 callout:** 8/11~8/13 **3일 스모크만 필수.** 8/14~8/22 DevCopilot·문서 정합은 **여유 있으면** 진행하거나 **Week 8**로 이동합니다.

## 12. 작업 기록 규칙

일일 개인 요약은 Git [`worklog/daily/{이름}/`](../../worklog/daily/) 정본 + Notion [📅 일일 워크로그 DB](https://app.notion.com/p/eeae4beb07ad4051928a87de0ea4c8f9) Calendar (`sync_daily_to_notion.py --person` 또는 `--all`) 하이브리드로 관리합니다. 공유 인프라는 선택적으로 `daily/_team/` (담당 **미지정**).

- Notion 사용법: [📅 일일 워크로그 — 팀 가이드](https://app.notion.com/p/39451ef04f0b81c0a018e8fe6ea9fb95)
- 팀 공유 Quick Start: [`worklog/guide-team-daily.md`](../../worklog/guide-team-daily.md)
- Cursor 프롬프트: [`worklog/prompts/prompt-daily-sync.md`](../../worklog/prompts/prompt-daily-sync.md)
- MCP 동기화: [`worklog/guide-mcp-sync.md`](../../worklog/guide-mcp-sync.md)
- 폴더·확인 순서: [`worklog/README.md`](../../worklog/README.md)

디버깅, 기여도 정리, 포트폴리오 정리를 위해 작업 기록을 남기는 것을 권장합니다.

반드시 구분해서 적을 항목:

- 내가 직접 구현한 영역
- 어떤 구현 로직/방식을 사용했는지
- AI가 제안하거나 함께 작업한 영역
- 작업 중 발생한 이슈
- 이번 작업에서 추가로 배운 점
- 아직 남아 있는 개선사항
- 검증 방법과 결과

권장 방식:

- 기능 또는 이슈 단위로 기록 1개 작성
- PR 본문, Notion, GitHub Issue, 회의록 중 한 곳에는 반드시 남기기
- 저장소 문서에 남길 때는 템플릿 파일을 복사해서 사용
- 프로젝트 종료 전에는 개인별로 [`05-personal-portfolio-template.md`](05-personal-portfolio-template.md) 기준 요약본을 1회 정리

기록 템플릿:

- [`03-work-log-template.md`](03-work-log-template.md)
- [`05-personal-portfolio-template.md`](05-personal-portfolio-template.md)

최소 기록 항목:

1. 작업 날짜
2. 담당자
3. 작업 저장소/브랜치
4. 직접 구현 영역
5. 구현 로직 / 적용한 방식
6. AI 활용 영역
7. 발생 이슈
8. 이번 작업에서 배운 점
9. 개선 예정 사항
10. 검증 내용
11. 포트폴리오에 쓸 수 있는 한 줄 요약
## 13. Cursor에서 쓰는 추천 프롬프트

### 백엔드 작업 요청

```text
ASAK-back 기준으로 작업해줘.
현재는 기본 골격만 있으니 backend 구조를 확인하고,
필요한 API/서비스 폴더를 추가하는 방식으로 진행해줘.
```

### 데이터 파이프라인 작업 요청

```text
ASAK 통합 저장소의 data-pipeline/phase1 기준으로 작업해줘.
먼저 output 구조와 run_phase1.py 흐름을 확인하고,
필요한 크롤링 로직만 수정한 뒤
실행 검증까지 해줘.
```

### 프론트 작업 요청

```text
ASAK-front 기준으로 작업해줘.
viewer와 docs 빌드 구조를 확인하고,
UI 수정 후 build_viewer.py까지 실행해서 검증해줘.
```

### 통합 구조 점검 요청

```text
ASAK 통합 구조 기준으로 frontend, backend, data-pipeline, 문서 연결 상태를 점검하고
팀원이 헷갈릴 부분이 있으면 README까지 정리해줘.
```

## 14. 주의사항

- PowerShell에서 `Activate.ps1`이 막히면 가상환경 활성화 대신 직접 Python 경로를 호출하세요.
- 1차 크롤링 데이터 원본은 `c:\ha-team\data-pipeline\phase1\output` 기준으로 관리하는 것을 권장합니다.
- 프론트는 기본적으로 크롤링 산출물을 포함하지 않으며, 필요할 때만 `ASAK-front\data`로 복사해 사용합니다.
- 토큰이나 비밀번호는 저장소에 커밋하지 않습니다.
- AI가 관여한 작업은 PR, 이슈, 작업 기록 중 최소 한 곳에 남겨두는 것을 권장합니다.

## 15. 빠른 복구용 명령

데이터 파이프라인 재설치:

```powershell
cd c:\ha-team\data-pipeline\phase1
Remove-Item .venv -Recurse -Force
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

프론트 재빌드:

```powershell
cd c:\ASAK-front
python build_viewer.py
```

## 16. 팀원 온보딩 체크리스트

### Day 1 체크

- `ASAK`, `ASAK-front`, `ASAK-back` 3개 저장소를 모두 클론했다.
- 3개 저장소가 서로 다른 Git 저장소라는 점을 이해했다. (작업 후 `ha-team`에 다시 합칠 필요 없음)
- `git --version`, `py -3.11 --version` 확인을 마쳤다.
- `ASAK-back` 구조와 목적을 이해했다.
- `c:\ha-team\data-pipeline\phase1`에서 가상환경 생성과 `requirements.txt` 설치를 마쳤다.
- `c:\ha-team\data-pipeline\phase1`에서 `run_phase1.py` 실행이 된다.
- `ASAK-front`에서 `python run_viewer.py` 실행이 된다.
- `ASAK-front`에서 `python build_viewer.py` 실행이 된다.
- `ASAK-front\data`와 `c:\ha-team\data-pipeline\phase1\output` 관계를 이해했다.

### 작업 시작 전 체크

- 어느 저장소에서 작업할지 정했다.
- `main`이 아닌 `develop` 또는 작업 브랜치에서 시작했다.
- `git pull`을 먼저 했다.
- 변경 범위가 프론트인지 백엔드인지 통합 문서인지 구분했다.

### 작업 종료 전 체크

- `git status`로 불필요한 파일이 없는지 확인했다.
- 실행 검증을 1회 이상 했다.
- README 또는 팀 문서 수정이 필요한지 확인했다.
- 직접 구현 영역과 AI 활용 영역을 구분해 기록했다.
