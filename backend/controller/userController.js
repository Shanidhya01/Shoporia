import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";

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

// Forgot Password
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. Construct reset URL
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/reset/${resetToken}`;
    const message = `Use the following link to reset your password:\n\n${resetPasswordUrl}\n\nThis link is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`;
    console.log("Reset URL:", resetPasswordUrl);
    try {
      // Simulate sending email
      sendEmail({
        email: user.email,
        subject: "Shoporia Password Recovery",
        message,
      })
      res.status(200).json({
        success: true,
        message: `Email is sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({
        success: false,
        message: "Error sending email. Please try again later.",
      });      
    }
    // TODO: Send resetPasswordUrl to user's email here

    return res.status(200).json({
      success: true,
      message: `Reset token sent to email: ${email}`,
      resetUrl: resetPasswordUrl, // include for debugging, remove in prod
    });

  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
