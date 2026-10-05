import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { imageUrl, money } from "../config";
import RequireLogin from "../components/RequireLogin";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";

export const statusStyle = {
  "Order Placed": "bg-sun/25 text-[#8a5a00]",
  Packed: "bg-blue-100 text-blue-800",
  "Out for Delivery": "bg-purple-100 text-purple-800",
  Delivered: "bg-brand-soft text-brand",
  Cancelled: "bg-sale/10 text-sale",
};

const OrdersList = () => {
  const [orders, setOrders] = useState(null);
  const { axios } = useAppContext();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) setOrders(data.orders);
    } catch {
      toast.error("Couldn't load your orders");
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const { data } = await axios.post("/api/order/cancel", { id });
      toast.success(data.message);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't cancel the order");
    }
  };

  if (!orders) return <Skeleton className="mt-8 h-64 w-full" />;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No orders yet"
        text="When you place an order, you can track it here."
      >
        <Link to="/products" className="btn-primary">
          Start shopping
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="mt-6 max-w-4xl space-y-5 md:mt-8">
      <h1 className="text-3xl font-bold">My orders</h1>
      {orders.map((order) => (
        <article key={order._id} className="card overflow-hidden">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-5 py-3 text-sm">
            <div>
              <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
              <p className="text-muted">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                · {order.paymentType === "COD" ? "Cash on delivery" : order.paymentType}
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
              <p className="text-base font-bold">{money(order.amount)}</p>
            </div>
          </header>

          <ul className="divide-y divide-line">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-paper p-1.5">
                  {item.product?.image?.[0] && (
                    <img
                      src={imageUrl(item.product.image[0])}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {item.product?.name || "Product no longer available"}
                  </p>
                  <p className="text-sm text-muted">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">
                  {money((item.price ?? item.product?.offerPrice ?? 0) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3 text-sm text-muted">
            <p>
              Delivering to {order.address?.firstName} {order.address?.lastName},{" "}
              {order.address?.city}
            </p>
            {order.status === "Order Placed" && (
              <button
                onClick={() => cancel(order._id)}
                className="font-semibold text-sale hover:underline"
              >
                Cancel order
              </button>
            )}
          </footer>
        </article>
      ))}
    </div>
  );
};

const MyOrders = () => (
  <RequireLogin title="Log in to see your orders">
    <OrdersList />
  </RequireLogin>
);
export default MyOrders;
