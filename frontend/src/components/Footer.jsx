import { Link } from "react-router-dom";
import { categories } from "../assets/assets";
import { STORE_NAME } from "../config";
import { Logo } from "./Navbar";

const Footer = () => (
  <footer className="mt-16 bg-ink text-white/75">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
      <div>
        <Logo light />
        <p className="mt-4 max-w-sm text-sm leading-6">
          Everyday groceries from trusted growers and brands, packed carefully and
          delivered fast.
        </p>
      </div>
      <div>
        <p className="font-display text-base font-semibold text-white">Shop</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link to="/products" className="hover:text-white">
              All products
            </Link>
          </li>
          {categories.slice(0, 5).map((c) => (
            <li key={c.path}>
              <Link
                to={`/products/${c.path.toLowerCase()}`}
                className="hover:text-white"
              >
                {c.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-display text-base font-semibold text-white">Account</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link to="/cart" className="hover:text-white">
              Your cart
            </Link>
          </li>
          <li>
            <Link to="/my-orders" className="hover:text-white">
              My orders
            </Link>
          </li>
          <li>
            <Link to="/seller" className="hover:text-white">
              Seller dashboard
            </Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 py-5 text-center text-xs">
      © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
    </div>
  </footer>
);
export default Footer;
