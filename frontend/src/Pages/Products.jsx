import React, { useEffect } from "react";
import "./Styles/Products.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProduct, removeErrors } from "../features/products/productSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useLocation, useSearchParams } from "react-router-dom";

function Products() {
  const { loading, error, products } = useSelector((state) => state.product); //redux state
  const dispatch = useDispatch();

  const location = useLocation();
  const [searchParams] = useSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";
  console.log("Keyword from URL:", keyword);

  useEffect(() => {
    dispatch(getProduct({ keyword }));
  }, [dispatch, keyword]);

  useEffect(() => {
    if (error) {
      const msg = error.error || error.message || "Failed to load products";
      toast.error(msg);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle title="All Products" />
      <Navbar />
      <div className="products-layout">
        <div className="filter-section">
          <h3 className="filter-heading">CATEGORIES</h3>
          {/* Render categories here... */}
        </div>
        <div className="products-section">
          <div className="products-product-container">
            {products.length === 0 ? (
              <div className="no-products-message">
                No products found
                {keyword ? ` for "${keyword}"` : ""}.
              </div>
            ) : (
              products.map((product) => (
                <Product key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Products;
