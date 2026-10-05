// One place to rebrand the store.
export const STORE_NAME = "Fresh Basket";
export const CURRENCY = "$"; // change to "₹" for rupees
export const TAX_PERCENT = 2; // must match TAX_PERCENT in backend order.controller.js
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const imageUrl = (name) =>
  name ? `${BACKEND_URL}/images/${encodeURIComponent(name)}` : "";

export const money = (value) =>
  `${CURRENCY}${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

export const discountPercent = (price, offerPrice) =>
  price > offerPrice ? Math.round(((price - offerPrice) / price) * 100) : 0;

export const ORDER_STATUSES = [
  "Order Placed",
  "Packed",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];
