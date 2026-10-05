import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { Logo } from "../Navbar";

const SellerLogin = () => {
  const { setIsSeller, axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/seller/login", { email, password });
      if (data.success) {
        setIsSeller(true);
        toast.success("Welcome to your dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Can't reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-7 shadow-lg">
        <Logo />
        <h1 className="mt-5 text-2xl font-bold">Seller login</h1>
        <p className="mt-1 text-sm text-muted">Manage products and orders.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="seller-email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="seller-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="seller-password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="seller-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        <button disabled={loading} className="btn-primary mt-6 w-full py-3!">
          {loading ? "Logging in…" : "Log in"}
        </button>
        <Link
          to="/"
          className="mt-4 block text-center text-sm font-semibold text-brand hover:underline"
        >
          Back to store
        </Link>
      </form>
    </div>
  );
};
export default SellerLogin;
