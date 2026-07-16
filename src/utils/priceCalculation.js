// 금액 계산만 하는 유틸 함수

export function priceCalculation({ unitPrice, optionItems, quantity }) {

    const optionExtraSum = optionItems.reduce((sum, opt) => sum + opt.extraPrice, 0);
    return (unitPrice + optionExtraSum) * quantity;

}

