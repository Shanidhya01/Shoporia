import React, { useEffect } from 'react'
import "./Styles/Form.css"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeErrors, removeSuccess, updateProfile } from '../features/user/userSlice';
import Loader from '../components/Loader';

function UpdateProfile() {

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [avatar, setAvatar] = React.useState("");
  const [avatarPreview, setAvatarPreview] = React.useState("./images/Profile.webp");
  const [fileName, setFileName] = React.useState("");

  const {user,error,success,message,loading} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  // Pre-populate form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatar?.url || "./images/Profile.webp");
    }
  }, [user]);

  const profileImageUpdate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Set the filename
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.onerror = (error) => {
      toast.error("Error reading file");
    };
    reader.readAsDataURL(file);
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  }

  const updateSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    console.log("Submitting update profile with:", { name, email, hasAvatar: !!avatar });
    
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    if (avatar) {
      myForm.set("avatar", avatar);
    }
    
    dispatch(updateProfile(myForm));
  }

  useEffect(() => {
    if(error){
      console.log("Error occurred:", error);
      toast.error(error, {position: "top-center", autoClose: 3000});
      dispatch(removeErrors());
    }
  },[dispatch,error]);

  useEffect(() => {
    if(success){
      console.log("Success:", success, "Message:", message);
      toast.success(message || "Profile updated successfully!", {position: "top-center", autoClose: 3000});
      dispatch(removeSuccess());
      navigate("/profile");
    }
  },[dispatch,success,message,navigate]);

  return (
    <>
    {loading ? (
      <Loader />
    ) : (
      <>
        <Navbar />
        <div className='container update-container'>
          <div className='form-content'>
            <form className='form' encType='multipart/form-data' onSubmit={updateSubmit}>
              <h2 >Update Profile</h2>
              <div className="input-group avatar-group">
                <div className="file-upload-container">
                  <input 
                    className="file-input" 
                    type="file" 
                    accept='image/*' 
                    name='avatar' 
                    ref={fileInputRef}
                    onChange={profileImageUpdate}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="choose-file-btn"
                    onClick={handleImageClick}
                  >
                    Choose File
                  </button>
                  <span className="file-name">
                    {fileName || "No file chosen"}
                  </span>
                </div>
                <div className="avatar-display">
                  <img src={avatarPreview} alt="User Profile" className="avatar-preview" />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type='text' 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  name='name'
                  id='name'
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type='email' 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  name='email'
                  id='email'
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <button className="authBtn" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </>
    )}
    </>
  )
}

export default UpdateProfile
