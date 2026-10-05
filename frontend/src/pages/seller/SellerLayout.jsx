import { Link, NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import Icon from "../../components/ui/Icon";
import { Logo } from "../../components/Navbar";

const sidebarLinks = [
  { name: "Add product", path: "/seller", icon: "plus" },
  { name: "Products", path: "/seller/product-list", icon: "list" },
  { name: "Orders", path: "/seller/orders", icon: "package" },
];

const SellerLayout = () => {
  const { setIsSeller, axios, navigate } = useAppContext();

  const logout = async () => {
    try {
      await axios.get("/api/seller/logout");
    } catch {
      // cookie may already have expired; log out locally anyway
    }
    setIsSeller(false);
    toast.success("Logged out");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
      isActive ? "bg-brand text-white" : "text-ink hover:bg-brand-soft"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3 md:px-8">
        <Link to="/" aria-label="Back to store">
          <Logo />
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted sm:inline">Seller dashboard</span>
          <button onClick={logout} className="btn-outline py-1.5!">
            <Icon name="logout" size={16} /> Log out
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <nav className="flex gap-2 overflow-x-auto border-b border-line bg-white p-3 md:w-60 md:flex-col md:border-b-0 md:border-r md:p-4">
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/seller"}
              className={linkClass}
            >
              <Icon name={item.icon} size={18} />
              <span className="whitespace-nowrap">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default SellerLayout;
