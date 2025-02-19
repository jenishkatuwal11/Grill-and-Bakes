import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import cartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, //  added auth reducer for authentication
    cart: cartReducer, //  Add Cart Reducer
  },
});

export default store;
