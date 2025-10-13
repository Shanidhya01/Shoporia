import React from 'react'
import './Styles/UserDashboard.css'
import { useNavigate } from 'react-router-dom';
function UserDashboard({ user }) {
  const navigate = useNavigate();
  const options = [
    { name: "Orders", funcName: orders},
    { name: "Profile", funcName: profile},
    { name: "Logout", funcName: logout},
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

  function logout() {
    console.log("Logout");
  }

  function dashboard() {
    navigate("/admin/dashboard");
  }

  return (
    <div className='dashboard-container'>
      <div className="profile-header">
        <img src={user.avatar.url?user.avatar.url:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt={user.name} className='profile-avatar' />
        <span className="profile-name">{user.name}</span>
      </div>
      <div className="menu-options">
        {options.map((item) => (
          <button className="menu-option-btn" key={item.name} onClick={item.funcName}>{item.name}</button>
        ))}
        
      </div>
    </div>
  )
}

export default UserDashboard
