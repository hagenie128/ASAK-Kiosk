# ASAK Kiosk

ASAK 주문 키오스크 전용 React/Vite 프로젝트입니다. 관리자 운영 화면은 별도 `ASAK_Admin` 저장소에서 개발합니다.

> 이 프로젝트는 독립 Git 저장소입니다. 변경사항을 올릴 때는 반드시 `ASAK-Kiosk` 폴더에서 커밋·push합니다. 상위 작업공간의 Git 구조는 [작업공간 안내](../README.md)를 참고합니다.

## 실행

```powershell
cd C:\ASAK-workspace\ASAK-kiosk
npm.cmd install
npm.cmd run dev
```

기본 개발 주소는 `http://localhost:5173`입니다.

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

## 화면 범위

`SCR-001`, `SCR-003~005`, `SCR-007`, `SCR-008`, `SCR-012`의 주문·결제 흐름만 구현합니다. 상세 업무 분담과 7/22 완료 기준은 [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)를 참고합니다.

## 구조

```text
src/
  apps/kiosk/  키오스크 화면과 라우트
  api/         키오스크 API 모듈
  store/       주문 초안·장바구니 상태
  mocks/       mock API fixture
```
