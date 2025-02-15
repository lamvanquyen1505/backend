import axios from "axios";

// Tạo một instance của axios với baseURL
const API = axios.create({
  baseURL: "https://foodeli-server.vercel.app/api/",
});

// Đăng ký người dùng mới
export const UserSignUp = async (data) => await API.post("/user/signup", data);

// Đăng nhập người dùng
export const UserSignIn = async (data) => await API.post("/user/signin", data);

// Lấy tất cả sản phẩm với bộ lọc
export const getAllProducts = async (filter) =>
  await API.get(`/food?${filter}`);

// Lấy chi tiết sản phẩm theo ID
export const getProductDetails = async (id) => await API.get(`/food/${id}`);

// Quản lý giỏ hàng

// Lấy giỏ hàng của người dùng
export const getCart = async (token) =>
  await API.get("/user/cart", {
    headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
  });

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (token, data) =>
  await API.post(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
  });

// Xóa sản phẩm khỏi giỏ hàng
export const deleteFromCart = async (token, data) =>
  await API.patch(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
  });

// Quản lý yêu thích

// Lấy danh sách yêu thích của người dùng
export const getFavourite = async (token) =>
  await API.get(`/user/favourite`, {
    headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
  });

// Thêm sản phẩm vào danh sách yêu thích
export const addToFavourite = async (token, data) =>
  await API.post(`/user/favourite/`, data, {
    headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
  });

// Xóa sản phẩm khỏi danh sách yêu thích
export const deleteFromFavourite = async (token, data) =>
  await API.patch(`/user/favourite/`, data, {
    headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
  });

// Quản lý đơn hàng

// Đặt đơn hàng mới
export const placeOrder = async (token, data) =>
  await API.post(`/user/order/`, data, {
    headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
  });

// Lấy danh sách đơn hàng của người dùng
export const getOrders = async (token) =>
  await API.get(`/user/order/`, {
    headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
  });

// Cập nhật thông tin hồ sơ người dùng
export const ProfileData = async (token, data) =>
  await API.put(`/user/profile/`, data, {
    headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
  });

  export const UserSignInemail = async (data) => {
    try {
      const response = await API.post("/user/signin", data);
      // Gửi email nếu đăng nhập thành công
      // Đây là nơi bạn có thể thông báo cho người dùng
      console.log('Login successful. Email sent to:', response.data.email);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
