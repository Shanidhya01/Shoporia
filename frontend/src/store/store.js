import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    // adminProducts: adminProductsSlice,
    // adminOrder: adminOrderSlice,

    // shopProducts: shopProductsSlice,
    // shopCart: shopCartSlice,
    // shopAddress: shopAddressSlice,
    // shopOrder: shopOrderSlice,
    // shopSearch: shopSearchSlice,
    // shopReview: shopReviewSlice,

    // commonFeature: commonFeatureSlice,
  },
});

export default store;