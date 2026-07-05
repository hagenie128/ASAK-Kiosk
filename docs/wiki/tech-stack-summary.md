# ASAK 기술스택 요약

> 팀 공통 결정 — 임의 변경 시 Notion·이슈에 사유 기록 후 합의.  
> Notion: [기술 스택 & 라이브러리](https://app.notion.com/p/39051ef04f0b801cb506f1a930b847a5)

## 백엔드 (Spring Boot 3.3 · Java 21)

| 항목 | 버전·도구 |
|------|-----------|
| 언어 | Java 21 |
| 프레임워크 | Spring Boot 3.3.x |
| ORM | Spring Data JPA |
| DB | MySQL 8.0.x (운영) · H2 (로컬·테스트) |
| 빌드 | Gradle 8.x |

### 필수 라이브러리

| 이름 | 용도 | 권장 Week |
|------|------|-----------|
| Spring Web | REST API · `ApiResponse` envelope | 3~4 |
| Spring Data JPA | 엔티티·리포지토리 · 3NF 22테이블 매핑 | 3~4 |
| Bean Validation (`spring-boot-starter-validation`) | 요청 DTO `@NotNull` 등 검증 | 3~4 |
| Lombok | Entity/DTO 보일러플레이트 제거 | 3 |
| H2 Database | 로컬 개발·단위 테스트용 인메모리 DB | 3 |
| MySQL Connector/J | 운영·통합 환경 MySQL 연결 | 3~4 |
| `backend/src/main/resources/seed/` JSON | 메뉴·옵션 시드 17종 로딩 | 3 |

### 권장 라이브러리

| 이름 | 용도 | 권장 Week |
|------|------|-----------|
| Springdoc OpenAPI | Swagger UI · API-001~020 명세와 동기화 | 4~5 |
| MapStruct | Entity ↔ Response DTO 변환 (수동 매핑 대체) | 4~5 |
| Spring Data JPA Specification | 동적 검색·필터 (관리자 주문 목록 등) | 5~6 |
| QueryDSL (선택) | 복잡 조인·타입 안전 쿼리 (Specification 대안) | 6~7 |
| Mockito + JUnit 5 | Service 단위 테스트 | 5~7 |
| Testcontainers (MySQL) | CI·통합 테스트용 실 DB 환경 | 7~8 |
| Flyway 또는 Liquibase | 스키마 마이그레이션 (`schema.sql` 이후) | 4~5 |

## 프론트엔드 (React 18 · Vite 5 · ASAK-front)

| 항목 | 버전·도구 |
|------|-----------|
| UI | React 18.x |
| 빌드 | Vite 5.x |
| 스타일 | 일반 CSS 또는 CSS Modules (**Tailwind 미사용**) |
| HTTP | Axios 1.x |
| 상태관리 | Zustand |

> 통합 repo `frontend/viewer/`는 Vanilla JS 리서치 뷰어입니다. 키오스크 UI는 **ASAK-front** 별도 repo에서 React로 구현합니다.

### 필수 라이브러리

| 이름 | 용도 | 권장 Week |
|------|------|-----------|
| React 18 | 키오스크·관리자 UI 컴포넌트 | 3~5 |
| React DOM 18 | Vite SPA 렌더링 | 3 |
| Vite 5 | 개발 서버·프로덕션 빌드 | 1~2 |
| React Router 6 | SCR-001~011 화면 전환·딥링크 | 3~4 |
| Axios 1.x | Spring Boot API 호출 · `ApiResponse` 파싱 | 3~4 |
| Zustand | 장바구니·옵션 선택·UI 로컬 상태 | 3~5 |
| 일반 CSS / CSS Modules | Figma 기준 태블릿 세로 레이아웃 | 2~5 |

### 권장 라이브러리

| 이름 | 용도 | 권장 Week |
|------|------|-----------|
| TanStack Query (React Query) | 메뉴·옵션 API 캐싱·로딩·재시도 | 4~5 |
| axios 인터셉터 래퍼 | 공통 baseURL · 에러·`ApiResponse` unwrap | 3~4 |
| MSW (Mock Service Worker) | 백엔드 미완 시 화면 병행 개발 | 3~4 |
| Vitest + React Testing Library | 옵션·가격 계산 컴포넌트 테스트 | 7~8 |
| `zustand/middleware` persist (선택) | 세션 타임아웃 전 장바구니 유지 검토 | 5~6 |
| `react-error-boundary` | 결제·네트워크 오류 화면 격리 | 5~6 |

## 공통 · 도구 · 데이터

### 필수

| 이름 | 용도 | 권장 Week |
|------|------|-----------|
| `asak-data/seed/` JSON | 84메뉴·옵션 시드 (manifest v2) | 1~3 |
| Git + GitHub | `main` / `develop` / `feature/*` / `fix/*` | 1 |
| Notion | 요구사항·WBS·API 명세·화면 설계 정본 | 1~9 |
| Figma | SCR 태블릿 세로 UI · 컴포넌트 | 1~5 |
| DevCopilot Wiki | `docs/wiki/*` → workspace 2 동기화 | 1~9 |

### 권장

| 이름 | 용도 | 권장 Week |
|------|------|-----------|
| `worklog/scripts/init_daily.py` | 일일 워크로그 파일 생성 | 1~ |
| `worklog/scripts/sync_daily_to_notion.py` | Git daily → Notion 캘린더 동기화 | 1~ |
| `asak-data/scripts/download_menu_images.py` | 메뉴 이미지 84종 수집 | 2~3 |
| `data-pipeline/phase1/` (Python) | 매장 크롤링·PostgreSQL 1차 (앱 DB와 분리) | 1~2 |
| GitHub Issues + PR 템플릿 | WBS 티켓·코드 리뷰 | 1~6 |
| Springdoc / Swagger URL | 프론트·백 API 계약 공유 | 4~5 |

## 협업·운영

| 항목 | 내용 |
|------|------|
| VCS | Git + GitHub |
| 브랜치 | `main`, `develop`, `feature/*`, `fix/*` |
| 커밋 | `feat:`, `fix:`, `docs:`, `refactor:` |
| 설계 | Notion, Figma |
| 프로젝트 허브 | DevCopilot workspace 2 |

## API 응답 형식 (통일)

```json
{
  "success": true,
  "status": 200,
  "code": "CATEGORY_LIST_SUCCESS",
  "message": "카테고리 목록 조회 성공",
  "data": {}
}
```

- 필드: `{ success, status, code, message, data }`
- 비즈니스 payload는 `data`에만 둔다.

## 네이밍

- **백엔드**: 클래스 PascalCase, 변수/메서드 camelCase, DB 컬럼 snake_case
- **프론트**: 컴포넌트 PascalCase, 함수/변수 camelCase

## 데이터 파이프라인

- 경로: `data-pipeline/phase1/` (통합 저장소)
- 시드: `asak-data/seed/` — 메뉴·재료·옵션·영양 JSON
- 이미지: `asak-data/images/menu/`

## 9주 로드맵과 라이브러리 도입 시점

| Week | 목표 | 라이브러리 포인트 |
|------|------|-------------------|
| 1~2 | 기획·환경·시드 | Vite·Gradle·seed JSON·worklog |
| 3~4 | DB/API·화면·연동 | JPA·Validation·Axios·Router·Zustand |
| 5 | MVP (SCR-001~008) | Springdoc·React Query·MapStruct |
| 6 | 관리자·품절 | Specification·관리자 API |
| 7~8 | 통합 QA | Testcontainers·Vitest·MSW 정리 |
| 9 | 최종 발표 | 배포·데모 URL 확정 |
