/*
 * 무응답 타이머 (WBS2-029~030) — Page/Layout에 타임아웃만 알린다.
 *
 * Props/인자 후보:
 *   idleMs          예: 30000 / 경고 20000 / 만료 10000
 *   enabled         false면 타이머 없음 — 결제 PROCESSING 중 false
 *   onTimeout       → TimeoutPage 표시 또는 모달
 *   onTick?(remain) 카운트다운 UI용
 *
 * 출력 후보: resetTimer()
 *
 * 하지 말 것: 결제 API, 가격 계산, TTS, JSX
 * 확정 시: orderSession.resetSession + orderFlow TIMEOUT_CONFIRMED
 * 표: public/mocks/README.md §5
 *
 * TODO: enabled=false 시 interval 미등록
 * TODO: 사용자 입력마다 resetTimer (Page와 합의)
 * TODO: Payment isPaying ↔ enabled 연결
 */
export function useKioskTimeout(_options = {}) {
  return {
    remainingMs: null,
    resetTimer: () => {},
  };
}
