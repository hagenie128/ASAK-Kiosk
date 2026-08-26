// 메뉴 1개 기준 칼로리: 기본 메뉴 + 선택 옵션. 장바구니에서는 수량까지 반영
export function calculateItemKcal({
  baseKcal = 0,
  optionItems = [],
  quantity = 1,
}) {
  const optionKcal = optionItems.reduce(
    (sum, option) =>
      sum + Number(option.kcal ?? 0) * Number(option.quantity ?? 1),
    0,
  );

  return (Number(baseKcal ?? 0) + optionKcal) * Number(quantity ?? 0);
}
