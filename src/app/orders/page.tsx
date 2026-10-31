import { OrdersClient } from "@/app/orders/OrdersClient";

export const metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
