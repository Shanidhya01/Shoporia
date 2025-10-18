import React from 'react'
import "./Styles/Shipping.css"
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath'
import { useDispatch, useSelector } from 'react-redux'

function Shipping() {

  const {shippingInfo} = useSelector((state)=>state.cart);
  const dispatch = useDispatch();
  const [address, setAddress] = React.useState(shippingInfo.address || "");
  const [pinCode, setPinCode] = React.useState(shippingInfo.pinCode || "");
  const [phoneNumber, setPhoneNumber] = React.useState(shippingInfo.phone || "");
  const [country, setCountry] = React.useState(shippingInfo.country || "");
  const [state, setState] = React.useState(shippingInfo.state || "");
  const [city, setCity] = React.useState(shippingInfo.city || "");

  const shippingInfoSubmit = (e) => {
    e.preventDefault();
    const data = {
      address,
      pinCode,
      phone: phoneNumber,
      country,
      state,
      city
    };
  }
  return (
    <>      
      <PageTitle title="Shipping Information" />
      <Navbar />
      <CheckoutPath activePath={0} />
      <div className="shipping-form-container">
        <h1 className="shipping-form-header">Shipping Details</h1>
        <form className="shipping-form" onSubmit={shippingInfoSubmit}>
          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="shipping-form-group">
              <label htmlFor="pinCode">Pin Code</label>
              <input type="number" id="pinCode" name="pinCode" placeholder="Enter your pin code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} required />
            </div>
            <div className="shipping-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
          </div>

          <div className='shipping-section'>
            <div className="shipping-form-group">
              <label htmlFor="country">Country</label>
              <select name='country' id='country' value={country} onChange={(e) => setCountry(e.target.value)} required>
                <option value="">Select Country</option>
                <option value="USA">United States</option>
                <option value="CAN">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AUS">Australia</option>
                <option value="IND">India</option>
              </select>
            </div>
            <div className="shipping-form-group">
              <label htmlFor="state">State</label>
              <select name='state' id='state' value={state} onChange={(e) => setState(e.target.value)} required>
                <option value="">Select State</option>
                <option value="NY">New York</option>
                <option value="ON">Ontario</option>
                <option value="LON">London</option>
                <option value="NSW">New South Wales</option>
                <option value="DEL">Delhi</option>
              </select>
            </div>
            <div className="shipping-form-group">
              <label htmlFor="city">City</label>
              <select name='city' id='city' value={city} onChange={(e) => setCity(e.target.value)} required>
                <option value="">Select City</option>
                <option value="NYC">New York</option>
                <option value="TOR">Toronto</option>
                <option value="LON">London</option>
                <option value="SYD">Sydney</option>
                <option value="DEL">Delhi</option>
              </select>            
              </div>
          </div>
        </form>
        <button className="shipping-submit-btn">Continue</button>
      </div>
      <Footer />
    </>
  )
}

export default Shipping
