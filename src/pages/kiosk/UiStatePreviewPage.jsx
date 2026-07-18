import { useParams } from "react-router-dom";

const screenLabels = {
  home: "홈",
  menu: "메뉴 목록",
  detail: "메뉴 상세",
  cart: "장바구니",
  payment: "결제",
  timeout: "주문 시간 만료",
  accessibility: "접근성 설정",
};

const stateCopy = {
  loading: ["불러오는 중입니다", "데이터 연결 전 정적 로딩 화면입니다."],
  empty: ["표시할 내용이 없습니다", "조건에 맞는 항목이 없을 때의 화면입니다."],
  error: ["화면을 불러오지 못했습니다", "재시도 동작은 기능 구현 시 연결합니다."],
  confirm: ["변경 사항을 확인해주세요", "확인과 취소 동작은 아직 연결하지 않았습니다."],
  progress: ["처리 중입니다", "중복 요청을 막는 상태 전환은 기능 구현 범위입니다."],
  success: ["변경 사항이 반영되었습니다", "정적 성공 안내 화면입니다."],
  selection: ["선택 상태 미리보기", "선택값과 판매 상태는 실제 데이터 연결 후 표시됩니다."],
  info: ["상태 화면 미리보기", "Figma 상태별 UI 구조를 확인하는 전용 화면입니다."],
};

function getTone(state) {
  if (/loading|processing|saving|retry/i.test(state)) return "progress";
  if (/empty/i.test(state)) return "empty";
  if (/error|failure|declined/i.test(state)) return "error";
  if (/confirm/i.test(state)) return "confirm";
  if (/toast|success|changed|added|deleted/i.test(state)) return "success";
  if (/selected|expanded|sold-out|disabled/i.test(state)) return "selection";
  return "info";
}

export default function UiStatePreviewPage() {
  const { screen = "menu", state = "loading" } = useParams();
  const tone = getTone(state);
  const [title, description] = stateCopy[tone];

  return (
    <main className="kiosk-state-preview">
      <header><span>ASAK</span><small>UI Preview · SCR 상태 화면</small></header>
      <section className="kiosk-state-preview__stage">
        <p>{screenLabels[screen] ?? screen}</p>
        <article className={`kiosk-state-card kiosk-state-card--${tone}`}>
          <span className="kiosk-state-card__mark" aria-hidden="true" />
          <h1>{title}</h1>
          <p>{description}</p>
          <code>{state}</code>
          {tone === "confirm" && <div className="kiosk-state-card__actions"><button disabled>취소</button><button disabled>확인</button></div>}
        </article>
      </section>
    </main>
  );
}
