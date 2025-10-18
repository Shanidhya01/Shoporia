import "./Styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useSelector } from "react-redux";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isAuthenticated } = useSelector((state) => state.user);
  const {cartItems} = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((s) => !s);
  const toggleSearch = () => setIsSearchOpen((s) => !s);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const keyword = searchQuery.trim();
    // ABSOLUTE PATH to avoid /products/products...
    navigate(keyword ? `/products?keyword=${encodeURIComponent(keyword)}` : `/products`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Shoporia</Link>
        </div>

        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          {/* Search and Cart Section */}
          <div className="navbar-actions">
            <div className="search-container">
              <form className={`search-form ${isSearchOpen ? "active" : ""}`} onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-icon" aria-label="Search">
                  <SearchIcon />
                </button>
              </form>
            </div>

            <div className="cart-container">
              <Link to="/cart" className="cart-link">
                <ShoppingCartIcon className="cart-icon" />
                <span className="cart-badge">{cartItems.length}</span>
              </Link>
            </div>
          </div>

          {!isAuthenticated && (
            <Link to="/register" className="register-link">
              <PersonAddIcon className="icon" />
            </Link>
          )}

          <div className="navbar-hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <CloseIcon className="icon" /> : <MenuIcon className="icon" />}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
