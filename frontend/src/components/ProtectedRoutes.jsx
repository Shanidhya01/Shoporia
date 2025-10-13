import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

function ProtectedRoutes({element}) {
  const {isAuthenticated,loading} = useSelector(state=>state.user);
  if(loading){
    return <Loader />
  }
  if(!isAuthenticated){
    return <Navigate to="/login" />
  }
  return element
}

export default ProtectedRoutes
