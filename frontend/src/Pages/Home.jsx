import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import "./Styles/Home.css"
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'
import PageTitle from '../components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from '../features/products/productSlice'

function Home() {

  const {loading,error,products,productCount} = useSelector((state) => state.product);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProduct());
    if(error){
      console.log(error);
    }
  },[dispatch]);

  return (
    <>
      <PageTitle  title="Home"/>
        <Navbar />
        <ImageSlider />
        <div className='home-container'>
          <h2 className='home-heading'>Welcome to Shoporia</h2>
          <div className="home-product-container">
            {products.map((product,index) => (
              <Product key={index} product={product} />
            ))}
          </div>
        </div>
        <Footer />
    </>
  )
}

export default Home
