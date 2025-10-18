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
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
      state.success = false;
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
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
          // ✅ Increase quantity if item exists
          existingItem.quantity += item.quantity;
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

export const { removeErrors, removeMessage, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
