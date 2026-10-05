import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Icon from "../components/ui/Icon";
import { Logo } from "../components/Navbar";

const Auth = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setShowUserLogin, signIn, axios } = useAppContext();

  const close = () => setShowUserLogin(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });
      if (data.success) {
        signIn(data.user);
        toast.success(data.message);
        close();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // show the server's message (e.g. "Invalid credentials") when there is one
      toast.error(
        error.response?.data?.message ||
          "Can't reach the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isLogin = state === "login";

  return (
    <div
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={isLogin ? "Log in" : "Create account"}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-2 text-muted hover:bg-brand-soft"
        >
          <Icon name="close" size={18} />
        </button>

        <Logo />
        <h2 className="mt-5 text-2xl font-bold">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isLogin
            ? "Log in to check out and track your orders."
            : "Save your cart and order in a few taps."}
        </p>

        <div className="mt-6 space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="auth-name" className="mb-1 block text-sm font-medium">
                Full name
              </label>
              <input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
                type="text"
                autoComplete="name"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="auth-email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="auth-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field pr-10"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={isLogin ? undefined : 6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted hover:text-ink"
              >
                <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
              </button>
            </div>
            {!isLogin && (
              <p className="mt-1 text-xs text-muted">At least 6 characters.</p>
            )}
          </div>
        </div>

        <button disabled={loading} className="btn-primary mt-6 w-full py-3!">
          {loading ? "Please wait…" : isLogin ? "Log in" : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-muted">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setState(isLogin ? "register" : "login")}
            className="font-semibold text-brand hover:underline"
          >
            {isLogin ? "Create an account" : "Log in"}
          </button>
        </p>
      </form>
    </div>
  );
};
export default Auth;
