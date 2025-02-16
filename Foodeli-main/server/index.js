import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { connectDB } from "./db/mongo.js";
import UserRouter from "./routers/User.js";
import FoodRouter from "./routers/Food.js";

dotenv.config();
const app = express();

// Cấu hình CORS
const corsOptions = {
  origin: 'https://foodeli-jet.vercel.app', // Cho phép origin này
  optionsSuccessStatus: 200,
};

// Sử dụng middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Route chính
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello, welcome to Foodeli API!",
  });
});

// Sử dụng các router
app.use("/api/user/", UserRouter);
app.use("/api/food/", FoodRouter);

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Khởi động server
const startServer = () => {
  try {
    connectDB(); // Kết nối tới cơ sở dữ liệu
    app.listen(8080, () =>
      console.log("Server started on http://localhost:8080")
    );
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

startServer();