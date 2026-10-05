import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { imageUrl, money } from "../../config";
import Icon from "../../components/ui/Icon";

const ProductList = () => {
  const { products, fetchProducts, axios, productsLoading } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        await fetchProducts();
        toast.success(inStock ? "Marked as in stock" : "Marked as out of stock");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't update stock");
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete “${product.name}”? This can't be undone.`)) return;
    try {
      const { data } = await axios.post("/api/product/delete", { id: product._id });
      if (data.success) {
        await fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't delete the product");
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">
        Products{" "}
        <span className="text-base font-medium text-muted">({products.length})</span>
      </h1>

      <div className="card mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold max-sm:hidden">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">In stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl(product.image[0])}
                      alt=""
                      className="h-12 w-12 rounded-lg border border-line bg-paper object-contain p-1"
                    />
                    <span className="max-w-48 truncate font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted max-sm:hidden">{product.category}</td>
                <td className="px-4 py-3 font-medium">{money(product.offerPrice)}</td>
                <td className="px-4 py-3">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={product.inStock}
                      onChange={() => toggleStock(product._id, !product.inStock)}
                      className="peer sr-only"
                      aria-label={`${product.name} in stock`}
                    />
                    <span className="h-6 w-11 rounded-full bg-line transition peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40" />
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                  </label>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => remove(product)}
                    aria-label={`Delete ${product.name}`}
                    className="rounded-lg p-2 text-muted hover:bg-sale/10 hover:text-sale"
                  >
                    <Icon name="trash" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!productsLoading && products.length === 0 && (
          <p className="p-8 text-center text-muted">No products yet. Add your first one.</p>
        )}
      </div>
    </div>
  );
};
export default ProductList;
