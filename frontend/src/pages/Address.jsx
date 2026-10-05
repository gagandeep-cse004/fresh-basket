import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import RequireLogin from "../components/RequireLogin";
import Icon from "../components/ui/Icon";

const fields = [
  { name: "firstName", label: "First name", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", full: true, autoComplete: "email" },
  { name: "street", label: "Street address", full: true, autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "state", label: "State", autoComplete: "address-level1" },
  { name: "zipCode", label: "ZIP / PIN code", autoComplete: "postal-code" },
  { name: "country", label: "Country", autoComplete: "country-name" },
  { name: "phone", label: "Phone", type: "tel", full: true, autoComplete: "tel" },
];

const empty = Object.fromEntries(fields.map((f) => [f.name, ""]));

const AddressForm = () => {
  const [address, setAddress] = useState(empty);
  const [saving, setSaving] = useState(false);
  const { axios, navigate, user } = useAppContext();

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.post("/api/address/add", { address });
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't save the address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-2xl md:mt-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
      >
        <Icon name="arrowLeft" size={16} /> Back to cart
      </Link>
      <h1 className="mt-3 text-3xl font-bold">Add a delivery address</h1>
      <p className="mt-1 text-sm text-muted">
        We'll deliver your order here. You can save more than one address.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
            <label htmlFor={f.name} className="mb-1 block text-sm font-medium">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type || "text"}
              autoComplete={f.autoComplete}
              value={address[f.name]}
              onChange={handleChange}
              className="field"
              required
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <button disabled={saving} className="btn-primary w-full py-3!">
            {saving ? "Saving…" : "Save address"}
          </button>
        </div>
      </form>
      {user && <p className="mt-3 text-center text-xs text-muted">Signed in as {user.email}</p>}
    </div>
  );
};

const Address = () => (
  <RequireLogin title="Log in to add an address">
    <AddressForm />
  </RequireLogin>
);
export default Address;
