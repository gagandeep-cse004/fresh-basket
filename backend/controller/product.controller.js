import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Product from "../models/product.model.js";

// add product :/api/product/add-product
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category } = req.body;
    const image = req.files?.map((file) => file.filename);
    if (
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      !image ||
      image.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including at least one image are required",
      });
    }
    if (Number(offerPrice) > Number(price)) {
      return res.status(400).json({
        success: false,
        message: "Offer price can't be higher than the product price",
      });
    }

    // one line of the textarea = one bullet point on the product page
    const descriptionList = String(description)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      offerPrice: Number(offerPrice),
      description: descriptionList,
      category,
      image,
    });

    return res.status(201).json({
      success: true,
      product,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};

// get products :/api/product/list
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get single product :/api/product/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete product :/api/product/delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    // remove the image files too (ignore if already gone)
    for (const file of product.image) {
      fs.unlink(path.join("uploads", path.basename(file)), () => {});
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
