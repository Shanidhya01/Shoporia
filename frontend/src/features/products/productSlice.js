import React from 'react'
import axios from 'axios';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getProduct = createAsyncThunk('product/getProduct',async(_,{rejectWithValue}) => {
  try {
    const link = `/api/v1/products`;
    const data = await axios.get(link);
    console.log('Response',data);
  } catch (error) {
    console.log(error);
    return rejectWithValue(error.response?.data || error.message);
  }
})

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        console.log('Fullfilled', action.payload);
        state.loading = false;
        state.products = action.payload.products;
        state.error = null;
        state.productCount = action.payload.productCount;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;