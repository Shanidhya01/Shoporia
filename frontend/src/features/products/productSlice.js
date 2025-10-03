import React from 'react'
import axios from 'axios';


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getProduct = createAsyncThunk('product/getProduct',async({keyword},{rejectWithValue}) => {
  try {
    const link = keyword ? `/api/v1/products?keyword=${encodeURIComponent(keyword)}` : `/api/v1/products`;
    console.log('Link',link);
    const data = await axios.get(link);
    console.log('Response',data);
    return data.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error.response?.data || error.message);
  }
})

// product details
export const getProductDetails = createAsyncThunk('product/getProductDetails',async(id,{rejectWithValue}) => {
  try {
    const link = `/api/v1/product/${id}`;
    const data = await axios.get(link);
    // console.log('Response',data);
    return data.data;
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
    product: null
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

    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        console.log('Fullfilled', action.payload);
        state.loading = false;
        state.product = action.payload.product;
        state.error = null;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;