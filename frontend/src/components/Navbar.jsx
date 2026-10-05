import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";
import { STORE_NAME } from "../config";
import Icon from "./ui/Icon";

export const Logo = ({ light = false }) => (
  <span className="flex items-center gap-2">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
      <Icon name="leaf" size={20} />
    </span>
    <span
      className={`font-display text-xl font-bold tracking-tight ${
        light ? "text-white" : "text-ink"
      }`}
    >
      {STORE_NAME}
    </span>
  </span>
);

const SearchBox = ({ autoFocus = false, onDone }) => {
  const { searchQuery, setSearchQuery, navigate } = useAppContext();
  const { pathname } = useLocation();

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    if (pathname !== "/products") navigate("/products");
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (pathname !== "/products") navigate("/products");
        onDone?.();
      }}
      className="relative w-full"
    >
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <Icon
        name="search"
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        id="site-search"
        autoFocus={autoFocus}
        value={searchQuery}
        onChange={handleChange}
        type="search"
        placeholder="Search for apples, milk, rice…"
        className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </form>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { pathname } = useLocation();
  const { user, logout, setShowUserLogin, cartCount } = useAppContext();
  const count = cartCount();

  // close menus on navigation
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // close account menu on outside click / Escape
  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target))
        setAccountOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setAccountOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
      isActive ? "bg-brand text-white" : "text-ink hover:bg-brand-soft"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="-ml-2 rounded-lg p-2 hover:bg-brand-soft lg:hidden"
        >
          <Icon name="menu" size={22} />
        </button>

        <Link to="/" aria-label={`${STORE_NAME} home`}>
          <Logo />
        </Link>

        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <SearchBox />
        </div>

        <nav className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold transition hover:border-brand hover:text-brand"
            aria-label={`Cart, ${count} items`}
          >
            <Icon name="cart" size={20} />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((o) => !o)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full bg-brand-soft py-1.5 pl-1.5 pr-3 text-sm font-semibold text-brand"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="hidden max-w-24 truncate sm:inline">
                  {user.name?.split(" ")[0]}
                </span>
                <Icon name="chevronDown" size={14} />
              </button>
              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-white py-1 text-sm shadow-lg"
                >
                  <p className="truncate border-b border-line px-4 py-2.5 text-xs text-muted">
                    {user.email}
                  </p>
                  <Link
                    role="menuitem"
                    to="/my-orders"
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-brand-soft"
                  >
                    <Icon name="package" size={16} /> My orders
                  </Link>
                  <button
                    role="menuitem"
                    onClick={logout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sale hover:bg-sale/10"
                  >
                    <Icon name="logout" size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowUserLogin(true)} className="btn-primary py-2!">
              Log in
            </button>
          )}
        </nav>
      </div>

      {/* mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <SearchBox />
      </div>

      {/* aisle strip (desktop) */}
      <div className="hidden border-t border-line lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-8 py-2">
          <NavLink to="/products" end className={linkClass}>
            All products
          </NavLink>
          {categories.map((c) => (
            <NavLink
              key={c.path}
              to={`/products/${c.path.toLowerCase()}`}
              className={linkClass}
            >
              {c.path}
            </NavLink>
          ))}
        </div>
      </div>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 hover:bg-brand-soft"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/products" end className={linkClass}>
                All products
              </NavLink>
              <p className="mt-4 px-3.5 text-xs font-semibold text-muted">Shop by aisle</p>
              {categories.map((c) => (
                <NavLink
                  key={c.path}
                  to={`/products/${c.path.toLowerCase()}`}
                  className={linkClass}
                >
                  {c.text}
                </NavLink>
              ))}
              {user && (
                <NavLink to="/my-orders" className={linkClass}>
                  My orders
                </NavLink>
              )}
            </nav>
            {user ? (
              <button onClick={logout} className="btn-outline mt-4">
                <Icon name="logout" size={16} /> Log out
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowUserLogin(true);
                }}
                className="btn-primary mt-4"
              >
                Log in or sign up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
