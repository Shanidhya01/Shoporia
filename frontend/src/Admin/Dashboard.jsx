import React from 'react'
import './Styles/Dashboard.css'
import {
  AddBox,
  CheckCircle,
  Dashboard as DashboardIcon,
  Error,
  GitHub,
  Instagram,
  Inventory,
  LinkedIn,
  Payments,
  People,
  ShoppingCart,
  Star,
} from '@mui/icons-material';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <>
      <PageTitle title="Admin Dashboard" />
      <Navbar />
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="logo">
            <DashboardIcon className='logo-icon' />
            Admin Dashboard 
          </div>
          <nav className="nav-menu">
            <div className="nav-section">
              <h3>Products</h3>
              <Link to="/admin/products" className="nav-link">
                <Inventory className='nav-icon'/>
                All Products
              </Link>
              <Link to="/admin/product/create" className="nav-link">
                <AddBox className='nav-icon'/>
                Create Product
              </Link>
            </div>
            <div className="nav-section">
              <h3>Users</h3>
              <Link to="/admin/users" className="nav-link">
                <People className='nav-icon'/>
                All Users
              </Link>
            </div>
            <div className="nav-section">
              <h3>Orders</h3>
              <Link to="/admin/orders" className="nav-link">
                <ShoppingCart className='nav-icon'/>
                All Orders
              </Link>
            </div>
            <div className="nav-section">
              <h3>Reviews</h3>
              <Link to="/admin/reviewId" className="nav-link">
                <Star className='nav-icon'/>
                All Reviews
              </Link>
            </div>
          </nav>
        </div>

        <div className="main-content">
          <div className="stats-grid">
            <div className="stat-box">
              <Inventory  />
              <h3>Total Products</h3>
              <p>10</p>
            </div>
            <div className="stat-box">
              <ShoppingCart  />
              <h3>Total Orders</h3>
              <p>5</p>
            </div>
            <div className="stat-box">
              <Star  />
              <h3>Total Reviews</h3>
              <p>3</p>
            </div>
            <div className="stat-box">
              <Payments  />
              <h3>Total Revenue</h3>
              <p>₹1000</p>
            </div>
            <div className="stat-box">
              <Error  />
              <h3>Out of Stock</h3>
              <p>2</p>
            </div>
            <div className="stat-box">
              <CheckCircle  />
              <h3>In Stock</h3>
              <p>8</p>
            </div>
          </div>

          <div className="social-stats">
            <div className="social-box instagram">
              <Instagram />
              <h3>Instagram Followers</h3>
              <p>1.2K</p>
            </div>
            <div className="social-box linkedin">
              <LinkedIn />
              <h3>LinkedIn Followers</h3>
              <p>800</p>
            </div>
            <div className="social-box github">
              <GitHub />
              <h3>GitHub Followers</h3>
              <p>1.2K</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
