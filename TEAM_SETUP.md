# ASAK 팀 세팅 가이드

이 문서는 팀원이 `ASAK (A Salad A Kiosk)` 구조를 같은 방식으로 세팅하고 작업을 시작할 수 있도록 만든 공용 가이드입니다.

## 1. 저장소 구조

사용 저장소는 3개입니다.

- 통합 문서/운영: `ASAK`
- 프론트엔드 뷰어: `ASAK-front`
- 실제 백엔드 앱: `ASAK-back`
- 1차 크롤링 파이프라인: `ASAK` 통합 저장소 내부 `data-pipeline/phase1`

권장 로컬 폴더:

```text
c:\ha-team       -> ASAK (통합)
c:\ASAK-front    -> ASAK-front
c:\ASAK-back     -> ASAK-back
```

## 2. 최초 클론

PowerShell에서:

```powershell
git clone https://github.com/hagenie128/ASAK.git c:\ha-team
git clone https://github.com/hagenie128/ASAK-front.git c:\ASAK-front
git clone https://github.com/hagenie128/ASAK-back.git c:\ASAK-back
```

## 3. 필수 프로그램

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

## 4. 실제 백엔드 세팅

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

## 5. 1차 크롤링 파이프라인 세팅

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

## 6. 프론트 세팅

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

## 7. 통합 저장소 사용법

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

## 8. 작업 순서 추천

1. `c:\ha-team\data-pipeline\phase1`에서 크롤링/가공 후 `output/` 데이터 최신화
2. 필요하면 `sync_phase1_data_to_front.bat` 또는 직접 복사로 `c:\ha-team\data-pipeline\phase1\output\`의 JSON을 `ASAK-front\data\`에 반영
3. `ASAK-back`에서 실제 API/서비스 로직 작업
4. `ASAK-front`에서 `python build_viewer.py` 실행
5. 화면 확인 후 각 저장소별 커밋

## 9. 팀 공통 Git 순서

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

## 10. 작업 기록 규칙

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
- 프로젝트 종료 전에는 개인별로 `PERSONAL_PORTFOLIO_TEMPLATE.md` 기준 요약본을 1회 정리

기록 템플릿:

- `WORK_LOG_TEMPLATE.md`
- `PERSONAL_PORTFOLIO_TEMPLATE.md`

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
## 11. Cursor에서 쓰는 추천 프롬프트

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

## 12. 주의사항

- PowerShell에서 `Activate.ps1`이 막히면 가상환경 활성화 대신 직접 Python 경로를 호출하세요.
- 1차 크롤링 데이터 원본은 `c:\ha-team\data-pipeline\phase1\output` 기준으로 관리하는 것을 권장합니다.
- 프론트는 기본적으로 크롤링 산출물을 포함하지 않으며, 필요할 때만 `ASAK-front\data`로 복사해 사용합니다.
- 토큰이나 비밀번호는 저장소에 커밋하지 않습니다.
- AI가 관여한 작업은 PR, 이슈, 작업 기록 중 최소 한 곳에 남겨두는 것을 권장합니다.

## 13. 빠른 복구용 명령

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

## 14. 팀원 온보딩 체크리스트

### Day 1 체크

- `ASAK`, `ASAK-front`, `ASAK-back` 3개 저장소를 모두 클론했다.
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
