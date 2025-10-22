import React, { use } from 'react'
import "./Styles/PaymentSuccess.css"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { Link, useSearchParams } from 'react-router-dom'

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  return (
    <>
      <PageTitle title="Payment Success" />
      <Navbar />
      <div className="payment-success-container">
        <div className="success-icon">
          <div className="checkmark"></div>
        </div>
        <h1 className='font-bold text-[green] text-2xl'>Order Confirmed!</h1>
        <p className='text-2xl'>Your Payment was successful. Reference ID is <strong>{reference}</strong></p>
        <Link className='explore-btn' to="/">Explore More Products</Link>
      </div>
      <Footer />
    </>
  )
}

export default PaymentSuccess
