import Address from "../models/address.model.js";

// add address :/api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const required = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipCode",
      "country",
      "phone",
    ];
    if (!address || required.some((key) => !String(address[key] ?? "").trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all address fields" });
    }
    const savedAddress = await Address.create({
      ...address,
      userId: req.user,
    });
    res.status(201).json({
      success: true,
      message: "Address saved",
      address: savedAddress,
    });
  } catch (error) {
    console.error("Error in addAddress:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// get address:// /api/address/get
export const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// delete address: /api/address/delete
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.body;
    await Address.findOneAndDelete({ _id: id, userId: req.user });
    res.status(200).json({ success: true, message: "Address removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
