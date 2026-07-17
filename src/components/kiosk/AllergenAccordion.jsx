/*
 * 역할:
 *   메뉴 상세(SCR-004)에서 알레르기 정보를 접었다 펼치는 Accordion UI만 담당한다.
 * 입력:
 *   - allergens: 알레르기 표시용 문자열 또는 항목 목록 (Page/Adapter가 정리한 값)
 *   - defaultOpen: 최초 펼침 여부 (선택)
 *   - onToggle: 펼침/접힘 알림 (선택, 분석·접근성용)
 * 출력:
 *   - 화면에 Accordion UI를 그린다.
 *   - 펼침/접힘 사건만 상위에 알릴 수 있다.
 * 데이터 흐름:
 *   MenuDetailPage → (Adapter로 정리된 allergens) → AllergenAccordion → 사용자 토글
 * 이 파일에서 하지 않을 일:
 *   - 가격 계산, 수량 제한, 옵션 선택, 장바구니 저장, API 호출
 *   - 알레르기 원본 JSON 파싱(Adapter 책임)
 *   - Selected/CTA 색상 정책 결정(디자인 토큰·상위 레이아웃 책임)
 * 구현 순서:
 *   1) props 계약 확정 (allergens 형태)
 *   2) 접힘/펼침 로컬 UI 상태만 구현
 *   3) 키보드·aria 접근성
 *   4) MenuDetailPage 스크롤 영역 안에 배치
 * 주의할 정책:
 *   - Header와 BottomCTA 사이 스크롤 영역 안에만 둔다.
 *   - Lime은 Selected/Primary CTA에만 쓰므로 Accordion에 Lime 강조를 쓰지 않는다.
 */

import React from "react";

export default function AllergenAccordion(/* props */) {
  // TODO 1: allergens가 없거나 빈 배열일 때 렌더를 숨길지, Empty 문구를 보일지 결정한다.
  // 이 단계에서 확인할 값: allergens 길이, menuDetail에 알레르기 필드 존재 여부
  // 완료 조건: 데이터 없을 때 레이아웃이 깨지지 않는다.

  // TODO 2: 펼침/접힘 상태는 이 컴포넌트 로컬로 둔다. 장바구니·가격과 무관하기 때문이다.
  // 이 단계에서 확인할 값: isOpen, 버튼 aria-expanded
  // 완료 조건: 토글해도 selectedOptions / quantity / expectedPrice가 변하지 않는다.

  // TODO 3: 목록 표시만 한다. 문자열 join·필드 매핑은 Adapter에서 끝낸 뒤 받는다.
  // 이 단계에서 확인할 값: 항목 텍스트가 이미 화면용인지
  // 완료 조건: Accordion 안에서 raw API 필드를 직접 가공하지 않는다.

  return null;
}
