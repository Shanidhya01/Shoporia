import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Creating Order Slice
export const createOrder = createAsyncThunk("order/createOrder",async (order, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post("/api/v1/new/order", order, config);
    console.log("Create Order Data:", data);
    return data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data || "Failed to create order. Please try again."
    );
  }
})

// Get User Orders 
export const getAllMyOrders = createAsyncThunk("order/getAllMyOrders",async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/v1/orders/user");
    // console.log("Get All My Orders Data:", data);
    return data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data || "Failed to get orders. Please try again."
    );
  }
})

// Get Order Details
export const getOrderDetails = createAsyncThunk("order/getOrderDetails",async (orderID, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/v1/order/${orderID}`);
    return data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data || "Failed to get order details. Please try again."
    );
  }
})

const orderSlice = createSlice({
  name: "order",
  initialState: {
    success: false,
    loading: false,
    error: null,
    orders: [],
    order: {},
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  }, 
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create order. Please try again.";
        state.success = false;
      });

    builder
      .addCase(getAllMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.orders = action.payload.orders;
      })
      .addCase(getAllMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get orders. Please try again.";
      });

      // Get Order Details
      builder
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.order = action.payload.order;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get order details. Please try again.";
      });
  }
})

export const { removeErrors, removeSuccess } = orderSlice.actions;

export default orderSlice.reducer;