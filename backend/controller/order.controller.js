import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Address from "../models/address.model.js";

export const TAX_PERCENT = 2;
export const ORDER_STATUSES = [
  "Order Placed",
  "Packed",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

// Place order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    if (!address || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    // the address must belong to this user
    const addressDoc = await Address.findOne({ _id: address, userId });
    if (!addressDoc) {
      return res
        .status(400)
        .json({ message: "Delivery address not found", success: false });
    }

    // price everything on the server, never trust the browser
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      const product = await Product.findById(item.product);
      if (!product || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: "One of the items in your cart is no longer available",
          success: false,
        });
      }
      if (!product.inStock) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
          success: false,
        });
      }
      subtotal += product.offerPrice * quantity;
      orderItems.push({
        product: String(product._id),
        quantity,
        price: product.offerPrice,
      });
    }

    const amount =
      Math.round((subtotal + (subtotal * TAX_PERCENT) / 100) * 100) / 100;

    await Order.create({
      userId,
      items: orderItems,
      address: String(addressDoc._id),
      amount,
      paymentType: "COD",
      isPaid: false,
    });
    res
      .status(201)
      .json({ message: "Order placed successfully", success: true });
  } catch (error) {
    console.error("Error in placeOrderCOD:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// order details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = String(req.user);
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// get all orders for seller :/api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// update order status (seller) :/api/order/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }
    const update = { status };
    // cash on delivery is paid once the order is delivered
    if (status === "Delivered") update.isPaid = true;
    const order = await Order.findByIdAndUpdate(id, update, { new: true });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// cancel own order while it is still just placed :/api/order/cancel
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }

    const userId = String(req.user);
    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order.status !== "Order Placed") {
      return res.status(400).json({
        success: false,
        message: "This order is already being processed and can't be cancelled",
      });
    }
    order.status = "Cancelled";
    await order.save();
    res.status(200).json({ success: true, message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
