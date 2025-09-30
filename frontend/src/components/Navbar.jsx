import "./Styles/Navbar.css";
import {Link} from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import React from 'react';
// import './Styles/Search.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }
  const isAuthenticated = false;
  
  return (
    <nav className='navbar'>
      <div className="navbar-container">
        <div className="navbar-logo">
          {/* <img src="/logo.png" alt="Shoporia Logo" className='navbar-logo' /> */}
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

        <div className="navbar-icons">
          <div className="search-container">
            <form className={`search-form ${isSearchOpen ? "active" : ""}`}>
              <input
                type="text"
                placeholder='Search products...'
                className='search-input'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type='button' className='search-icon' onClick={toggleSearch}>
                <SearchIcon focusable="false" />
              </button>
            </form>
          </div>
          <div className="cart-container">
            <Link to="/cart">
              <ShoppingCartIcon className="icon" />
              <span className="cart-badge">3</span>
            </Link>
          </div>

          {
            !isAuthenticated && <Link to="/register" className="register-link">
              <PersonAddIcon className="icon" />
            </Link>
          }

          <div className="navbar-hamburger" onClick={toggleMenu}>
            {isMenuOpen ? 
              <CloseIcon className="icon"/> 
                  :
                <MenuIcon className="icon"/>
              }
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
