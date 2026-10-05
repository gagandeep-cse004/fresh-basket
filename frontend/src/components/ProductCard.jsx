import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { discountPercent, imageUrl, money } from "../config";
import QuantityStepper from "./ui/QuantityStepper";
import Icon from "./ui/Icon";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems } = useAppContext();
  if (!product) return null;

  const quantity = cartItems?.[product._id] || 0;
  const off = discountPercent(product.price, product.offerPrice);
  const link = `/product/${product.category.toLowerCase()}/${product._id}`;

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:border-brand/40 hover:shadow-md">
      <Link to={link} className="relative block bg-paper">
        <div className="flex aspect-square items-center justify-center p-4">
          <img
            src={imageUrl(product.image[0])}
            alt={product.name}
            loading="lazy"
            className={`max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105 ${
              product.inStock ? "" : "opacity-40 grayscale"
            }`}
          />
        </div>
        {off > 0 && product.inStock && (
          <span className="absolute left-2 top-2 rounded-md bg-sale px-2 py-0.5 text-xs font-bold text-white">
            {off}% off
          </span>
        )}
        {!product.inStock && (
          <span className="absolute left-2 top-2 rounded-md bg-ink px-2 py-0.5 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs text-muted">{product.category}</p>
        <Link
          to={link}
          className="mt-0.5 line-clamp-2 min-h-10 text-sm font-semibold leading-5 hover:text-brand sm:text-base sm:leading-5"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="leading-tight">
            <span className="text-base font-bold sm:text-lg">
              {money(product.offerPrice)}
            </span>
            {off > 0 && (
              <span className="block text-xs text-muted line-through">
                {money(product.price)}
              </span>
            )}
          </p>

          {!product.inStock ? null : quantity === 0 ? (
            <button
              type="button"
              onClick={() => addToCart(product._id)}
              aria-label={`Add ${product.name} to cart`}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-brand px-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
            >
              <Icon name="plus" size={16} />
              Add
            </button>
          ) : (
            <QuantityStepper
              quantity={quantity}
              name={product.name}
              onAdd={() => addToCart(product._id)}
              onRemove={() => removeFromCart(product._id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
