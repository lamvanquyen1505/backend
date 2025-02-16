import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/user.js";
import Order from "../models/Orders.js";
import nodemailer from "nodemailer";

dotenv.config();

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Dịch vụ email
  auth: {
    user: process.env.EMAIL_USER, // Địa chỉ email
    pass: process.env.EMAIL_PASS, // Mật khẩu email
  },
});

// Đăng ký người dùng
export const UserRegister = async (req, res, next) => {
  try {
    const { name, email, password, img } = req.body;
    const isExist = await User.findOne({ email }).exec();
    if (isExist) {
      return next(createError(400, "Email already taken"));
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user = new User({ name, email, password: hashedPassword, img });
    const createdUser = await user.save();

    // Gửi email xác nhận
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Xác nhận đăng ký',
      text: `Chào ${name},\n\nBạn đã đăng ký thành công!`,
    };

    await transporter.sendMail(mailOptions);

    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, { expiresIn: "20 years" });
    return res.status(201).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

// Đăng nhập người dùng
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(400, "Email is not found"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password/email"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "20 years" });
    return res.status(200).json({ token, user });
  } catch (err) {
    return next(err);
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;

    const user = await User.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    user.cart = user.cart || [];
    const existingCartItemIndex = user.cart.findIndex(item => item.product.equals(productId));

    if (existingCartItemIndex !== -1) {
      // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Thêm sản phẩm mới vào giỏ
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    return res.status(200).json({ message: "Product added to cart successfully", user });
  } catch (err) {
    next(err);
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;

    const user = await User.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const productIndex = user.cart.findIndex(item => item.product.equals(productId));

    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;
        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1);
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();
      return res.status(200).json({ message: "Product quantity updated in cart", user });
    } else {
      return next(createError(404, "Product not found in cart"));
    }
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả sản phẩm trong giỏ hàng
export const getAllCartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;

    const user = await User.findById(userJWT.id).populate({ path: "cart.product", model: "Food" });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    return res.json(user.cart || []);
  } catch (error) {
    next(error);
  }
};

// Đặt hàng
export const placeOrder = async (req, res, next) => {
  try {
    const { totalAmount, products, address } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    const order = new Order({ products, user: user._id, total_amount: totalAmount, address });
    await order.save();
    user.cart = []; // Xóa giỏ hàng sau khi đặt hàng
    await user.save();

    return res.json({ message: "Order placed successfully", order });
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả đơn hàng của người dùng
export const getAllOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate("products.product").exec();
    if (!orders) {
      return next(createError(404, "No orders found"));
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFromFavourites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;

    const user = await User.findById(userJWT.id);
    user.favourites = user.favourites.filter(item => !item.equals(productId));
    await user.save();

    res.json({ message: "Product removed from favourites successfully", user });
  } catch (error) {
    next(error);
  }
};

// Thêm sản phẩm vào danh sách yêu thích
export const addToFavourites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;

    const user = await User.findById(userJWT.id);
    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    return res.json({ message: "Product added to favourites successfully", user });
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả sản phẩm trong danh sách yêu thích
export const getAllFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favourites").exec();
    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.json(user.favourites);
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông tin người dùng
export const ProfileUpdate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, img } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, img },
      { new: true, runValidators: true }
    );

    if (!user) return next(createError(404, "User not found"));

    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "20 years" });
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};