import React from "react";
import { useNavigate } from "react-router-dom";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import "./Styles/NoProducts.css";

function NoProduct({ keyword }) {
  const navigate = useNavigate();

  return (
    <div className="no-products-container">
      <div className="no-products-decoration"></div>
      <div className="no-products-decoration"></div>
      
      <div className="no-products-icon">
        <SearchOffIcon />
      </div>

      <h2 className="no-products-heading">No Products Found</h2>
      
      {keyword ? (
        <p className="no-products-message">
          We couldn't find any products matching{" "}
          <span className="no-products-keyword">"{keyword}"</span>
        </p>
      ) : (
        <p className="no-products-message">
          No products are currently available.
        </p>
      )}

      <p className="no-products-suggestion">
        Try adjusting your search or browse our categories
      </p>

      <div className="no-products-actions">
        <button
          className="no-products-btn-primary"
          onClick={() => navigate("/products")}
        >
          Browse All Products
        </button>
        <button
          className="no-products-btn-secondary"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default NoProduct;
