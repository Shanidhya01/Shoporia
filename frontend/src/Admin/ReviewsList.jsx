import React, { useEffect, useState } from "react";
import "./Styles/ReviewsList.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteReview,
  fetchAdminProducts,
  fetchProductReviews,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function ReviewsList() {
  const { products, loading, error, reviews, success, message } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handleViewReviews = (productId) => {
    setSelectedProduct(productId);
    dispatch(fetchProductReviews(productId));
  };

  // Open modal for delete confirmation
  const handleDeleteClick = (productId, reviewId) => {
    setSelectedProduct(productId);
    setReviewToDelete(reviewId);
    setShowModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedProduct && reviewToDelete) {
      dispatch(deleteReview({ productId: selectedProduct, reviewId: reviewToDelete }));
      setShowModal(false);
      setReviewToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowModal(false);
    setReviewToDelete(null);
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success(message || "Review deleted successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      navigate("/admin/products");
      if (selectedProduct) {
        dispatch(fetchProductReviews(selectedProduct));
      }
    }
  }, [dispatch, error, success, message, selectedProduct]);

  if (!products || products.length === 0) {
    return (
      <div className="reviews-list-container">
        <Navbar />
        <PageTitle title="Reviews List" />
        <h1 className="reviews-list-title">Admin Review</h1>
        <p>No products available to show reviews.</p>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="Reviews List" />
          <div className="reviews-list-container">
            <h1 className="reviews-list-title">All Reviews</h1>
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>SI No</th>
                  <th>Product Name</th>
                  <th>Product Image</th>
                  <th>Number of Reviews</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="product-image"
                      />
                    </td>
                    <td>{product.reviews.length}</td>
                    <td>
                      {product.numOfReviews > 0 && product.reviews.length > 0 && (
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleViewReviews(product._id)}
                        >
                          View Reviews
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedProduct && reviews.length > 0 && (
              <div className="reviews-details">
                <h2>Reviews for Product</h2>
                <table className="reviews-table">
                  <thead>
                    <tr>
                      <th>SI No</th>
                      <th>Reviewer Name</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review, index) => (
                      <tr key={review._id}>
                        <td>{index + 1}</td>
                        <td>{review.name}</td>
                        <td>{review.rating}</td>
                        <td>{review.comment}</td>
                        <td>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteClick(selectedProduct, review._id)}
                          >
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <Footer />

          {/* Modal for delete confirmation */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this review?</p>
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

export default ReviewsList;
