import Order from "../models/orderModel.js"; // fix: add .js
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// 1 - Create New Order
export const createNewOrder = async (req, res) => {
  try {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

//2 - Get Single Order
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if(!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

//3 - All my Orders
export const allMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if(!orders) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

//4 - Get All Orders -- Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
      totalAmount += order.totalPrice;
    });
    res.status(200).json({
      success: true,
      orders,
      totalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}