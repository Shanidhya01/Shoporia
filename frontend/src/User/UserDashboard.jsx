import React from 'react'
import './Styles/UserDashboard.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logout, removeSuccess } from '../features/user/userSlice';

function UserDashboard({ user }) {

  const {cartItems} = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = React.useState(false);

  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }

  const options = [
    { name: "Orders", funcName: orders},
    { name: "Account", funcName: profile},
    { name: `Cart(${cartItems.length})`, funcName: myCart, isCart: true},
    { name: "Logout", funcName: logoutUser},
  ]
  if(user.role === "admin"){
    options.unshift({ 
      name: "Admin Dashboard", 
      funcName: dashboard
    });
  }

  function orders() {
    navigate("/orders/user");
  }

  function profile() {
    navigate("/profile");
  }

  function logoutUser() {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success("Logged out successfully", {position: "top-center", autoClose: 3000 });
        dispatch(removeSuccess());
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to logout. Please try again.", {position: "top-center", autoClose: 3000 });
      });
  }

  function dashboard() {
    navigate("/admin/dashboard");
  }
  function myCart() {
    navigate("/cart");
  }

  return (
    <>
      <div className={`overlay ${menuVisible ? "show" : ""}`} onClick={toggleMenu}></div>
      <div className='dashboard-container'>
        <div className="profile-header" onClick={toggleMenu}>
          <img src={user.avatar.url?user.avatar.url:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt={user.name} className='profile-avatar' />
          <span className="profile-name">{user.name}</span>
        </div>
        {menuVisible && (<div className="menu-options">
            {options.map((item) => (
              <button className={`menu-option-btn ${item.isCart ? (cartItems.length > 0 ? "cart-not-empty" : ""):""}`} key={item.name} onClick={item.funcName}>{item.name}</button>
            ))}
          </div>)}
      </div>
    </>
  )
}

export default UserDashboard
