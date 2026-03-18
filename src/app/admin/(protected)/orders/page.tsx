import OrdersManager from "@/components/admin/OrdersManager";

export const metadata = { title: "Orders | Admin" };

export default function OrdersPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-3xl font-serif font-bold text-forest">Orders</h1>
        <p className="text-warm-gray mt-1">Track tour bookings, revenue, and guest counts.</p>
      </div>
      <OrdersManager />
    </div>
  );
}
