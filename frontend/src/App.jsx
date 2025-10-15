import Home from './Pages/Home';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import ProductDetails from './Pages/ProductDetails';
import Products from './Pages/Products';
import Register from './User/Register';
import Login from './User/Login';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadUser } from './features/user/userSlice';
import UserDashboard from './User/UserDashboard';
import Profile from './User/Profile';
import ProtectedRoutes from './components/ProtectedRoutes';
import UpdateProfile from './User/UpdateProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {isAuthenticated,user} = useSelector(state=>state.user);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(isAuthenticated){
      dispatch(loadUser());
    }
  },[dispatch])
  console.log(isAuthenticated,user);
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:keyword' element={<Products />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile/update' element={<ProtectedRoutes element={<UpdateProfile />} />} />
        <Route path='/profile' element={<ProtectedRoutes element={<Profile />} />} />
      </Routes>
      {isAuthenticated && <UserDashboard user={user} />}
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  )
}

export default App;