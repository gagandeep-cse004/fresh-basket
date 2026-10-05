import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
    {products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
);

export default ProductGrid;
