import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyUserAuth = async (req, res, next) => {
  try{
    const {token} = req.cookies;
    // console.log(token);
    if(!token){
      return res.status(401).json({ 
        success: false, 
        message: "Please login to access this resource" 
      });
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decodedData);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not allowed to access this resource" 
      });
    }
    next();
  };
};