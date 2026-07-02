# ASAK-front

`ASAK-front`는 `ASAK (A Salad A Kiosk)`의 정적 프론트엔드 뷰어 저장소입니다.

포함 범위:

- 로컬 데이터 뷰어
- 정적 배포용 사이트 빌드
- Netlify/GitHub Pages 배포 스크립트
- 뷰어/배포 코드만 관리

## 주요 폴더

- `viewer/`: 개발용 뷰어 소스
- `docs/`: 배포용 정적 결과물

## 데이터 정책

- 1차 크롤링 산출물은 프론트 저장소에 기본 포함하지 않습니다.
- 필요하면 통합 저장소의 `data-pipeline/phase1/output/`에서 JSON을 별도로 복사해 사용합니다.
- 즉, 프론트는 뷰어 코드 중심이고 크롤링 결과물은 소유하지 않습니다.

## 실행

```powershell
python run_viewer.py
```

데이터가 없는 상태로 실행하면 안내 화면만 표시됩니다.

## 정적 빌드

```powershell
python build_viewer.py
```
