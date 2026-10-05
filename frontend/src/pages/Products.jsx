import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import ProductGrid from "../components/ProductGrid";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { discountPercent } from "../config";

const sorters = {
  newest: () => 0, // API already returns newest first
  "price-asc": (a, b) => a.offerPrice - b.offerPrice,
  "price-desc": (a, b) => b.offerPrice - a.offerPrice,
  discount: (a, b) =>
    discountPercent(b.price, b.offerPrice) - discountPercent(a.price, a.offerPrice),
};

// Shared by /products and /products/:category
export const ProductListing = ({ title, category }) => {
  const { products, productsLoading, searchQuery, setSearchQuery } = useAppContext();
  const [sort, setSort] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const list = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products
      .filter((p) => !category || p.category.toLowerCase() === category)
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .filter((p) => !inStockOnly || p.inStock)
      .sort(sorters[sort]);
  }, [products, category, searchQuery, inStockOnly, sort]);

  const chipClass = (active) =>
    `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
      active
        ? "border-brand bg-brand text-white"
        : "border-line bg-white hover:border-brand hover:text-brand"
    }`;

  return (
    <div className="mt-6 md:mt-8">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      {searchQuery && (
        <p className="mt-2 text-sm text-muted">
          Showing results for “{searchQuery}”{" "}
          <button
            onClick={() => setSearchQuery("")}
            className="font-semibold text-brand hover:underline"
          >
            Clear search
          </button>
        </p>
      )}

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <Link to="/products" className={chipClass(!category)}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.path}
            to={`/products/${c.path.toLowerCase()}`}
            className={chipClass(category === c.path.toLowerCase())}
          >
            {c.path}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {productsLoading ? "Loading…" : `${list.length} products`}
        </p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            In stock only
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-brand"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="discount">Biggest discount</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5">
        {productsLoading ? (
          <ProductGridSkeleton />
        ) : list.length > 0 ? (
          <ProductGrid products={list} />
        ) : (
          <EmptyState
            icon="search"
            title="No products found"
            text="Try a different word, or browse another aisle."
          >
            <button
              className="btn-primary"
              onClick={() => {
                setSearchQuery("");
                setInStockOnly(false);
              }}
            >
              Reset filters
            </button>
          </EmptyState>
        )}
      </div>
    </div>
  );
};

const Products = () => <ProductListing title="All products" />;
export default Products;
