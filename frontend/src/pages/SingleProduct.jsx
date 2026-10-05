import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { discountPercent, imageUrl, money } from "../config";
import ProductGrid from "../components/ProductGrid";
import QuantityStepper from "../components/ui/QuantityStepper";
import EmptyState from "../components/ui/EmptyState";
import Icon from "../components/ui/Icon";
import { Skeleton } from "../components/ui/Skeleton";

const SingleProduct = () => {
  const { products, productsLoading, navigate, addToCart, removeFromCart, cartItems } =
    useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((p) => p._id === id);

  useEffect(() => {
    setThumbnail(product?.image?.[0] || null);
  }, [product]);

  if (productsLoading) {
    return (
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        icon="search"
        title="Product not found"
        text="It may have been removed from the store."
      >
        <Link to="/products" className="btn-primary">
          Browse products
        </Link>
      </EmptyState>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p._id !== product._id && p.inStock)
    .slice(0, 5);
  const quantity = cartItems?.[product._id] || 0;
  const off = discountPercent(product.price, product.offerPrice);
  const description = Array.isArray(product.description)
    ? product.description
    : [product.description];

  return (
    <div className="mt-6 md:mt-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <Icon name="chevronRight" size={14} />
        <Link to="/products" className="hover:text-brand">
          Products
        </Link>
        <Icon name="chevronRight" size={14} />
        <Link
          to={`/products/${product.category.toLowerCase()}`}
          className="hover:text-brand"
        >
          {product.category}
        </Link>
        <Icon name="chevronRight" size={14} />
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-14">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {product.image.length > 1 && (
            <div className="flex gap-3 sm:flex-col">
              {product.image.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setThumbnail(image)}
                  aria-label={`Show image ${index + 1}`}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white p-1 transition sm:h-20 sm:w-20 ${
                    thumbnail === image ? "border-brand ring-2 ring-brand/30" : "border-line"
                  }`}
                >
                  <img
                    src={imageUrl(image)}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
          <div className="flex aspect-square flex-1 items-center justify-center rounded-xl border border-line bg-white p-6">
            <img
              src={imageUrl(thumbnail)}
              alt={product.name}
              className={`max-h-full max-w-full object-contain ${
                product.inStock ? "" : "opacity-40 grayscale"
              }`}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-brand">{product.category}</p>
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">{product.name}</h1>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{money(product.offerPrice)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-muted line-through">
                  {money(product.price)}
                </span>
                <span className="rounded-md bg-sale px-2 py-0.5 text-sm font-bold text-white">
                  {off}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">Inclusive of all taxes</p>

          <p className="mt-6 font-semibold">About this product</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            {description.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {!product.inStock ? (
              <button disabled className="btn-outline w-full sm:w-auto sm:px-10 py-3!">
                Out of stock
              </button>
            ) : (
              <>
                {quantity === 0 ? (
                  <button
                    onClick={() => addToCart(product._id)}
                    className="btn-outline flex-1 py-3! sm:flex-none sm:px-10"
                  >
                    <Icon name="cart" size={18} /> Add to cart
                  </button>
                ) : (
                  <QuantityStepper
                    quantity={quantity}
                    name={product.name}
                    onAdd={() => addToCart(product._id)}
                    onRemove={() => removeFromCart(product._id)}
                  />
                )}
                <button
                  onClick={() => {
                    if (quantity === 0) addToCart(product._id);
                    navigate("/cart");
                  }}
                  className="btn-primary flex-1 py-3! sm:flex-none sm:px-10"
                >
                  Buy now
                </button>
              </>
            )}
          </div>

          <ul className="mt-8 grid gap-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Icon name="truck" size={18} className="text-brand" /> Free delivery on every order
            </li>
            <li className="flex items-center gap-2">
              <Icon name="shield" size={18} className="text-brand" /> Freshness guaranteed
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">More from {product.category}</h2>
          <div className="mt-5">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
};
export default SingleProduct;
