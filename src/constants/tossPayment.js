/**
 *  ASAK 결제수단 코드 → 토스페이먼츠 간편결제 코드
 */
export const TOSS_EASY_PAY_CODE = Object.freeze({
  TOSS_PAY: "TOSSPAY",
  KAKAO_PAY: "KAKAOPAY",
  NAVER_PAY: "NAVERPAY",
});

export const isTossEasyPayMethod = (methodCode) =>
  Object.hasOwn(TOSS_EASY_PAY_CODE, methodCode);
