import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";

const NotFound = () => (
  <EmptyState
    icon="search"
    title="We can't find that page"
    text="The link may be old, or the product may have been removed."
  >
    <Link to="/" className="btn-primary">
      Back to home
    </Link>
    <Link to="/products" className="btn-outline">
      Browse products
    </Link>
  </EmptyState>
);
export default NotFound;
