import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ProductGrid from "./ProductGrid";
import { ProductGridSkeleton } from "./ui/Skeleton";

// Shows the most recently added products that are in stock
const BestSeller = () => {
  const { products, productsLoading } = useAppContext();
  const items = products.filter((p) => p.inStock).slice(0, 10);

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">Fresh on the shelves</h2>
        <Link to="/products" className="text-sm font-semibold text-brand hover:underline">
          See everything
        </Link>
      </div>
      <div className="mt-5">
        {productsLoading ? (
          <ProductGridSkeleton count={5} />
        ) : items.length > 0 ? (
          <ProductGrid products={items} />
        ) : (
          <p className="card p-8 text-center text-muted">
            No products yet. Add some from the seller dashboard at /seller.
          </p>
        )}
      </div>
    </section>
  );
};
export default BestSeller;
