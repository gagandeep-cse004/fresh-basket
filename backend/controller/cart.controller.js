import User from "../models/user.model.js";

// update user cartData: /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems || typeof cartItems !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid cart data" });
    }
    await User.findByIdAndUpdate(req.user, { cartItems });
    res.status(200).json({ success: true, message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
