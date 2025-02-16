import mongoose from "mongoose";
import Food from "../models/Food.js";
import { createError } from "../error.js";

export const addProduct = async (req, res, next) => {
  try {
    let foodData = req.body;

    // Kiểm tra nếu foodData không phải là một mảng
    if (!Array.isArray(foodData)) {
      foodData = [foodData]; // Chuyển đổi thành mảng nếu không phải
    }

    let createdFoods = []; 
    for (const foodInfo of foodData) {
      const { name, desc, img, price, ingredients, categories } = foodInfo;
      const product = new Food({
        name,
        desc,
        img,
        price,
        ingredients,
        categories,
      });
      const createdFood = await product.save();
      createdFoods.push(createdFood);
    }

    return res.status(201).json({ message: "Products added successfully", createdFoods });
  } catch (error) {
    next(error);
  }
};

export const getFoodItems = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, sizes, search } = req.query;
    sizes = sizes?.split(",");
    categories = categories?.split(",");

    const filter = {};

    if (categories && Array.isArray(categories) && categories.length > 0) {
      filter.categories = { $in: categories };
    }

    if (minPrice || maxPrice) {
      filter["price.org"] = {};
      if (minPrice) {
        filter["price.org"]["$gte"] = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter["price.org"]["$lte"] = parseFloat(maxPrice);
      }
    }

    if (sizes && Array.isArray(sizes)) {
      filter.sizes = { $in: sizes };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { desc: { $regex: new RegExp(search, "i") } },
      ];
    }

    const products = await Food.find(filter);
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid ID"));
    }
    const food = await Food.findById(id);
    if (!food) {
      return next(createError(404, "Food not found"));
    }
    return res.status(200).json(food);
  } catch (error) {
    next(error);
  }
};

// Thêm hàm xóa món ăn
export const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid ID"));
    }

    const deletedFood = await Food.findByIdAndDelete(id);
    if (!deletedFood) {
      return next(createError(404, "Food not found"));
    }

    return res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Thêm hàm cập nhật món ăn
export const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid ID"));
    }

    const updatedFood = await Food.findByIdAndUpdate(id, updates, { new: true });
    
    if (!updatedFood) {
      return next(createError(404, "Food not found"));
    }

    return res.status(200).json({ message: "Food updated successfully", updatedFood });
  } catch (error) {
    next(error);
  }
};