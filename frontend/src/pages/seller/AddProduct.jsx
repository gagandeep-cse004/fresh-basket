import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { categories, assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const AddProduct = () => {
  const { axios, fetchProducts } = useAppContext();
  const [files, setFiles] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [saving, setSaving] = useState(false);

  // create preview URLs once per file, and free them afterwards
  const previews = useMemo(
    () => files.map((f) => (f ? URL.createObjectURL(f) : null)),
    [files]
  );
  useEffect(
    () => () => previews.forEach((url) => url && URL.revokeObjectURL(url)),
    [previews]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chosen = files.filter(Boolean);
    if (chosen.length === 0) return toast.error("Add at least one product image");
    if (!category) return toast.error("Choose a category");
    if (Number(offerPrice) > Number(price))
      return toast.error("Offer price can't be higher than the product price");

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      chosen.forEach((file) => formData.append("image", file));

      const { data } = await axios.post("/api/product/add-product", formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([null, null, null, null]);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't add the product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Add a product</h1>
      <form onSubmit={handleSubmit} className="card mt-5 space-y-5 p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium">Images (up to 4, max 4 MB each)</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {files.map((file, index) => (
              <label
                key={index}
                htmlFor={`image${index}`}
                className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-paper hover:border-brand"
              >
                <input
                  id={`image${index}`}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const picked = e.target.files[0];
                    if (!picked) return;
                    if (picked.size > 4 * 1024 * 1024)
                      return toast.error("Image is larger than 4 MB");
                    setFiles((list) => list.map((f, i) => (i === index ? picked : f)));
                  }}
                />
                <img
                  src={previews[index] || assets.upload_area}
                  alt={file ? `Preview ${index + 1}` : "Upload image"}
                  className={previews[index] ? "h-full w-full object-cover" : "w-10 opacity-60"}
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="product-name" className="mb-1 block text-sm font-medium">
            Product name
          </label>
          <input
            id="product-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
            required
          />
        </div>

        <div>
          <label htmlFor="product-description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="field resize-none"
            placeholder={"Fresh and crisp\nSource of fibre\nStore in a cool place"}
            required
          />
          <p className="mt-1 text-xs text-muted">Each line becomes a bullet point.</p>
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="field"
            required
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option value={c.path} key={c.path}>
                {c.text}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="product-price" className="mb-1 block text-sm font-medium">
              Original price
            </label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="field"
              required
            />
          </div>
          <div>
            <label htmlFor="offer-price" className="mb-1 block text-sm font-medium">
              Selling price
            </label>
            <input
              id="offer-price"
              type="number"
              min="0"
              step="0.01"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="field"
              required
            />
          </div>
        </div>

        <button disabled={saving} className="btn-primary w-full py-3!">
          {saving ? "Adding…" : "Add product"}
        </button>
      </form>
    </div>
  );
};
export default AddProduct;
