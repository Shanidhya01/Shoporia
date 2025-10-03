import React, { useEffect, useState } from "react";
import "./Styles/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, removeErrors, removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState("../images/Profile.webp");
  const { success, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name || !email || !password) {
      toast.error("Please fill all the fields", { position: "top-center", autoClose: 3000 });
      return;
    }
    const formData = new FormData();
    formData.set("name", formData.name);
    formData.set("email", formData.email);
    formData.set("password", formData.password);
    if (formData.avatar) {
      formData.set("avatar", formData.avatar);
    }
    console.log(formData);
    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Registration successful!", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      navigate("/login");
    }
  }, [success, dispatch]);

  return (
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
            <h1>Welcome to Shoporia</h1>
            <p>
              Join thousands of happy shoppers and discover amazing products at
              unbeatable prices.
            </p>
            <div className="form-features">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Secure & Fast Checkout</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Exclusive Member Deals</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form section */}
        <div className="form-content">
          <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
            <h2>Sign Up</h2>

            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className="avatar-group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <img src={avatarPreview} alt="Avatar" className="avatar" />
            </div>

            <button type="submit" className="authBtn">
              Sign Up
            </button>

            <p className="form-links">
              Already have an account?
              <Link to="/login">Sign in Here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
