import { useParams } from "react-router-dom";

// SCR-010 관리자 주문 상세
export default function OrderDetailPage() {
  const { orderId } = useParams();
  return (
    <section>
      <h1>주문 상세 #{orderId}</h1>
      <p>TODO</p>
    </section>
  );
}
