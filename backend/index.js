import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
import { connectDB } from "./config/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { connectCloudinary } from "./config/cloudinary.js";

const app = express();

// make sure the upload folder exists
fs.mkdirSync("uploads", { recursive: true });

await connectCloudinary();

// allowed origins: comma separated list in CLIENT_URL. Also accept any localhost dev port
// because Vite often auto-increments to 5174, 5175, etc. when 5173 is busy.
const allowedOrigins = [
  ...(process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
];

const isLocalOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || isLocalOrigin(origin)) {
      return callback(null, origin);
    }
    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Cookie",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
  ],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ success: true }));
app.use("/images", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

// unknown api route
app.use("/api", (req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// central error handler (multer errors, bad json, etc.)
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 400)
    .json({ success: false, message: err.message || "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
