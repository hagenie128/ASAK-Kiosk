/*
 * 역할:
 *   메뉴 상세 화면의 "아직 장바구니에 넣기 전" 초안 상태(수량·옵션 선택)를 한곳에서 관리한다.
 * 입력:
 *   - menuId, optionGroups (Page가 mock/API/Adapter에서 준비한 값)
 *   - cartItems (수량 제한 검사용, Store에서 읽은 목록)
 *   - 편집 모드: add | edit (edit면 cartItemId와 기존 선택값)
 * 출력:
 *   - quantity, selectedOptions, selectedOptionItems
 *   - limitReason / toastMessage
 *   - isRequiredSatisfied
 *   - increase / decrease / selectOption 핸들러
 *   - buildCartPayload() 처럼 Store에 넘길 순수 데이터 조립 결과(구현은 학습자가)
 * 데이터 흐름:
 *   Page가 menu·optionGroups·mode를 넘김
 *   → 이 Hook이 draft 상태와 검증 결과 반환
 *   → Page가 priceCalculation / addItem|updateItem 호출
 *   → 하위 UI(Summary, OptionGroup, Footer)는 표시와 사건 알림만
 * 이 파일에서 하지 않을 일:
 *   - JSX 렌더, CSS, navigate
 *   - priceCalculation 결과 캐시 정책(표시 금액은 Page에서 util 호출 권장)
 *   - API 호출, TTS, Timeout
 *   - Store에 직접 write (Page가 add/update를 호출하게 둔다)
 * 구현 순서:
 *   1) add 모드: 기본 옵션·quantity=1 초기화
 *   2) 수량 +/- 와 quantityLimits 연동
 *   3) SINGLE/MULTI 선택 토글
 *   4) 필수 옵션 충족 검사
 *   5) edit 모드: 기존 cartItem 값으로 hydrate, update 경로만 허용
 * 주의할 정책:
 *   - 수량 0 금지, 1일 때 Minus disabled
 *   - 동일 menuId 최대 9, 전체 Cart 최대 30
 *   - 직원 문의 문구는 30 초과 시도에만 (MENU_LIMIT 문구와 분리)
 *   - edit 흐름에서 addItem 금지, 수량·주문방식 의도치 않은 초기화 금지
 */

// TODO 1: 함수 signature를 정한다. (menuId, optionGroups, items, mode, editingCartItem)
// 이 단계에서 확인할 값: Page에서 넘길 수 있는 props가 무엇인지
// 완료 조건: MenuDetailPage useState 여러 개가 이 Hook 호출 하나로 대체될 수 있는 형태

// TODO 2: selectedOptions 초기값을 optionGroups의 isDefault로 만든다.
// 이 단계에서 확인할 값: SINGLE은 값, MULTI는 배열
// 완료 조건: 기본 옵션이 있는 그룹은 첫 렌더부터 선택되어 있다

// TODO 3: canIncreaseQuantity / canIncreaseCartItemQuantity 호출 위치를 여기로 모은다.
// 이 단계에서 확인할 값: reason이 MENU_LIMIT 인지 CART_LIMIT 인지
// 완료 조건: UI는 reason→문구 매핑만 하고, 제한 숫자는 quantityLimits.js만 안다

// TODO 4: edit 모드일 때 buildUpdatePayload(cartItemId)와 add 모드 buildAddPayload()를 나눈다.
// 이 단계에서 확인할 값: mode, cartItemId
// 완료 조건: edit에서 새 UUID로 addItem 하는 경로가 없다

export function useMenuDetailDraft(/* args */) {
  // 학습자 구현 위치 — 완성 코드 없음
  throw new Error("useMenuDetailDraft: 아직 구현하지 않았습니다. TODO를 순서대로 작성하세요.");
}
