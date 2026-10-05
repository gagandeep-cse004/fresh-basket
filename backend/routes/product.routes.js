import express from "express";
import { authSeller } from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  deleteProduct,
  getProductById,
  getProducts,
} from "../controller/product.controller.js";
import { upload } from "../config/multer.js";
const router = express.Router();

router.post("/add-product", authSeller, upload.array("image", 4), addProduct);
router.get("/list", getProducts);
router.post("/stock", authSeller, changeStock);
router.post("/delete", authSeller, deleteProduct);
router.get("/:id", getProductById); // keep last so it doesn't swallow /list

export default router;
