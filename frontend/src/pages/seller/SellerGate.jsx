import { useAppContext } from "../../context/AppContext";
import SellerLogin from "../../components/seller/SellerLogin";
import SellerLayout from "./SellerLayout";

// Shows the login form until the seller is authenticated, then the dashboard.
const SellerGate = () => {
  const { isSeller, sellerChecked } = useAppContext();
  if (!sellerChecked) {
    return (
      <p className="p-10 text-center text-muted" role="status">
        Loading…
      </p>
    );
  }
  return isSeller ? <SellerLayout /> : <SellerLogin />;
};
export default SellerGate;
