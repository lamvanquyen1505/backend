import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignUp } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackBar";
import { ToastContainer, toast } from 'react-toastify';
const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;
const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const SignUp = ({ setOpenAuth }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);
    if (validateInputs()) {
      await UserSignUp({ name, email, password })
        .then((res) => {
         toast.success("Sign Up Successful");

          dispatch(loginSuccess(res.data));
          dispatch(
            openSnackbar({
              message: "Sign Up Successful",
              severity: "success",
            })
          );
          setLoading(false);
          setButtonDisabled(false);
          setTimeout(() => {
            setOpenAuth(false)
          }, 2000);
        })
        .catch((err) => {
          setButtonDisabled(false);
          if (err.response) {
            setLoading(false);
            setButtonDisabled(false);
            toast.error(err.response.data.message);
            dispatch(
              openSnackbar({
                message: err.response.data.message,
                severity: "error",
              })
            );
          } else {
            setLoading(false);
            setButtonDisabled(false);
            toast.error(err.message);
            dispatch(
              openSnackbar({
                message: err.message,
                severity: "error",
              })
            );
          }
        });
    }

    setButtonDisabled(false);
    setLoading(false);
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
        <Title>Tạo tài khoản mới 👋</Title>
        <Span>Vui lòng nhập thông tin chi tiết để tạo tài khoản mới</Span>
      </div>
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          handelChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
        />
        <Button
          text="Sign Up"
          onClick={handleSignUp}
          isLoading={loading}
          isDisabled={buttonDisabled}
        />
      </div>
    </Container>
  );
};

export default SignUp;