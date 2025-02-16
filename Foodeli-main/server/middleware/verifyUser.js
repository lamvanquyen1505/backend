import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return next(createError(401, "You are not authenticated")); // Không có header authorization
    }

    const token = auth.split(" ")[1];
    if (!token) {
      return next(createError(401, "You are not authenticated")); // Token không tồn tại
    }

    const verify = jwt.verify(token, process.env.JWT);
    req.user = verify; // Gán thông tin người dùng vào req.user
    return next(); // Tiếp tục tới middleware tiếp theo
  } catch (error) {
    return next(createError(403, "Invalid token")); // Token không hợp lệ
  }
};