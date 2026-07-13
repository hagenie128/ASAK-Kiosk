// Figma symbol "menu_list_footer" / "menu_detail_footer" 대응.
// 화면마다 하단 CTA 버튼 문구/동작이 다르므로 children으로 받는다.
export default function Footer({ children }) {
  return <footer className="kiosk-footer">{children}</footer>;
}
