import React from 'react'
import "./Styles/Form.css"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function UpdateProfile() {
  return (
    <>
      <Navbar />
      <div className='container update-container'>
        <div className='form-content'>
          <form className='form'>
            <h2 >Update Profile</h2>
            <div className="input-group avatar-group">
              <input className="file-input" type="file" />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default UpdateProfile
