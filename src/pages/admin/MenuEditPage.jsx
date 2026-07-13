import { useParams } from "react-router-dom";

// SCR-017 관리자 메뉴 등록/수정
export default function MenuEditPage() {
  const { menuId } = useParams();
  return (
    <section>
      <h1>{menuId ? `메뉴 수정 #${menuId}` : "메뉴 등록"}</h1>
      <p>TODO</p>
    </section>
  );
}
