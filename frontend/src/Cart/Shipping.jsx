import React from "react";
import "./Styles/Shipping.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";


function Shipping() {
  const { shippingInfo } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [address, setAddress] = React.useState(shippingInfo.address || "");
  const [pinCode, setPinCode] = React.useState(shippingInfo.pinCode || "");
  const [phoneNumber, setPhoneNumber] = React.useState(
    shippingInfo.phoneNumber || ""
  );
  const [country, setCountry] = React.useState(shippingInfo.country || "");
  const [state, setState] = React.useState(shippingInfo.state || "");
  const [city, setCity] = React.useState(shippingInfo.city || "");
  const navigate = useNavigate();

  const shippingInfoSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast.error("Phone Number should be 10 digits long",{position: "top-center", autoClose: 3000});
      return;
    }
    dispatch(saveShippingInfo({ address, pinCode, phoneNumber, country, state, city }));
    navigate("/order/confirm");

  };
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
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="shipping-form-group">
              <label htmlFor="pinCode">Pin Code</label>
              <input
                type="number"
                id="pinCode"
                name="pinCode"
                placeholder="Enter your pin code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                required
              />
            </div>
            <div className="shipping-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="country">Country</label>
              <select
                name="country"
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setState("");
                  setCity("");
                }}
                required
              >
                <option value="">Select Country</option>
                {Country &&
                  Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
              </select>
            </div>
            {country && (
              <div className="shipping-form-group">
                <label htmlFor="state">State</label>
                <select
                  name="state"
                  id="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity("");
                  }}
                  required
                >
                  <option value="">Select State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            {state && (
              <div className="shipping-form-group">
                <label htmlFor="city">City</label>
                <select
                  name="city"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                >
                  <option value="">Select City</option>
                  {City &&
                    City.getCitiesOfState(country, state).map((city) => (
                      <option key={city.isoCode} value={city.isoCode}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        </form>
        <button className="shipping-submit-btn" onClick={shippingInfoSubmit}>Continue</button>
      </div>
      <Footer />
    </>
  );
}

export default Shipping;
