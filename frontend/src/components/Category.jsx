import { Link } from "react-router-dom";
import { categories } from "../assets/assets";

const Category = () => (
  <section className="mt-14">
    <div className="flex items-end justify-between">
      <h2 className="text-2xl font-bold md:text-3xl">Shop by aisle</h2>
      <Link to="/products" className="text-sm font-semibold text-brand hover:underline">
        View all products
      </Link>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {categories.map((category) => (
        <Link
          key={category.path}
          to={`/products/${category.path.toLowerCase()}`}
          className="group flex flex-col items-center gap-3 rounded-xl p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md"
          style={{ backgroundColor: category.bgColor }}
        >
          <img
            src={category.image}
            alt=""
            className="h-20 w-20 object-contain transition group-hover:scale-110 sm:h-24 sm:w-24"
          />
          <span className="text-sm font-semibold">{category.text}</span>
        </Link>
      ))}
    </div>
  </section>
);
export default Category;
