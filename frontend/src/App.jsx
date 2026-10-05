import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Auth from "./modals/Auth";
import { useAppContext } from "./context/AppContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductCategory from "./pages/ProductCategory";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import SellerGate from "./pages/seller/SellerGate";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";

const App = () => {
  const isSellerPath = useLocation().pathname.startsWith("/seller");
  const { showUserLogin } = useAppContext();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{ style: { fontSize: "14px" }, duration: 2500 }}
      />
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Auth />}

      <main
        className={
          isSellerPath ? "flex-1" : "mx-auto w-full max-w-7xl flex-1 px-4 pb-4 sm:px-6 lg:px-8"
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/product/:category/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<Address />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/seller" element={<SellerGate />}>
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isSellerPath && <Footer />}
    </div>
  );
};
export default App;
