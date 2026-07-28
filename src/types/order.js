/**
 * 키오스크 주문·완료 DTO / view 필드 (WBS2-028)
 *
 * cart item: menuId, menuName, unitPrice, quantity,
 *            optionItems[{ optionItemId, name, extraPrice, quantity }],
 *            excludedIngredientIds[], cartItemId?
 * order: orderId, orderNo, orderType, totalAmount, orderStatus, paymentStatus
 * complete sample: orderNo, totalAmount, waitingOrderCount, orderType
 * 표: public/mocks/README.md §3~4
 */
