# ASAK

`ASAK`는 `A Salad A Kiosk`의 통합 저장소입니다.

이 저장소는 프론트, 실제 백엔드, 데이터 파이프라인 작업을 한곳에서 관리하기 위한 루트이며, 실제 구현은 아래처럼 분리되어 있습니다.

- `frontend/`: ASAK 정적 뷰어와 배포 자산
- `backend/`: 실제 백엔드 앱 기본 구조
- `data-pipeline/phase1/`: 1차 크롤링, 데이터 가공, DB 문서

## 로컬 구조

```text
frontend/   프론트엔드 뷰어
backend/    실제 백엔드 앱
data-pipeline/
  phase1/   1차 크롤링/데이터 파이프라인
.github/    통합 워크플로우
```

## 별도 저장소

- `ASAK-front`
- `ASAK-back`

각 저장소는 이 통합 구조를 기준으로 별도 폴더와 원격으로도 분리됩니다.

## 저장소

- 통합: `https://github.com/hagenie128/ASAK`
- 프론트: `https://github.com/hagenie128/ASAK-front`
- 백엔드: `https://github.com/hagenie128/ASAK-back`

## 팀 세팅 가이드

팀원이 그대로 세팅할 수 있도록 순서, 명령어, Cursor 프롬프트까지 정리한 문서는 아래 파일에 있습니다.

- `TEAM_SETUP.md`
- `WORK_LOG_TEMPLATE.md`
- `PERSONAL_PORTFOLIO_TEMPLATE.md`
