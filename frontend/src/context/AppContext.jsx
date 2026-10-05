import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL, TAX_PERCENT } from "../config";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = BACKEND_URL;

const GUEST_CART_KEY = "guestCart";

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || {};
  } catch {
    return {};
  }
};

const mergeCarts = (a = {}, b = {}) => {
  const merged = { ...a };
  for (const id in b) merged[id] = (merged[id] || 0) + b[id];
  return merged;
};

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [sellerChecked, setSellerChecked] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartItems, setCartItems] = useState(readGuestCart);
  const [searchQuery, setSearchQuery] = useState("");

  // ---------- auth ----------
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(!!data.success);
    } catch {
      setIsSeller(false);
    } finally {
      setSellerChecked(true);
    }
  };

  // Called after login/register/page load. Merges the guest cart into the
  // account's saved cart so nothing the shopper added is lost.
  const signIn = useCallback((userData) => {
    setUser({ name: userData.name, email: userData.email });
    setCartItems((guest) => mergeCarts(userData.cartItems, guest));
    localStorage.removeItem(GUEST_CART_KEY);
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) signIn(data.user);
    } catch {
      // 401 just means "not logged in" - not an error worth a toast
    } finally {
      setAuthChecked(true);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/user/logout");
    } catch {
      // cookie may already be gone, still log out locally
    }
    setUser(null);
    setCartItems({});
    navigate("/");
    toast.success("You have been logged out");
  };

  // ---------- products ----------
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Failed to load products:", error);
      const message = error.response
        ? `Server error (${error.response.status}) while loading products`
        : `Can't reach the server at ${BACKEND_URL}. Check that the backend is running and VITE_BACKEND_URL is correct.`;
      toast.error(message, { id: "products-error", duration: 6000 });
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- cart ----------
  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p._id, p])),
    [products]
  );

  const addToCart = (itemId) => {
    if (productMap[itemId] && !productMap[itemId].inStock) {
      return toast.error("This item is out of stock");
    }
    setCartItems((cart) => ({ ...cart, [itemId]: (cart[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((cart) => {
      const next = { ...cart };
      if (!next[itemId]) return cart;
      next[itemId] -= 1;
      if (next[itemId] <= 0) delete next[itemId];
      return next;
    });
  };

  const updateCartItem = (itemId, quantity) => {
    setCartItems((cart) => {
      const next = { ...cart };
      if (quantity <= 0) delete next[itemId];
      else next[itemId] = quantity;
      return next;
    });
  };

  const deleteFromCart = (itemId) => {
    setCartItems((cart) => {
      const next = { ...cart };
      delete next[itemId];
      return next;
    });
  };

  // cart lines that match a real product (deleted products are ignored)
  const cartDetails = useMemo(
    () =>
      Object.entries(cartItems)
        .map(([id, quantity]) => ({ product: productMap[id], quantity }))
        .filter((line) => line.product && line.quantity > 0),
    [cartItems, productMap]
  );

  const cartCount = () => cartDetails.reduce((sum, l) => sum + l.quantity, 0);

  const totalCartAmount = () =>
    Math.round(
      cartDetails.reduce((sum, l) => sum + l.product.offerPrice * l.quantity, 0) *
        100
    ) / 100;

  const taxAmount = () =>
    Math.round(((totalCartAmount() * TAX_PERCENT) / 100) * 100) / 100;

  // drop ids of products that no longer exist, once products are loaded
  useEffect(() => {
    if (productsLoading || products.length === 0) return;
    setCartItems((cart) => {
      const cleaned = Object.fromEntries(
        Object.entries(cart).filter(([id]) => productMap[id])
      );
      return Object.keys(cleaned).length === Object.keys(cart).length
        ? cart
        : cleaned;
    });
  }, [productsLoading, products, productMap]);

  // persist: guests -> localStorage, logged in users -> database (debounced)
  useEffect(() => {
    if (!user) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
      return;
    }
    const timer = setTimeout(() => {
      axios.post("/api/cart/update", { cartItems }).catch(() => {});
    }, 400);
    return () => clearTimeout(timer);
  }, [cartItems, user]);

  const value = {
    navigate,
    user,
    authChecked,
    signIn,
    logout,
    isSeller,
    setIsSeller,
    sellerChecked,
    showUserLogin,
    setShowUserLogin,
    products,
    productsLoading,
    fetchProducts,
    cartItems,
    setCartItems,
    cartDetails,
    addToCart,
    removeFromCart,
    updateCartItem,
    deleteFromCart,
    cartCount,
    totalCartAmount,
    taxAmount,
    searchQuery,
    setSearchQuery,
    axios,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
