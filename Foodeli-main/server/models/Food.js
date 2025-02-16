import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema({
  org: { type: Number, default: 0.0 },
  mrp: { type: Number, default: 0.0 },
  off: { type: Number, default: 0 },
});

// Schema cho món ăn
const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Loại bỏ khoảng trắng ở đầu và cuối
    },
    desc: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Loại bỏ khoảng trắng ở đầu và cuối
    },
    img: {
      type: String,
      default: null,
    },
    price: {
      type: PriceSchema, // Sử dụng PriceSchema để tổ chức rõ ràng hơn
      default: () => ({ org: 0.0, mrp: 0.0, off: 0 }),
    },
    categories: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

// Đảm bảo không có món ăn nào có tên giống nhau
FoodSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Food", FoodSchema);