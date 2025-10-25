import React, { useEffect, useState } from "react";
import "./Styles/OrdersList.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteOrder,
  fetchAllOrders,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function OrdersList() {
  const { orders, loading, error, success, message } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Open modal when delete button clicked
  const handleDeleteClick = (id) => {
    setOrderToDelete(id);
    setShowModal(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    dispatch(deleteOrder(orderToDelete));
    setShowModal(false);
    setOrderToDelete(null);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowModal(false);
    setOrderToDelete(null);
  };

  // Handle toast notifications
  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : error.message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      dispatch(fetchAllOrders());
    }
  }, [error, dispatch, success, message]);

  if (orders && orders.length === 0) {
    return (
      <>
        <Navbar />
        <PageTitle title="All Orders" />
        <div className="no-orders-container">
          <p>No Orders Found</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="All Orders" />
          <div className="ordersList-container">
            <h1 className="ordersList-title font-bold text-2xl">All Orders</h1>
            <div className="ordersList-table-container">
              <table className="ordersList-table">
                <thead>
                  <tr>
                    <th>SI No</th>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>Number of Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.map((order, index) => (
                      <tr key={order._id}>
                        <td>{index + 1}</td>
                        <td>{order._id}</td>
                        <td
                          className={`order-status ${order.orderStatus.toLowerCase()}`}
                        >
                          {order.orderStatus}
                        </td>
                        <td>₹{order.totalPrice.toFixed(2)}</td>
                        <td>{order.orderItems.length}</td>
                        <td>
                          <Link to={`/admin/order/${order._id}`}>
                            <Edit />
                          </Link>
                          <button
                            className="action-icon delete-icon"
                            onClick={() => handleDeleteClick(order._id)}
                          >
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <Footer />

          {/* Modal for delete confirmation */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this order?</p>
                <div className="modal-actions">
                  <button onClick={confirmDelete} className="confirm-btn">
                    Yes
                  </button>
                  <button onClick={cancelDelete} className="cancel-btn">
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default OrdersList;
