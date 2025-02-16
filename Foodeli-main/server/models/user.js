import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Giữ unique cho email
      match: /.+\@.+\..+/ // Regex để kiểm tra định dạng email
    },
    password: {
      type: String,
      required: true,
      // Không cần unique: true
    },
    img: {
      type: String,
      default: null,
    },
    favourites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Food",
      default: [],
    },
    orders: { // Đổi tên từ Orders sang orders để tuân thủ quy tắc camelCase
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Orders",
      default: [],
    },
    cart: {
      type: [
        {
          product: {
            type: mongoose.Schema.ObjectId,
            ref: "Food",
            required: true,
          },
          quantity: { type: Number, default: 1 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Xuất model User
export default mongoose.model("User", UserSchema);