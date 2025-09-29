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

function ProductDetails() {

  const [userRating, setUserRating] = React.useState(0);
  
  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const { loading, error, product } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (error) {
      const errorMsg = error.error || error.message || String(error);
      toast.error(errorMsg, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);
  
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
  return (
    <>
      <PageTitle title="Product Name - Details" />
      <Navbar />
      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            <img src="" alt="Product" className="product-image" />
          </div>

          <div className="product-info">
            <h2>Product Name</h2>
            <p className="product-description">
              This is a detailed description of the product. It includes features,
              specifications, and other relevant information that helps the customer
              make an informed decision.
            </p>
            <p className="product-price">
              Price: $99.99
            </p>
            <div className="product-rating">
              <Rating
                value={4}
                disabled={true}
              />
              <span className="productCardSpan">
                (4 Reviews)
              </span>
            </div>

            <div className="stock-status">
              <span className="in-stock">
                In Stock (20 items available)
              </span>
            </div>

            <div className="quantity-controls">
              <span className="quantity-label">Quantity:</span>
              <button className="quantity-button">-</button>
              <input type="text" value={1} readOnly className="quantity-value" />
              <button className="quantity-button">+</button>
            </div>

            <button className="add-to-cart-btn">
              Add to Cart
            </button>

            <form className="review-form">
              <h3>Write a Review</h3>
              <Rating
                value={0}
                disabled={false}
                onRatingChange={handleRatingChange}
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
          <h3>Customer Reviews</h3>
          <div className="review-section">
            <div className="review-item">
              <div className="review-header">
                <Rating value={5} disabled={true} />
              </div>
              <p className="review-comment">
                "Great product! Highly recommend."
              </p>
              <p className='review-name'>John Doe</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProductDetails
