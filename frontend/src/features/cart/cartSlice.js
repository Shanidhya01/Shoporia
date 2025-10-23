import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Add item to Cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      console.log("Add to Cart Data:", data);
      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add item to cart. Please try again."
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    loading: false,
    error: null,
    success: false,
    message: null,
    removingId: null,
    shippingInfo : JSON.parse(localStorage.getItem("shippingInfo")) || {}
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
      state.success = false;
    },
    removeItemFromCart: (state, action) => {
      const itemId = action.payload;
      state.removingId = itemId;
      state.cartItems = state.cartItems.filter((item) => item.product != itemId);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.removingId = null;
    },
    saveShippingInfo : (state,action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo",JSON.stringify(state.shippingInfo));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingInfo");
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const existingItem = state.cartItems.find(
          (i) => i.product === item.product
        );

        if (existingItem) {
          // ✅ Increase quantity if already in cart, but do not exceed stock
          const newQuantity = existingItem.quantity + item.quantity;
          existingItem.quantity = newQuantity > item.stock ? item.stock : newQuantity;
          state.message = `${item.name} quantity updated in cart successfully.`;
        } else {
          // ✅ Only push once if item is new
          state.cartItems.push(item);
          state.message = `${item.name} added to cart successfully.`;
        }

        // ✅ Update localStorage after changes
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));

        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Failed to add item to cart. Please try again.";
      });
  },
});

export const { removeErrors, removeMessage, clearCart, removeItemFromCart, saveShippingInfo } = cartSlice.actions;
export default cartSlice.reducer;
