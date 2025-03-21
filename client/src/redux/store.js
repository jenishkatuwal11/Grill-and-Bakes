import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, //  added auth reducer for authentication
    cart: cartReducer, //  Add Cart Reducer
    orders: orderReducer, // Add Order Reducer
  },
});

export default store;
