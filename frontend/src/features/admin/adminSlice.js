import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch All Products
export const fetchAdminProducts = createAsyncThunk("admin/fetchAdminProducts", async (_, { rejectWithValue }) => {
  try {
      const { data } = await axios.get("/api/v1/admin/products");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get products. Please try again.");
    }
  }
);

// Create Products
export const createProduct = createAsyncThunk("admin/createProduct", async (productData, { rejectWithValue }) => {
  try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      const { data } = await axios.post("/api/v1/admin/product/create", productData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create product. Please try again.");
    }
  }
);

// Update Products
export const updateProduct = createAsyncThunk("admin/updateProduct", async ({id, formData}, { rejectWithValue }) => {
  try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      const { data } = await axios.put(`/api/v1/admin/product/${id}`, formData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update product. Please try again.");
    }
  }
);

// Delete Products
export const deleteProduct = createAsyncThunk("admin/deleteProduct", async (productId, { rejectWithValue }) => {
  try {
      const { data } = await axios.delete(`/api/v1/admin/product/${productId}`);
      return { productId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete product. Please try again.");
    }
  }
);

// fetch all user
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
      const { data } = await axios.get("/api/v1/admin/users");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get users. Please try again.");
    }
  }
);

// get single user details
export const getSingleUser = createAsyncThunk("admin/getSingleUser", async (userId, { rejectWithValue }) => {
  try {
      const { data } = await axios.get(`/api/v1/admin/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get user. Please try again.");
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk("admin/updateUserRole", async ({userId, role}, { rejectWithValue }) => {
  try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }
      const { data } = await axios.put(`/api/v1/admin/user/${userId}`, {role}, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update user. Please try again.");
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (userId, { rejectWithValue }) => {
  try {
      const { data } = await axios.delete(`/api/v1/admin/user/${userId}`);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete user. Please try again.");
    }
  }
);

// Fetch All Orders
export const fetchAllOrders = createAsyncThunk("admin/fetchAllOrders", async (_, { rejectWithValue }) => {
  try {
      const { data } = await axios.get("/api/v1/admin/orders");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get orders. Please try again.");
    }
  }
);

// Delete Order
export const deleteOrder = createAsyncThunk("admin/deleteOrder", async (id, { rejectWithValue }) => {
  try {
      const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete order. Please try again.");
    }
  }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk("admin/updateOrderStatus", async ({orderId, status}, { rejectWithValue }) => {
  try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }
      const { data } = await axios.put(`/api/v1/admin/order/${orderId}`, {status}, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update order. Please try again.");
    }
  }
);

// Fetch All Reviews of a Product
export const fetchProductReviews = createAsyncThunk("admin/fetchProductReviews", async (productId, { rejectWithValue }) => {
  try {
      const { data } = await axios.get(`/api/v1/admin/reviews/?id=${productId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get reviews. Please try again.");
    }
  }
);

// Delete Review
export const deleteReview = createAsyncThunk("admin/deleteReview", async ({productId, reviewId}, { rejectWithValue }) => {
  try {
      const { data } = await axios.delete(`/api/v1/admin/reviews/?productId=${productId}&id=${reviewId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete review. Please try again.");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    success: false,
    error: null,
    loading: false,
    product: {},
    deleting: {},
    users: [],
    user: {},
    message: null,
    orders: [],
    totalAmount:0,
    order: {},
    reviews : [],
  },
  reducers: {
    removeErrors : (state) => {
      state.error = null;
    },
    removeSuccess : (state) => {
      state.success = false;
    },
    clearMessage : (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get products. Please try again.";
      });

      builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.products.push(action.payload.product);
        console.log("Product created:", action.products);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create product. Please try again.";
      });

      builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.product = action.payload.product;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update product. Please try again.";
      });

      builder
      .addCase(deleteProduct.pending, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        state.deleting[productId] = false; // Set loading state to false when deletion is successful
        state.products = state.products.filter((product) => product._id !== productId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = false;
        state.error = action.payload || "Failed to delete product. Please try again.";
      });

      builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get users. Please try again.";
      });

      builder
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get user. Please try again.";
      });

      builder
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user. Please try again.";
      });

      builder
      .addCase(deleteUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "User deleted successfully";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete user. Please try again.";
      });

      builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;        
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get orders. Please try again.";
      });

      builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message || "Order deleted successfully";
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete order. Please try again.";
      });

      builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.order = action.payload.order;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update order status. Please try again.";
      });

      builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get reviews. Please try again.";
      });

      builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;        
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message || "Review deleted successfully";
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete review. Please try again.";
      });
  },
});

export const { removeErrors, removeSuccess, clearMessage } = adminSlice.actions;
export default adminSlice.reducer;