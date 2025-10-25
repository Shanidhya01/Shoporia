import { log } from "console";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

// Register a User
export const registerUser = async (req, res) => {
  try {
    // get fields from body
    const { name, email, password, avatar } = req.body;

    // validate BEFORE any upload
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    // optional avatar upload
    let uploaded = null;
    if (avatar) {
      uploaded = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: uploaded
        ? { public_id: uploaded.public_id, 
          url: uploaded.secure_url 
        }
        : undefined,
    });

    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("registerUser error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Registration failed" });
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
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/reset/${resetToken}`;
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

// Reset password
export const resetPassword = async (req, res) => {
  try {
    // console.log("Reset token from params:", req.params.token);
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    const {password, confirmPassword} = req.body;
    if(password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get User Details
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // console.log("Fetched user:", user);
    // console.log("User ID from req.user:", req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const {oldPassword, newPassword, confirmPassword} = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const checkPasswordMatch = await user.comparePassword(oldPassword);
    if(!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }
    if(newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const {name, email,avatar} = req.body;
    const updateUserDetails = {
      name,
      email,
    }
    if(avatar!==""){
      const user = await User.findById(req.user.id);
      const imageId = user.avatar.public_id;
      await cloudinary.uploader.destroy(imageId);
      const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      updateUserDetails.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, { 
      new: true, 
      runValidators: true, 
      useFindAndModify: false 
    });
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - Getting user information
export const getUsersList = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error in getUsersList:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//Admin - Get single user details
export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with this ID : ${req.params.id}`,
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getSingleUserDetails:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - Update user role
export const updateUserRole = async (req, res) => {
  try {
    const {role} = req.body;
    const newUserData = {
      role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, { 
      new: true, 
      runValidators: true
    });
    if(!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with this ID : ${req.params.id}`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user
    });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Admin - Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with this ID : ${req.params.id}`,
      });
    }
    const imageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};