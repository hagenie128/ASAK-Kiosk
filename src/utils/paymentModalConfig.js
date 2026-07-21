// 팝업별 환경 설정

import loadingIcon from "@/assets/modal_icon/payment_loading_icon_4.svg"
import failIcon from "@/assets/modal_icon/payment_fail_img.svg"
import timeoutIcon from "@/assets/modal_icon/time_out_img.svg"
import successIcon from "@/assets/modal_icon/success_icon.svg"


export const PAYMENT_MODAL_CONFIG = {

    // 1. 결제중 로딩
    PROCESSING: {
        icon: loadingIcon,
        title: "결제 진행중",
        content: "결제를 진행하고 있습니다.",
        leftText: null,
        rightText: null,
    },
    // 2. 결제 성공
    SUCCESS: {
        icon: successIcon,
        title: "결제 성공",
        content: "결제가 완료되었습니다.",
        leftText: null,
        rightText: "확인",
    },

    // 3. 결제 실패
    FAILED: {
        icon: failIcon,
        title: "결제 실패",
        content: "결제에 실패했습니다.",
        leftText: "취소",
        rightText: "다시 시도",
    },

    // 4. 타임 아웃
    TIMEOUT: {
        icon: timeoutIcon,
        title: "시간 초과",
        content: "초기 화면으로 돌아갑니다.",
        leftText: null,
        rightText: "확인",
    },


}
