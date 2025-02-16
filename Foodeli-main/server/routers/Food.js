import express from "express";
import {
  addProduct,
  getFoodById,
  getFoodItems,
  deleteFood,
  updateFood, // Nhập hàm updateFood
} from "../controllers/Food.js";

const router = express.Router();

// Thêm một hoặc nhiều món ăn
router.post("/add", addProduct);

// Lấy danh sách tất cả món ăn
router.get("/", getFoodItems);

// Lấy món ăn theo ID
router.get("/:id", getFoodById);

// Xóa món ăn theo ID
router.delete("/:id", deleteFood);

// Cập nhật món ăn theo ID
router.put("/:id", updateFood); // Thêm route cho cập nhật món ăn

export default router;