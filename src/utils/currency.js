// 학습용 자리표시자: 금액을 원화 문자열로 표시하는 함수를 둡니다.

//1) 금액 포맷 유틸 (규칙 반영- 필요시 호출로 사용)
export function formatCurrency(amount) {
  return `${amount.toLocaleString()}원`;
}
