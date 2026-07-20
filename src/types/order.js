/**
 * 키오스크 주문·완료 DTO / view 필드 (WBS2-028)
 *
 * cart item: menuId, menuName, unitPrice, quantity,
 *            optionItems[{ optionItemId, name, extraPrice, quantity }],
 *            excludedIngredientIds[], cartItemId?
 * order: orderId, orderNo, orderType, totalPrice, orderStatus, paymentStatus
 * complete sample: orderNo, totalPrice, waitingCount, orderType
 * 정본: totalAmount, waitingOrderCount — adapter에서 매핑
 * 표: public/mocks/README.md §3~4
 */
