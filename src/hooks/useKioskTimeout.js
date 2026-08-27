/*
 * 무응답 타이머 (WBS2-029~030) 

  자동타임아웃 로직 구현

  사용자 입력 감지, 30초 타이머, 팝업 10초 카운트다운, dismissTimeout()

 */

import React, { useCallback, useEffect, useRef, useState } from 'react'


// onExpired : 팝업의 10초가 모두 지났을 때 Hook이 실행해 달라고 요청하는 함수
export function useKioskTimeout({
  enable = true,
  idleMs = 30000,
  modalMs = 10000,
  onExpired,
}) {
  const [isTimeoutOpen, setIsTimeoutOpen] = useState(false); //팝업의 열림/닫힘 상태
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.ceil(modalMs / 1000),
  ); //팝업 열리고 자동 초기화되는 초 단위 숫자

  const idleTimerRef = useRef(null); //30초 무응답 타이머 ID
  const modalTimerRef = useRef(null); // 팝업의 10초 자동 초기화 타이머 ID
  const countdownTimerRef = useRef(null); // 1초씩 시간 감소 표시
  const onExpiredRef = useRef(onExpired); //최신 onExpired 함수

  useEffect(() => {
    onExpiredRef.current = onExpired;
  }, [onExpired]);

  //30초 자동 타이머 지우는 함수
  const clearIdleTimer = useCallback(() => {
    clearTimer(idleTimerRef.current);
    idleTimerRef.current = null;
  }, []);

  //모달 표시 타이머 지우는 함수
  const clearModalTimers = useCallback(() => {
    clearTimer(modalTimerRef.current);
    clearInterval(countdownTimerRef.current);
    modalTimerRef.current = null;
    countdownTimerRef.current = null;
  }, []);

  const openTimeoutModal = useCallback(() => {
    clearIdleTimer();
    setRemainingSeconds(Math.ceil(modalMs / 1000));
    setIsTimeoutOpen(true);
  }, [clearIdleTimer, modalMs]);

  const startIdleTimer = useCallback(() => {
    clearIdleTimer();

    if (!enable) return;

    idleTimerRef.current = setTimeout(openTimeoutModal, idleMs);
  }, [clearIdleTimer, enable, openTimeoutModal, idleMs]);

  // 일반 화면에서 사용자 입력이 있으면 30초를 다시 측정

  useEffect(() => {
    if (!enable || isTimeoutOpen) {
      clearIdleTimer();
      return;
    }

    const handleActivity = () => {
      startIdleTimer();
    };

    startIdleTimer();

    window.addEventListener("pointerdown", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      clearIdleTimer();
      window.addEventListener("pointerdown", handleActivity);
      window.addEventListener("keydown", handleActivity);
    };
  }, [clearIdleTimer, enable, isTimeoutOpen, startIdleTimer]);

  //팝업이 열린 뒤 10초 동안 카운트다운하고, 끝나면 부모에 초기화를 요청
  useEffect(() => {
    //isTimeoutOpen : true -> 팝업 닫힘 / false -> 팝업 열림
    if (!isTimeoutOpen) return;

    modalTimerRef.current = setTimeout(() => {
      setIsTimeoutOpen(false);
      onExpiredRef.current?.();
    }, modalMs);

    countdownTimerRef.current = setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return clearModalTimers;
  }, [clearModalTimers, isTimeoutOpen, modalMs]);

  // [확인]: 팝업만 닫고, 다음 렌더에서 30초 타이머를 새로 시작한다.
  const dismissTimeout = useCallback(() => {
    clearModalTimers();
    setIsTimeoutOpen(false);
  }, [clearModalTimers]);

  // PaymentProcessingPage 진입 또는 컴포넌트 해제 시 모든 타이머를 정리한다.
  useEffect(() => {
    if (enable) return;

    clearIdleTimer();
    clearModalTimers();
    setIsTimeoutOpen(false);
  }, [clearIdleTimer, clearModalTimers, enable]);

    return {
    isTimeoutOpen,
    remainingSeconds,
    dismissTimeout,
  };
}

