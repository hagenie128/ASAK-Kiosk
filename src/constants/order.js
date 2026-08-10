/**
 * 주문 유형 상수
 * 프론트에서 API 요청에 사용할 수 있는 주문 유형 값을 정의한 파일
 * Payment/Complete 표시·요청 body에도 동일 값 유지
 */
export const ORDER_TYPE = Object.freeze({
  EAT_IN: "EAT_IN",
  TAKE_OUT: "TAKE_OUT",
});
