/*
 * 무응답 타이머 (WBS2-029~030) 

   시간 정책값과 TIMEOUT 모달 설정

  사용자 입력 감지, 30초 타이머, 팝업 10초 카운트다운(무응답시 -> 초기화면 이동)

 */

import timeoutIcon from "@/assets/modal_icon/time_out_img.svg"


export const KIOSK_IDLE_MS = 30_000; //미작동시 30초
export const KIOSK_TIMEOUT_MODAL_MS = 10_000; //팝업 후 10초

export const KIOSK_TIMEOUT_MODAL = {
    icon: timeoutIcon,
    title: "시간 초과",
    content: (seconds) => `${seconds}초 후 초기 화면으로 돌아갑니다.`,
    leftText: null,
    rightText: "확인",
};
