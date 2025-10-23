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
  }
})

export const { removeErrors, removeSuccess } = orderSlice.actions;

export default orderSlice.reducer;