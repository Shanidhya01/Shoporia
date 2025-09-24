import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";

// Register a User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "name, email and password are required" 
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists with this email" 
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      avatar: { 
        public_id: "sample_id", 
        url: "sample_url" 
      },
    });
    const token = user.getJWTToken();
    const safeUser = { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      avatar: user.avatar 
    };
    sendToken(user, 201, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter email and password" 
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }
    const token = user.getJWTToken();
    const safeUser = { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      avatar: user.avatar 
    };
    sendToken(user, 200, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


// Logout User
export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", null, {
      expire: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};