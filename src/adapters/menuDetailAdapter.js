/*
 * 역할:
 *   메뉴 상세에 필요한 API/mock 응답을 화면이 쓰기 쉬운 형태로만 변환한다.
 * 입력:
 *   - menuDetail 응답 (또는 mock.menuDetail[menuId].data)
 *   - menuOptions 응답 (또는 mock.menuOptions[menuId].data)
 * 출력:
 *   - 화면용 menu 요약 객체 (이름, 가격, 이미지, 설명, 알레르기 원천 필드 등)
 *   - 화면용 optionGroups 배열 (selectType, 필수, items, 품절 플래그 포함)
 *   - AllergenAccordion에 넘길 allergens 목록
 * 데이터 흐름:
 *   api/menu 또는 mock → menuDetailAdapter → Page/Hook → 하위 Component
 * 이 파일에서 하지 않을 일:
 *   - React 상태, JSX, 라우팅
 *   - 가격 합산(priceCalculation.js), 수량 제한(quantityLimits.js)
 *   - 장바구니 Store write
 *   - 품절 "정책 판단"의 단일 기준 구현(soldOutPolicy.js와 역할이 겹치면 안 됨)
 *     → 여기서는 필드를 화면 플래그로 "매핑"만 하고, 규칙 본문은 soldOutPolicy로 보낸다
 * 구현 순서:
 *   1) null/undefined 응답을 빈 구조로 안전하게 만든다
 *   2) optionGroup / optionItem 필드명을 화면 계약에 맞춘다
 *   3) allergens 배열을 Accordion용으로 정리한다
 *   4) Page에서 kioskMock 직접 깊숙이 파지하던 코드를 Adapter 호출로 바꾼다
 * 주의할 정책:
 *   - 서버가 가격 권한의 최종 기준이다. 화면 expectedPrice는 예상가다.
 *   - 핵심 재료 품절 → 메뉴 전체 품절, 일반 옵션 품절 → 해당 옵션만 disabled
 *   - Adapter가 UI 컴포넌트를 import 하지 않는다
 */

// TODO 1: toMenuDetailViewModel(rawMenuDetail) 작성
// 이 단계에서 확인할 값: menuId, name, price, imageUrl, description, allergen 관련 필드
// 완료 조건: Page가 raw.menuDetail[menuId].data 깊이를 몰라도 된다

// TODO 2: toOptionGroupsViewModel(rawOptionGroups) 작성
// 이 단계에서 확인할 값: selectType, isRequired, minSelect/maxSelect, items[].isSoldOut
// 완료 조건: OptionGroup/OptionItem이 필요로 하는 형태와 1:1로 맞는다

// TODO 3: toAllergensViewModel(rawMenuDetail) 작성
// 이 단계에서 확인할 값: 알레르기 필드가 문자열인지 배열인지
// 완료 조건: AllergenAccordion은 이미 정리된 목록만 받는다

// TODO 4: 품절 표시 플래그는 soldOutPolicy 결과를 받아 merge할지, Adapter 내부에서 호출할지 팀과 정한다.
// 이 단계에서 확인할 값: soldOutPolicy.js 함수 signature
// 완료 조건: 품절 규칙이 Adapter와 Policy에 중복 구현되지 않는다

export function toMenuDetailViewModel(/* raw */) {
  // 학습자 구현 위치 — 완성 코드 없음
  throw new Error("toMenuDetailViewModel: 아직 구현하지 않았습니다.");
}

export function toOptionGroupsViewModel(/* raw */) {
  throw new Error("toOptionGroupsViewModel: 아직 구현하지 않았습니다.");
}

export function toAllergensViewModel(/* raw */) {
  throw new Error("toAllergensViewModel: 아직 구현하지 않았습니다.");
}
