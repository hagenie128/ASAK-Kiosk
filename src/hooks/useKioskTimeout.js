/*
 * 역할: 무응답 타이머로 세션 초기화 시점을 Page/Layout에 알린다.
 * 입력: idleMs, enabled(또는 isProcessing), onTimeout 콜백
 * 출력: 타이머 리셋 함수, (선택) 남은 시간
 * 하지 말 것: 결제 API 호출, TTS, 가격 계산, 개별 화면 JSX
 *
 * 정책 힌트:
 * - Processing(결제 처리 중)에는 Timeout을 비활성화한다.
 * - 타임아웃 시 resetSession으로 개인·주문 초안을 지운다.
 *
 * TODO 1: enabled=false 이면 interval/timeout을 걸지 않는다
 * TODO 2: 사용자 입력마다 타이머를 리셋하는 방법을 Page와 합의한다
 * TODO 3: Payment Processing 플래그와 enabled를 연결한다
 */
