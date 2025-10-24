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

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    success: false,
    error: null,
    loading: false,
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
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;
export default adminSlice.reducer;