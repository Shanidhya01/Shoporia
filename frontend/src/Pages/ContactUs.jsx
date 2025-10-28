import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Styles/ContactUs.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to send message');
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to send:', err);
      alert(err?.message || 'Failed to send message. Please try again later.');
    } finally {
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }
  };

  const contactInfo = [
    {
      title: "Visit Us",
      content: "M.G. Road, Bangalore, Karnataka 560001, India",
      icon: "📍"
    },
    {
      title: "Call Us",
      content: "+91 8045678900",
      icon: "📞"
    },
    {
      title: "Email Us",
      content: "lucky@shoporia.com",
      icon: "📧"
    },
    {
      title: "Working Hours",
      content: "Mon - Fri: 9:00 AM - 8:00 PM",
      icon: "⏰"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="navbar-spacer"></div>
      
      <div className="contact-container">
        <PageTitle title="Contact Us" />
        
        <motion.div 
          className="contact-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Get in Touch</h1>
          <p>We're here to help and answer any question you might have.</p>
        </motion.div>

        <div className="contact-content">
          {/* Contact Info Cards */}
          <motion.div 
            className="contact-info-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                className="contact-info-card"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <span className="contact-icon">{info.icon}</span>
                <h3>{info.title}</h3>
                <p>{info.content}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form Section */}
          <div className="form-map-container">
            <motion.div 
              className="contact-form-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    rows="5"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className={`submit-button ${submitted ? 'submitted' : ''}`}
                >
                  {submitted ? 'Message Sent!' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Map Section */}
            <motion.div 
              className="map-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="map-placeholder">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.977783734946!2d77.60758661482283!3d12.974863890850427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1682e52fd4c7%3A0x3e5cd94b4eee34a4!2sMG%20Road%2C%20Bengaluru%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sin!4v1635167231456!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;