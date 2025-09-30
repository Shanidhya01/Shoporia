import Product from "../models/productModel.js";
import mongoose from "mongoose"; // <-- add this

// 1 - Create Product
export const createProduct = async (req, res) => {
  try {
    req.body.user = req.user.id; // Add user ID to the request body
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// 2 - Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // Build filters (adjust fields to your schema)
    const filter = {};
    if (req.query.keyword) {
      filter.title = { $regex: req.query.keyword, $options: "i" };
    }
    if (req.query.category) filter.category = req.query.category;
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const [total, filtered, products] = await Promise.all([
      Product.estimatedDocumentCount(),
      Product.countDocuments(filter),
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return res.json({
      success: true,
      pagination: { page, limit, total, filtered },
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("getAllProducts error:", err);
    return res.status(500).json({ success: false, message: "Fetch products failed" });
  }
};

// 3 - UPDATE Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          // return the updated document
        runValidators: true // run schema validators
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 4 - DELETE Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//5 - Accessing Single Product Details
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch product",
    });
  }
};

// 6 - Create or Update Product Review
export const createReviewForProduct = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const reviewExists = product.reviews.find(review => review.user.toString() === req.user.id.toString());
    if (reviewExists) {
      // Update existing review
      product.reviews.forEach(review => {
        if (review.user.toString() === req.user.id.toString()) {
          review.rating = rating;
          review.comment = comment;
        }
      });
    } else {
      // Create new review
      product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    let avg = 0;
    product.reviews.forEach(review => {
      avg += review.rating;
    });
    product.ratings = product.reviews.length === 0 ? 0 : avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "Review created/updated successfully",
      product,
    });
  } catch (error) {
    console.error("createReviewForProduct error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create/update review",
    });
  }
}

//7 Getting Reviews
export const getProductReviews = async (req, res) => {
  try {
    const id = req.params.id || req.query.productId || req.query.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(id).select("reviews ratings numOfReviews");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      reviews: product.reviews || [],
      ratings: product.ratings || 0,
      numOfReviews: product.numOfReviews || 0,
    });
  } catch (error) {
    console.error("getProductReviews error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch product reviews" });
  }
};

//8 Deleting Reviews
export const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    let avg = 0;
    reviews.forEach(review => {
      avg += review.rating;
    });
    const ratings = reviews.length === 0 ? 0 : avg / reviews.length;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
      reviews, 
      ratings, 
      numOfReviews
    }, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("deleteReview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
}

//9  Admin - Get All Products (Admin)
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("getAdminProducts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin products",
    });
  }
}