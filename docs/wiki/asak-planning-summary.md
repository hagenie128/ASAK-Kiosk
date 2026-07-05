# ASAK 종합 기획서 요약

> Notion·팀 문서 기준 요약 (2026-07-05). 상세는 Notion 프로젝트 허브 참고.

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | **ASAK** (A Salad A Kiosk) |
| 목표 | 샐러디 매장 수준의 키오스크 주문 시스템 (메뉴→옵션→장바구니→결제) |
| 팀 | 4인 (프론트 2, 백엔드 2) |
| 일정 | 9주 (7/2~9/2) |
| 데이터 | [샐러디(salady.com)](https://salady.com) 공개 정보 참고 — 학원·포트폴리오용 |

## 저장소 구조

| 저장소 | 역할 |
|--------|------|
| [ASAK](https://github.com/hagenie128/ASAK) | 통합 문서, 데이터 파이프라인, 팀 가이드 |
| [ASAK-front](https://github.com/hagenie128/ASAK-front) | React 키오스크·관리자 UI |
| [ASAK-back](https://github.com/hagenie128/ASAK-back) | Spring Boot API·주문·결제 |

## 고객·관리자 흐름

**고객 키오스크**: 홈 → 먹고가기/포장 → 메뉴선택 → 메뉴상세/옵션 → 장바구니 → 주문확인 → 결제 → 주문완료

**관리자**: 주문관리 → 주문상세 / 품절관리 / (후반) 로그인·메뉴·결제수단·매출

## 협업 도구

- **GitHub** — 코드·이슈·PR (`docs/guides/02-github-issues-guide.md`)
- **Notion** — 요구사항·WBS·화면설계
- **DevCopilot** — workspace 2 (요구사항·API·WBS·Wiki)
- **worklog/** — 일일·상세 작업 기록

## 9주 마일스톤 (개요)

| 주차 | 초점 |
|------|------|
| week-1~2 | 환경·기술스택·DB·메뉴/옵션 기초 |
| week-3~4 | 키오스크 주문 흐름·장바구니·API 연동 |
| week-5~6 | 결제·관리자·품절 |
| week-7~8 | 통합·테스트·데모·문서 |
