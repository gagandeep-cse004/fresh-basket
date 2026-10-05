import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import { ProductListing } from "./Products";

const ProductCategory = () => {
  const { category } = useParams();
  const current = categories.find((c) => c.path.toLowerCase() === category);
  return (
    <ProductListing title={current ? current.text : "Products"} category={category} />
  );
};
export default ProductCategory;
