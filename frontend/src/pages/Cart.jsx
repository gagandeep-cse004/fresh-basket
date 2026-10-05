import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { imageUrl, money, TAX_PERCENT } from "../config";
import QuantityStepper from "../components/ui/QuantityStepper";
import EmptyState from "../components/ui/EmptyState";
import Icon from "../components/ui/Icon";
import { Skeleton } from "../components/ui/Skeleton";

const Cart = () => {
  const {
    productsLoading,
    cartDetails,
    cartCount,
    totalCartAmount,
    taxAmount,
    addToCart,
    removeFromCart,
    deleteFromCart,
    setCartItems,
    axios,
    user,
    setShowUserLogin,
    navigate,
  } = useAppContext();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [placing, setPlacing] = useState(false);

  const subtotal = totalCartAmount();
  const tax = taxAmount();
  const total = Math.round((subtotal + tax) * 100) / 100;
  const hasUnavailable = cartDetails.some((l) => !l.product.inStock);

  useEffect(() => {
    if (!user) return setAddresses([]);
    (async () => {
      try {
        const { data } = await axios.get("/api/address/get");
        if (data.success) {
          setAddresses(data.addresses);
          setSelectedId((id) => id || data.addresses[0]?._id || null);
        }
      } catch {
        toast.error("Couldn't load your saved addresses");
      }
    })();
  }, [user, axios]);

  const removeAddress = async (id) => {
    try {
      await axios.post("/api/address/delete", { id });
      setAddresses((list) => list.filter((a) => a._id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch {
      toast.error("Couldn't remove that address");
    }
  };

  const placeOrder = async () => {
    if (!user) return setShowUserLogin(true);
    if (!selectedId) return toast.error("Please choose a delivery address");
    if (hasUnavailable)
      return toast.error("Remove out-of-stock items to continue");
    setPlacing(true);
    try {
      const { data } = await axios.post("/api/order/cod", {
        items: cartDetails.map((l) => ({
          product: l.product._id,
          quantity: l.quantity,
        })),
        address: selectedId,
      });
      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        navigate("/my-orders");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't place your order");
    } finally {
      setPlacing(false);
    }
  };

  if (productsLoading) return <Skeleton className="mt-8 h-96 w-full" />;

  if (cartDetails.length === 0) {
    return (
      <EmptyState
        icon="cart"
        title="Your cart is empty"
        text="Add some fresh groceries and they'll show up here."
      >
        <Link to="/products" className="btn-primary">
          Start shopping
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="mt-6 md:mt-8">
      <h1 className="text-3xl font-bold">
        Your cart{" "}
        <span className="text-base font-medium text-muted">
          ({cartCount()} {cartCount() === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <ul className="card divide-y divide-line">
          {cartDetails.map(({ product, quantity }) => (
            <li key={product._id} className="flex gap-4 p-4">
              <Link
                to={`/product/${product.category.toLowerCase()}/${product._id}`}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-paper p-2 sm:h-24 sm:w-24"
              >
                <img
                  src={imageUrl(product.image[0])}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/product/${product.category.toLowerCase()}/${product._id}`}
                      className="line-clamp-2 font-semibold hover:text-brand"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted">{money(product.offerPrice)} each</p>
                    {!product.inStock && (
                      <p className="mt-1 text-sm font-medium text-sale">
                        Out of stock. Remove it to check out.
                      </p>
                    )}
                  </div>
                  <p className="font-bold">{money(product.offerPrice * quantity)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    quantity={quantity}
                    name={product.name}
                    onAdd={() => addToCart(product._id)}
                    onRemove={() => removeFromCart(product._id)}
                  />
                  <button
                    onClick={() => deleteFromCart(product._id)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-sale/10 hover:text-sale"
                  >
                    <Icon name="trash" size={16} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card p-5 lg:sticky lg:top-40">
          <h2 className="text-xl font-bold">Order summary</h2>

          <div className="mt-5">
            <p className="text-sm font-semibold">Delivery address</p>
            {!user ? (
              <p className="mt-2 text-sm text-muted">
                Log in to choose where we deliver.
              </p>
            ) : addresses.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No saved address yet.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {addresses.map((a) => (
                  <label
                    key={a._id}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-sm transition ${
                      selectedId === a._id
                        ? "border-brand bg-brand-soft/60"
                        : "border-line hover:border-brand/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedId === a._id}
                      onChange={() => setSelectedId(a._id)}
                      className="mt-1 accent-brand"
                    />
                    <span className="flex-1">
                      <span className="block font-semibold">
                        {a.firstName} {a.lastName}
                      </span>
                      <span className="block text-muted">
                        {a.street}, {a.city}, {a.state} {a.zipCode}, {a.country}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeAddress(a._id);
                      }}
                      aria-label="Remove address"
                      className="rounded p-1 text-muted hover:text-sale"
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </label>
                ))}
              </div>
            )}
            {user && (
              <Link
                to="/add-address"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                <Icon name="plus" size={15} /> Add a new address
              </Link>
            )}
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">Payment</p>
            <div className="mt-2 space-y-2 text-sm">
              <label className="flex items-center gap-3 rounded-lg border border-brand bg-brand-soft/60 p-3">
                <input type="radio" checked readOnly className="accent-brand" />
                Cash on delivery
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-line p-3 text-muted opacity-70">
                <input type="radio" disabled />
                Online payment <span className="ml-auto text-xs">Coming soon</span>
              </div>
            </div>
          </div>

          <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Items</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-medium text-brand">Free</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Tax ({TAX_PERCENT}%)</dt>
              <dd>{money(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
              <dt>Total</dt>
              <dd>{money(total)}</dd>
            </div>
          </dl>

          <button
            onClick={placeOrder}
            disabled={placing}
            className="btn-primary mt-5 w-full py-3!"
          >
            {placing ? "Placing order…" : user ? "Place order" : "Log in to place order"}
          </button>
          <Link
            to="/products"
            className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            <Icon name="arrowLeft" size={16} /> Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};
export default Cart;
