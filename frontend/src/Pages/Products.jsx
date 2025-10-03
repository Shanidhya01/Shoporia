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
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import NoProduct from "../components/NoProduct";
import Pagination from "../components/Pagination";

function Products() {
  const dispatch = useDispatch();
  const { products, loading, error, page, totalPages, filtered } = useSelector((s) => s.product);

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const currentPage = Math.max(1, Number(searchParams.get("page") || 1));
  const categories = ["Electronics", "Cameras", "Laptop", "Accessories", "Headphones", "Food", "Books", "Clothes","Shoes", "Beauty", "Health", "Sports", "Outdoor", "Home"];


  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage, category }));
  }, [dispatch, keyword, currentPage, category]);

  useEffect(() => {
    if (error) {
      const msg = error.error || error.message || "Failed to load products";
      toast.error(msg, { position: "top-center", toastId: "products-error" });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    if (keyword) params.set("keyword", keyword); else params.delete("keyword");
    params.set("page", String(p));
    setSearchParams(params);
  };

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (keyword) params.set("keyword", keyword); else params.delete("keyword");
    params.set("category", cat);
    setSearchParams(params);
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle title="All Products" />
      <Navbar />
      <div className="products-layout">
        <div className="filter-section">
          <h2 className="filter-heading">CATEGORIES</h2>
          <ul>
            {
              categories.map((category) => {
                return(
                  <li key={category} onClick={() => handleCategoryClick(category)}>{category}</li>
                )
              })
            }
          </ul>
        </div>

        <div className="products-section">
          <div className="products-product-container">
            {products.length === 0 ? (
              <NoProduct keyword={keyword} />
            ) : (
              products.map((product) => (
                <Product key={product._id} product={product} />
              ))
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            onPageChange={goToPage}
            totalPages={totalPages}
            filtered={filtered}
            page={page}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Products;