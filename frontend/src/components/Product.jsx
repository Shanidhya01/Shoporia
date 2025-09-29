import React from 'react'
import "./Styles/Product.css"
import { Link } from 'react-router-dom'
import Rating from './Rating'

function Product({product}) {
  const [rating, setRating] = React.useState(0);

  const handleRatingChange = (newRating) => {
    setRating(rating);
  };

  // Fallback image if product.images is missing or empty
  const imageUrl =
    product.images && product.images.length > 0 && product.images[0].url
      ? product.images[0].url
      : "/placeholder-product.jpg";

  return (

    <Link to={product._id} className='product_id'>
      <div className='product-card'>
        <div className="product-image-container">
          <img
            src={imageUrl}
            alt={product.name}
            className="product-image-card"
            loading="lazy"
          />
        </div>
        <div className="product-details">
          <h3 className="product-title">{product.name}</h3>
          <span className='product-price'>
            <strong>Price:</strong> {product.price?.toLocaleString()}<span className="product-price-label">/-</span>
          </span>
          <div className="rating_container">
            <Rating 
              value={product.ratings} 
              onRatingChange={handleRatingChange}
              disabled={true}
            />
          </div>
          <span className="productCardSpan">
            ({product.numOfReviews}{product.numOfReviews > 1 ? " Reviews" : " Review"})
          </span>
          <button className="add-to-cart" type="button">
            Add to Cart
          </button>
        </div>     
      </div>
    </Link>
  )
}

export default Product
