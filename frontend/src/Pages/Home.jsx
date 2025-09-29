import React, { useEffect } from "react";
import Footer from "../components/Footer";
import "./Styles/Home.css";
import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Product from "../components/Product";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../features/products/productSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function Home() {
  const { loading, error, products, productCount } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    if(error) {
      console.log(error.message);
      toast.error(error.message,{ position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Home" />
          <Navbar />
          <ImageSlider />
          <div className="home-container">
            <h2 className="home-heading">Welcome to Shoporia</h2>
            <div className="home-product-container">
              {products.map((product, index) => (
                <Product key={index} product={product} />
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default Home;
