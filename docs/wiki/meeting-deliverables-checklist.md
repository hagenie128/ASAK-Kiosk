# ASAK 회의록 및 최종 배포 검증

> Notion 10. 회의록 + 11. 최종 제출 체크리스트 (2026-07-05)

## 회의록

### 2026-07-03 키오스크 컨셉 회의

| 항목 | 내용 |
|------|------|
| 참석 | 하진, 유진, 나연 |
| 결정 | 서비스명 **ASAK/아삭**, Week 5 MVP = 고객 주문 (SCR-001~008, 8/1) + Week 6 관리자 확인, KVS/매출/멤버십 보류 |
| 디자인 | Primary #16A34A, Crunch Yellow #FACC15, Cream #FFFDF3 |
| 다음 | Figma 팔레트, 화면 흐름도, MVP DB/API, 와이어프레임 |

**MVP 고객**: 홈~결제완료 8화면 · **관리자**: 주문목록/상세/상태/품절

---

## 11. 최종 제출 체크리스트

### 필수 산출물

| 산출물 | 위치 | 상태 |
|--------|------|------|
| 요구사항 정의서 | Notion 02 / Wiki | 완료 |
| 사용자 시나리오 | Notion 03 SC-001~018 | 완료 |
| 화면 설계서 | Notion 04 SCR-001~019 | 진행중 |
| ERD·테이블 정의 | Notion 05 · 22테이블 | 완료 |
| API 명세 | Notion 06 API-001~020 | 완료 |
| React/Spring | GitHub ASAK-front/back | 예정 |
| MySQL seed | asak-data/seed | 진행중 |
| 테스트 결과 | Notion 09 TC-001~014 | 진행중 |
| README | ASAK/README.md | 완료 |

### 시연 체크리스트

- [ ] 관리자 데이터 등록
- [ ] 키오스크 목록 조회
- [ ] 손님 주문 (SC-001)
- [ ] 결제 (SC-004)
- [ ] 완료 화면·주문번호
- [ ] 관리자 주문 확인·상태 변경
- [ ] 품절 비활성화 (SC-003)
- [ ] 재방문 5단계 이내 주문 (SC-002)

### DevCopilot Wiki 검증

1. https://devcopilot.ai.kr/workspace/2/wiki 접속
2. 산출물 8개 Wiki 문서 제목·내용 확인
3. Requirements / APIs / WBS 탭과 ID 추적성 대조

### Notion 문서 완성 (2026-07-05)

- [x] API-001~020 정합
- [x] SC-001~018 Mermaid
- [x] DB ERD 22테이블
- [x] WBS·테스트 Relation 컬럼
- [ ] Figma 프로토타입 (Notion 밖)
- [ ] React/Spring 구현 (Notion 밖)
