// 금액 계산만 하는 유틸 함수

//(메뉴 기본 가격 + 선택 옵션 추가 가격 합계) × 수량
export function priceCalculation({
  unitPrice = 0,
  optionItems = [],
  quantity = 1,
}) {
  const optionExtraSum = optionItems.reduce(
    (sum, opt) => sum + Number(opt.extraPrice ?? 0),
    0,
  );
  return (Number(unitPrice ?? 0) + optionExtraSum) * Number(quantity ?? 0);
}
