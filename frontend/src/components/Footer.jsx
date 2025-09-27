import React from 'react'
import "./Styles/Footer.css"
import { Phone, Mail, GitHub, LinkedIn, Instagram, X } from '@mui/icons-material';

function Footer() {
  return (
    <footer className='footer'>
      <div className="footer-container">
        {/* Section1 */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><Phone fontSize='small'/>Phone : +91 9876543210</p>
          <p><Mail fontSize='small'/>Email : lucky@shoporia.com</p>
        </div>

        {/* Section 2 */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href='https://github.com/Shanidhya01' target='_blank'>
              <GitHub className='social-icon' />
            </a>
            <a href='https://www.linkedin.com/in/shanidhya-kumar/' target='_blank'>
              <LinkedIn className='social-icon' />
            </a>
            <a href='https://www.instagram.com/kshanidhya' target='_blank'>
              <Instagram className='social-icon' />
            </a>
            <a href='https://x.com/kumar_shanidhya' target='_blank'>
              <X className='social-icon' />
            </a>
          </div>
        </div>

        {/* section 3 */}
        <div className="footer-section about">
          <h3>About Shoporia</h3>
          <p>Shoporia is your one-stop online shop for all your needs. We offer a wide range of products from electronics to fashion, ensuring quality and affordability.</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Shoporia</p>
      </div>
    </footer>
  )
}

export default Footer
