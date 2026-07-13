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

필요한 경우:

```powershell
sync_phase1_data_to_front.bat
```

## 정적 빌드

```powershell
python build_viewer.py
```

## 통합·개별 프론트 저장소 동기화

ASAK 통합 저장소의 `frontend/` 폴더와 개별 프론트 저장소를 **손으로 복사해서 따로 관리하지 않습니다.** 수동 복사는 어느 쪽이 최신인지 알기 어렵고, 병합 때 충돌이 커집니다.

| 저장소 | 역할 |
| --- | --- |
| `https://github.com/hagenie128/ASAK` | 통합 저장소. `frontend/`, 백엔드·DB·문서를 함께 관리 |
| `https://github.com/hagenie128/ASAK-front` | `frontend/` 폴더만 분리해 보는 프론트 전용 저장소 |
| `https://github.com/hagenie128/ASAK-back` | 백엔드 전용 저장소. 프론트 변경은 올리지 않음 |

### 프론트 전용 저장소로 내보내기

통합 저장소 루트(`C:\ha-team`)에서 실행합니다. 처음 한 번만 remote를 등록합니다.

```powershell
git remote add frontend-upstream https://github.com/hagenie128/ASAK-front.git
git subtree push --prefix=frontend frontend-upstream main
```

### 실행 전 확인

```powershell
git status
git remote -v
```

- `node_modules/`, `dist/`, 실제 `.env` 값은 커밋하거나 동기화하지 않습니다.
- `ASAK-front`에 다른 이력이 있어 push가 거절되면 **강제 push를 하지 않습니다.** 오류 메시지를 공유하고 이력 병합 방법을 먼저 정합니다.
- 프론트 구현은 먼저 통합 저장소의 `frontend/`에서 커밋한 뒤 subtree로 내보냅니다.
- 백엔드 변경은 `ASAK-back`에 별도로 관리합니다.
