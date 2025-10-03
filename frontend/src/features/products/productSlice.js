import React from 'react'
import axios from 'axios';


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getProduct = createAsyncThunk('product/getProduct',async({keyword,page=1,category},{rejectWithValue}) => {
  try {
    let link = 'api/v1/products?page=' + page;
    if (keyword) link += `&keyword=${encodeURIComponent(keyword)}`;
    if (category) link += `&category=${encodeURIComponent(category)}`;
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
    loading: false,
    error: null,

    // pagination
    page: 1,
    resultPerPage: 4,
    total: 0,       // total products in DB
    filtered: 0,    // total products matching current filter
    totalPages: 1,

    // keep compatibility if your UI reads this
    productCount: 0,
    product: null,
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
        console.log('Fullfilled ', action.payload);
        state.loading = false;
        state.error = null;

        state.products = action.payload.products || [];

        const p = action.payload.pagination || {};
        state.page = Number(p.page) || 1;
        state.resultPerPage = Number(p.resultPerPage) || state.resultPerPage;

        state.total = Number(p.total) || 0;
        state.filtered = Number(p.filtered) || state.products.length;

        // for legacy UIs that read productCount
        state.productCount = state.filtered;

        state.totalPages = Math.max(
          1,
          Math.ceil((state.filtered || 0) / (state.resultPerPage || 1))
        );
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.products = [];
        state.filtered = 0;
        state.totalPages = 1;
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