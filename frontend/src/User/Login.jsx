import React, { useEffect, useState } from "react";
import "./Styles/Form.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, removeErrors } from "../features/user/userSlice";
import { toast } from "react-toastify";
import PageTitle from "../components/PageTitle";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { error, loading, success, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    dispatch(login({ email: formData.email, password: formData.password }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigator(redirect);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (success) {
      toast.success("Login Successful", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, success]);

  return (
    <>
      <PageTitle title="Login" />
      <div className="form-container">
        <div className="container">
          {/* Left side - Image section */}
          <div className="form-image-section">
            <div className="form-image-content">
              <div className="form-image-icon">
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="white"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M60 30c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"
                    fill="white"
                  />
                  <circle cx="60" cy="60" r="12" fill="white" />
                </svg>
              </div>
              <h1>Welcome Back!</h1>
              <p>
                Sign in to access your account and continue your shopping
                journey with exclusive deals and personalized recommendations.
              </p>
              <div className="form-features">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span>Track Your Orders</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span>Save Your Favorites</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span>Quick & Easy Checkout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form section */}
          <div className="form-content">
            <form className="form" onSubmit={handleSubmit}>
              <h2>Sign In</h2>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/password/forgot" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="authBtn">
                Sign In
              </button>

              <p className="form-links">
                Don't have an account?
                <Link to="/register">Sign up Here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
