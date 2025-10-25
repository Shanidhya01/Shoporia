import React, { useEffect } from "react";
import "./Styles/ProductDetails.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createReview,
  getProductDetails,
  removeErrors,
  removeSuccess,
} from "../features/products/productSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { addItemToCart, removeMessage } from "../features/cart/cartSlice";

function ProductDetails() {
  const [comment, setComment] = React.useState("");
  const [userRating, setUserRating] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  const { loading, error, product, reviewSuccess, reviewLoading } = useSelector((state) => state.product);
  const {
    loading: cartLoading,
    error: cartError,
    success,
    message,
    cartItems,
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
    if (cartError) {
      toast.error(cartError.message || "Cart error", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [dispatch, error, cartError]);

  useEffect(() => {
    if (success) {
      toast.success(message || "Action successful", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
    return () => {
      dispatch(removeErrors());
    };
  }, [dispatch, id]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      toast.error("Quantity cannot be less than 1", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${product.stock} items in stock`, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  };

  const addToCart = () => {
    dispatch(addItemToCart({ id, quantity })).then(() => {
      // Log updated cart from localStorage (accurate)
      console.log("Cart Items:", JSON.parse(localStorage.getItem("cartItems")));
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userRating) {
      toast.error("Please provide a rating before submitting your review.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(
      createReview({
        rating: userRating,
        comment,
        productId: id,
      })
    );
  };

  useEffect(() => {
    if (reviewSuccess) {
      toast.success("Review submitted successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      setUserRating(0);
      setComment("");
      dispatch(removeSuccess());
      dispatch(getProductDetails(id));
    }
  }, [dispatch,id ,reviewSuccess]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PageTitle title="Error | Product Details" />
        <Navbar />
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title={`${product.name} Details`} />
      <Navbar />
      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            <img
              src={product.images[0].url}
              alt="Product"
              className="product-image"
            />
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price: ₹ {product.price}</p>
            <div className="product-rating">
              <Rating value={product.ratings} disabled />
              <span className="productCardSpan">
                ({product.numOfReviews}
                {product.numOfReviews === 1 ? " Review" : " Reviews"})
              </span>
            </div>

            <div className="stock-status">
              <span className={product.stock > 1 ? `in-stock` : `out-of-stock`}>
                {product.stock > 0
                  ? `In Stock (${product.stock} items available)`
                  : "Out of Stock"}
              </span>
            </div>

            {product.stock > 1 && (
              <div className="quantity-controls">
                <span className="quantity-label">Quantity:</span>
                <button className="quantity-button" onClick={decreaseQuantity}>
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="quantity-value"
                />
                <button className="quantity-button" onClick={increaseQuantity}>
                  +
                </button>
              </div>
            )}

            <button
              className="add-to-cart-btn"
              onClick={addToCart}
              disabled={cartLoading || product.stock === 0}
            >
              {cartLoading ? "Adding..." : "Add to Cart"}
            </button>

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>Write a Review</h3>
              <Rating
                value={userRating}
                onChange={(event, newValue) => setUserRating(newValue)}
              />
              <textarea
                placeholder="Write your review here..."
                className="review-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="submit-review-btn" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>

        <div className="reviews-container">
          <h3 className="reviews-title">Customer Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews-section">
              {product.reviews.map((review) => (
                <div className="review-item" key={review._id}>
                  <div className="review-header">
                    <Rating value={review.rating} disabled />
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-name">By: {review.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">
              No reviews yet. Be the first to leave one!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
