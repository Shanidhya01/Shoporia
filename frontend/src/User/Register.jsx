import React, { useState } from "react";
import "./Styles/Form.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("/default-avatar.png");

  // FIX: define loading
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((s) => ({ ...s, avatar: reader.result }));
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      toast.error("Please fill all the details", { position: "top-center", toastId: "register-missing" });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      toast.success("Registered successfully", { position: "top-center" });
    } catch (err) {
      toast.error(err.message, { position: "top-center", toastId: "register-error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="container">
        {/* Left image section (if used in your CSS layout) */}
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

        {/* Right side - Form */}
        <div className="form-content">
          <form className="form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                autoComplete="name"
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
                autoComplete="email"
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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="avatar-group">
              <input
                type="file"
                accept="image/*"
                className="file-input"
                onChange={handleFileChange}
              />
              <img src={avatarPreview} alt="Avatar" className="avatar" />
            </div>

            <button type="submit" className="authBtn" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
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
