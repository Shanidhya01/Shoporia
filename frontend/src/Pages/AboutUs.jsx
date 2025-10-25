import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Styles/AboutUs.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('story');
  const stats = [
    { number: '10K+', label: 'Happy Customers', icon: '😊' },
    { number: '5K+', label: 'Products', icon: '📦' },
    { number: '24/7', label: 'Support', icon: '💬' },
    { number: '100%', label: 'Secure', icon: '🔒' }
  ];

  return (
    <>
      <Navbar />

      {/* ✅ Spacer to prevent navbar overlap */}
      <div className="navbar-spacer"></div>

      <div className="about-us-container">
        <PageTitle title="About Us" />

        <motion.h2
          className="text-3xl font-bold text-center mt-[50px] text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome to <span className="text-blue-600">Shoporia</span>
        </motion.h2>

        <div className="about-content">
          {/* --- Our Story Section --- */}
          <motion.section
            className="about-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* <h2>Our Story</h2>
            <p>
              Founded in 2025, Shoporia began as a small startup with a big dream —
              to redefine online shopping through trust, quality, and innovation. 
              Today, we connect thousands of customers to products they love, 
              offering a seamless and enjoyable shopping experience across devices.
            </p> */}
          </motion.section>

          {/* --- Mission Section --- */}
          <motion.section
            className="mission-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h2>Our Mission</h2>
            <p>
              To provide accessible, affordable, and high-quality products while
              ensuring an exceptional shopping experience for our customers.
            </p>
          </motion.section>

          {/* --- Values Section --- */}
          <motion.section
            className="values-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2>Our Values</h2>
            <div className="values-grid">
              {['Quality', 'Trust', 'Innovation', 'Sustainability'].map((value, index) => (
                <motion.div
                  key={index}
                  className="value-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <h3>{value}</h3>
                  <p>
                    {value === 'Quality' && 'We ensure all products meet our high standards.'}
                    {value === 'Trust' && 'Building lasting relationships with our customers.'}
                    {value === 'Innovation' && 'Constantly improving our services.'}
                    {value === 'Sustainability' && 'Committed to eco-friendly practices.'}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* --- Team Section --- */}
          <motion.section
            className="team-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            
          </motion.section>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <span className="stat-icon">{stat.icon}</span>
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;
