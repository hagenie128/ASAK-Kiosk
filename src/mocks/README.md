# Mock 데이터

백엔드가 준비되기 전에는 `public/mocks/`의 JSON을 복사하거나, 이 폴더에 기능별 샘플 데이터를 둡니다.

실제 API 연결 뒤에는 mock을 API 응답으로 교체합니다.

## 확장 fixture

`public/mocks/student-project-data.json`은 학생 프로젝트 발표와 화면 확인을 위한 확장 목업입니다.

- 카테고리 8개, 메뉴 28개, 옵션 그룹 4개
- 주문 상태별 주문 15건, 품절 메뉴·옵션, 결제수단 4개
- 최근 14일 매출, 시간대별 매출, 인기 메뉴, 관리자 요약

기존 `kiosk.json`과 `asak-admin-data.json`은 호환성 확인용으로 그대로 두고, 새 화면이나 시나리오 테스트에서 이 fixture를 선택해 사용할 수 있습니다.
