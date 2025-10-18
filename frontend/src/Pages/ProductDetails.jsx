import React, { useEffect } from 'react'
import './Styles/ProductDetails.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Rating from '@mui/material/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProductDetails, removeErrors } from '../features/products/productSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import { addItemToCart, removeMessage } from '../features/cart/cartSlice'

function ProductDetails() {

  const [userRating, setUserRating] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const { loading, error, product } = useSelector((state) => state.product);
  const {loading:cartLoading,error:cartError,success,message,cartItems}=useSelector((state)=>state.cart);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (error) {
      const errorMsg = error.error || error.message || String(error);
      toast.error(errorMsg, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (cartError) {
      const errorMsg = cartError.error || cartError.message || String(cartError);
      toast.error(errorMsg, { position: "top-center", autoClose: 3000 });
    }
  }, [dispatch, error, cartError]);

  useEffect(() => {
    if (success) {
      const successMsg = message || String(success);
      toast.success(successMsg, { position: "top-center", autoClose: 3000 });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  useEffect(() => {
    if(id){
      dispatch(getProductDetails(id));
    }
    return () => {
      dispatch(removeErrors());
    }
  }, [dispatch, id]);

  if(loading){
    return(
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    )
  }
  if(error || !product){
    return(
      <>
        <PageTitle title="Error | Product Details" />
        <Navbar />
        <Footer />
      </>
    )
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      toast.error("Quantity cannot be less than 1", { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${product.stock} items in stock`, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  };

  const addToCart = () => {
    dispatch(addItemToCart({id,quantity}))
    setTimeout(() => {
      // Log updated cartItems after Redux state updates
      console.log('Cart Items:', cartItems);
    }, 500);
  }

  return (
    <>
      <PageTitle title={`${product.name} Details`} />
      <Navbar />
      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            <img src={product.images[0].url} alt="Product" className="product-image" />
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">
              {product.description}
            </p>
            <p className="product-price">
              Price: ₹ {product.price}
            </p>
            <div className="product-rating">
              <Rating
                value={product.rating}
                disabled={true}
              />
              <span className="productCardSpan">
                ({product.numOfReviews}{product.numOfReviews === 1 ? " Review" : " Reviews"})
              </span>
            </div>

            <div className="stock-status">
              <span className={product.stock > 1 ? `in-stock` : `out-of-stock`}>
                {product.stock > 0 ? `In Stock (${product.stock} items available)` : "Out of Stock"}
              </span>
            </div>

            {
              product.stock > 1 && (
              <>
                <div className="quantity-controls">
                  <span className="quantity-label">Quantity:</span>
                  <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                  <input type="text" value={quantity} readOnly className="quantity-value" />
                  <button className="quantity-button" onClick={increaseQuantity}>+</button>
                </div>
              </>
              )
            }

            <button className="add-to-cart-btn" onClick={addToCart} disabled={cartLoading || product.stock === 0}>
              {cartLoading ? "Adding..." : "Add to Cart"}
            </button>

            <form className="review-form">
              <h3>Write a Review</h3>
              <Rating
                value={userRating}
                onChange={(event, newValue) => handleRatingChange(newValue)}
              />
              <textarea
                placeholder="Write your review here..."
                className="review-input"
              ></textarea>
              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
            </form>
          </div>
        </div>
        <div className="reviews-container">
          <h3 className='reviews-title'>Customer Reviews</h3>
          {
            product.reviews && product.reviews.length > 0 ?(
            <div className="reviews-section">
            {
              product.reviews.map((review) => (
                <div className="review-item" key={review._id}>
                  <div className="review-header">
                    <Rating value={review.rating} disabled={true} />
                  </div>
                  <p className="review-comment">
                    {review.comment}
                  </p>
                  <p className='review-name'>By : {review.name}</p>
                </div>
              ))
            }
          </div>
          ): (
            <p className="no-reviews">No reviews yet. Be the first to leave one!</p>
          )
          }
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProductDetails;
