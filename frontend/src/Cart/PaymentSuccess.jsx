import React, { useEffect } from "react";
import "./Styles/PaymentSuccess.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createOrder,
  removeErrors,
  removeSuccess,
} from "../features/order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
import Loader from "../components/Loader";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { loading, success, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const orderItem = JSON.parse(sessionStorage.getItem("orderInfo"));
    if(!orderItem) return;
    const createOrderData = async () => {
      try {
        const orderData = {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
          })),
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            pinCode: shippingInfo.pinCode,
            phoneNo: shippingInfo.phoneNumber,
          },
          paymentInfo: {
            id: reference,
            status: "succeeded",
          },
          itemsPrice: orderItem.subtotal,
          taxPrice: orderItem.tax,
          shippingPrice: orderItem.shipping,
          totalPrice: orderItem.total,
        };
        console.log("Order Data (to be sent):", orderData);
        const res = await dispatch(createOrder(orderData));
        console.log("Order API response:", res);
        sessionStorage.removeItem("orderInfo");
      } catch (error) {
        console.error("Error creating order:", error.message);
        toast.error(error.message || "Failed to create order", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };
    createOrderData();
  }, [dispatch, reference, cartItems, shippingInfo]);

  useEffect(() => {
    if (error) {
      toast.error("Order Failed", { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Order Placed Successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(clearCart());
      dispatch(removeSuccess());
    }
  }, [success, dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Payment Status" />
          <Navbar />
          <div className="payment-success-container">
            <div className="success-content">
              <div className="success-icon">
                <div className="checkmark"></div>
              </div>
              <h1 className="font-bold text-[green] text-2xl">
                Order Confirmed!
              </h1>
              <p className="text-2xl">
                Your Payment was successful. Reference ID is{" "}
                <strong>{reference}</strong>
              </p>
              <Link className="explore-btn" to="/orders/user">
                View Orders
              </Link>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default PaymentSuccess;
