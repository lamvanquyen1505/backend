import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignIn } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackBar";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

// Styled component cho Container
const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

// Styled component cho tiêu đề
const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`;

// Styled component cho đoạn văn
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

// Styled component cho nút văn bản
const TextButton = styled.div`
  width: 100%;
  text-align: end;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

// Component SignIn
const SignIn = ({ setOpenAuth }) => {
  const dispatch = useDispatch();
  
  // Các state để quản lý trạng thái của nút và thông tin nhập liệu
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Hàm xác thực các trường nhập liệu
  const validateInputs = () => {
    if (!email || !password) {
      toast.error("Please fill in the fields!"); // Hiển thị thông báo lỗi
      return false;
    }
    return true;
  };

  // Hàm xử lý đăng nhập
  const handleSignIn = async () => {
    setButtonLoading(true);
    setButtonDisabled(true);

    if (validateInputs()) {
      try {
        const res = await UserSignIn({ email, password }); // Gọi API để đăng nhập
        toast.success("Login Successful!"); // Thông báo thành công
        dispatch(loginSuccess(res.data)); // Cập nhật trạng thái người dùng
        dispatch(openSnackbar({ message: "Login Successful", severity: "success" }));

        // Điều hướng đến trang chính sau khi đăng nhập thành công
        navigate('/home'); // Thay đổi route nếu cần

        setOpenAuth(false); // Đóng modal đăng nhập
      } catch (err) {
        const errorMessage = err.response
          ? err.response.data.message
          : err.message; // Lấy thông báo lỗi từ API

        toast.error(errorMessage); // Thông báo lỗi
        dispatch(openSnackbar({ message: errorMessage, severity: "error" }));
      } finally {
        setButtonLoading(false); // Đặt lại trạng thái nút
        setButtonDisabled(false);
      }
    } else {
      setButtonLoading(false); // Đặt lại trạng thái nút nếu không hợp lệ
      setButtonDisabled(false);
    }
  };

  return (
    <Container>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div>
        <Title>Chào mừng đến với Foodeli 👋</Title>
        <Span>Vui lòng đăng nhập với thông tin chi tiết của bạn tại đây</Span>
      </div>
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị email
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)} // Cập nhật giá trị mật khẩu
        />
        <TextButton>Quên mật khẩu?</TextButton> {/* Liên kết quên mật khẩu */}
        <Button
          text="Sign In"
          onClick={handleSignIn} // Gọi hàm đăng nhập khi nhấn nút
          isLoading={buttonLoading} // Trạng thái tải
          isDisabled={buttonDisabled} // Trạng thái vô hiệu hóa
        />
      </div>
    </Container>
  );
};

export default SignIn; // Xuất component để sử dụng ở nơi khác