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

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    success: false,
    error: null,
    loading: false,
    product: {},
    deleting: {},
  },
  reducers: {
    removeErrors : (state) => {
      state.error = null;
    },
    removeSuccess : (state) => {
      state.success = false;
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
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;
export default adminSlice.reducer;