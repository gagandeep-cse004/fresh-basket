import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { imageUrl, money, ORDER_STATUSES } from "../../config";
import { statusStyle } from "../MyOrders";

const Stat = ({ label, value }) => (
  <div className="card p-4">
    <p className="text-sm text-muted">{label}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const { axios } = useAppContext();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) setOrders(data.orders);
    } catch {
      toast.error("Couldn't load orders");
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const list = orders || [];
    return {
      total: list.length,
      pending: list.filter((o) => o.status === "Order Placed").length,
      revenue: list
        .filter((o) => o.status !== "Cancelled")
        .reduce((sum, o) => sum + o.amount, 0),
    };
  }, [orders]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.post("/api/order/status", { id, status });
      toast.success(data.message);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't update the order");
    }
  };

  if (!orders) return <p className="text-muted">Loading orders…</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Total orders" value={stats.total} />
        <Stat label="New" value={stats.pending} />
        <Stat label="Revenue" value={money(stats.revenue)} />
      </div>

      {orders.length === 0 && (
        <p className="card mt-5 p-8 text-center text-muted">No orders yet.</p>
      )}

      <div className="mt-5 space-y-4">
        {orders.map((order) => (
          <article key={order._id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-muted">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyle[order.status] || "bg-line"
                  }`}
                >
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  aria-label="Update order status"
                  className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm outline-none focus:border-brand"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  {item.product?.image?.[0] && (
                    <img
                      src={imageUrl(item.product.image[0])}
                      alt=""
                      className="h-10 w-10 rounded border border-line bg-paper object-contain p-0.5"
                    />
                  )}
                  <span className="flex-1 truncate">
                    {item.product?.name || "Deleted product"}
                  </span>
                  <span className="text-muted">× {item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-line pt-4 text-sm">
              <div>
                <p className="font-medium">
                  {order.address?.firstName} {order.address?.lastName} ·{" "}
                  {order.address?.phone}
                </p>
                <p className="text-muted">
                  {order.address?.street}, {order.address?.city}, {order.address?.state}{" "}
                  {order.address?.zipCode}, {order.address?.country}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{money(order.amount)}</p>
                <p className="text-muted">
                  {order.paymentType} · {order.isPaid ? "Paid" : "Payment pending"}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
export default Orders;
