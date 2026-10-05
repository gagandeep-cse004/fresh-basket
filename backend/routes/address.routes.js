import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addAddress,
  deleteAddress,
  getAddress,
} from "../controller/address.controller.js";

const router = express.Router();
router.post("/add", authUser, addAddress);
router.get("/get", authUser, getAddress);
router.post("/delete", authUser, deleteAddress);
export default router;
