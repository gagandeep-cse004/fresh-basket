import { useAppContext } from "../context/AppContext";
import EmptyState from "./ui/EmptyState";
import { Skeleton } from "./ui/Skeleton";

// Wrap pages that need an account. Shows a friendly prompt instead of
// a blank page or a silent redirect.
const RequireLogin = ({ title, children }) => {
  const { user, authChecked, setShowUserLogin } = useAppContext();
  if (!authChecked) return <Skeleton className="mt-10 h-64 w-full" />;
  if (!user) {
    return (
      <EmptyState
        icon="user"
        title={title || "Log in to continue"}
        text="Your cart is saved, so you won't lose anything."
      >
        <button className="btn-primary" onClick={() => setShowUserLogin(true)}>
          Log in or create account
        </button>
      </EmptyState>
    );
  }
  return children;
};

export default RequireLogin;
