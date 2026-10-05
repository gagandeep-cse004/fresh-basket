import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import Icon from "./ui/Icon";

const Banner = () => (
  <section className="relative mt-5 overflow-hidden rounded-2xl bg-[#d9f2e6]">
    <img
      src={assets.main_banner_bg}
      alt=""
      className="hidden h-full min-h-[360px] w-full object-cover object-right md:block"
    />
    <img
      src={assets.main_banner_bg_sm}
      alt=""
      className="h-[420px] w-full object-cover object-bottom md:hidden"
    />
    <div className="absolute inset-0 flex flex-col justify-start px-6 pt-10 md:justify-center md:px-14 md:pt-0">
      <h1 className="max-w-md text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
        Fresh groceries, at your door in 30 minutes.
      </h1>
      <p className="mt-4 max-w-sm text-base text-ink/75 md:text-lg">
        Vegetables, fruit, dairy and pantry staples, picked today and priced fairly.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link to="/products" className="btn-primary px-7 py-3!">
          Start shopping
          <Icon name="arrowRight" size={18} />
        </Link>
        <Link
          to="/products/vegetables"
          className="btn-outline bg-white/80 px-7 py-3!"
        >
          Fresh vegetables
        </Link>
      </div>
    </div>
  </section>
);
export default Banner;
