import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { addToCart, deleteFromCart, getCart, placeOrder } from "../api";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackBar";
import { DeleteOutline } from "@mui/icons-material";

// Styled components
const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;
const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  gap: 28px;
`;
const Title = styled.div`
  text-transform: capitalize;
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;
const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 12px;
  @media (max-width: 750px) {
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Table = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 30px;
`;
const TableP = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 30px;
`;
const TableItem = styled.div`
  ${({ flex }) => flex && `flex: 1;`}
  ${({ bold }) => bold && `font-weight: 600; font-size: 18px;`}
`;
const Counter = styled.div`
  display: flex;
  gap: 12px;
  user-select: none;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 8px;
  padding: 4px 12px;
`;
const Product = styled.div`
  display: flex;
  gap: 16px;
  @media (max-width: 750px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;
const Image = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 10px;
  object-fit: cover;
`;
const Details = styled.div``;
const Protitle = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  text-transform: capitalize;
  font-weight: 700;
`;
const ProDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 750px) {
    width: 100px;
  }
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Subtotal = styled.div`
  font-size: 22px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;
const T = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: green;
  display: flex;
  justify-content: space-between;
`;
const Delivery = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    completeAddress: "",
  });

  const getProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await getCart(token).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  const addCart = async (id) => {
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: id, quantity: 1 })
      .then(() => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
        dispatch(openSnackbar({ message: err.message, severity: "error" }));
      });
  };

  const removeCart = async (id, quantity, type) => {
    const token = localStorage.getItem("krist-app-token");
    let qnt = quantity > 0 ? 1 : null;
    if (type === "full") qnt = null;
    await deleteFromCart(token, { productId: id, quantity: qnt })
      .then(() => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
        dispatch(openSnackbar({ message: err.message, severity: "error" }));
      });
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, item) => total + item.quantity * item?.product?.price?.org,
      0
    );
  };

  useEffect(() => {
    getProducts();
  }, [reload]);

  const convertAddressToString = (addressObj) => {
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const PlaceOrder = async () => {
    setButtonLoad(true);
    try {
      // Kiểm tra thông tin giao hàng
      if (!deliveryDetails.firstName || !deliveryDetails.lastName) {
        // Thông báo cảnh báo nếu thiếu tên
        toast.warn("Missing name information, but proceeding with the order."); // Thêm cảnh báo
      }

      const token = localStorage.getItem("krist-app-token");
      const totalAmount = calculateSubtotal().toFixed(2);
      const orderDetails = {
        products,
        address: convertAddressToString(deliveryDetails),
        totalAmount,
      };

      await placeOrder(token, orderDetails);
      toast.success("Order placed successfully!");
      dispatch(openSnackbar({
        message: "Order placed successfully",
        severity: "success",
      }));
      setButtonLoad(false);
      setReload(!reload);
    } catch (error) {
      dispatch(openSnackbar({
        message: "Failed to place order. Please try again.",
        severity: "error",
      }));
      setButtonLoad(false);
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
      {loading ? (
        <CircularProgress />
      ) : (
        <Section>
          <Title>Giỏ hàng của bạn</Title>

          {products?.length === 0 ? (
            <>Giỏ hàng trống</>
          ) : (
            <Wrapper>
              <Left>
                <Table>
                  <TableItem bold flex>Sản phẩm</TableItem>
                  <TableItem bold>Giá</TableItem>
                  <TableItem bold>Số lượng</TableItem>
                  <TableItem bold>Tổng phụ</TableItem>
                  <TableItem></TableItem>
                </Table>

                {products?.map(item => (
                  <TableP key={item.product?._id}>
                    <TableItem flex>
                      <Product>
                        <Image src={item.product?.img} />
                        <Details>
                          <Protitle>{item.product?.name}</Protitle>
                          <ProDesc>{item.product?.desc}</ProDesc>
                        </Details>
                      </Product>
                    </TableItem>
                    <TableItem>
                      {new Intl.NumberFormat('vi-VN').format(item.product.price.org)} vnd
                    </TableItem>
                    <TableItem>{item.product.price.org} vnd </TableItem>
                    <TableItem>
                      <Counter>
                        <div
                          style={{ cursor: "pointer", flex: 1 }}
                          onClick={() => removeCart(item?.product?._id, item?.quantity - 1)}
                        >
                          -
                        </div>
                        {item?.quantity}
                        <div
                          style={{ cursor: "pointer", flex: 1 }}
                          onClick={() => addCart(item?.product?._id)}
                        >
                          +
                        </div>
                      </Counter>
                    </TableItem>
                    <TableItem>
                      {new Intl.NumberFormat('vi-VN').format(item.quantity * item?.product?.price?.org)} vnd
                    </TableItem>
                    <TableItem>
                      <DeleteOutline
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => removeCart(item?.product?._id, 0, "full")}
                      />
                    </TableItem>
                  </TableP>
                ))}
              </Left>
              <Right>
                <Subtotal>
                  Tổng phụ :<T>{new Intl.NumberFormat('vi-VN').format(calculateSubtotal())} vnd</T>
                </Subtotal>
                <Delivery>
                  Chi tiết giao hàng:
                  <div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <TextInput
                        small
                        placeholder="tên"
                        value={deliveryDetails.firstName}
                        handelChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <TextInput
                        small
                        placeholder="họ và tên"
                        value={deliveryDetails.lastName}
                        handelChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <TextInput
                      small
                      value={deliveryDetails.emailAddress}
                      handelChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          emailAddress: e.target.value,
                        })
                      }
                      placeholder="Email Address"
                    />
                    <TextInput
                      small
                      value={deliveryDetails.phoneNumber}
                      handelChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="Phone no. +84 XXXXX XXXXX"
                    />
                    <TextInput
                      small
                      textArea
                      rows="5"
                      handelChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          completeAddress: e.target.value,
                        })
                      }
                      value={deliveryDetails.completeAddress}
                      placeholder="Địa chỉ: "
                    />
                  </div>
                </Delivery>
                <Button
                  text="đặt hàng"
                  small
                  isLoading={buttonLoad}
                  isDisabled={buttonLoad}
                  onClick={PlaceOrder}
                />
              </Right>
            </Wrapper>
          )}
        </Section>
      )}
    </Container>
  );
};

export default Cart;