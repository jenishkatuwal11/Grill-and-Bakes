import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // Stores cart items
  totalQuantity: 0, // Total number of items in cart
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item.name === action.payload.name
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }

      state.totalQuantity += 1;
    },

    removeFromCart: (state, action) => {
      const index = state.cartItems.findIndex(
        (item) => item.name === action.payload.name
      );

      if (index !== -1) {
        const item = state.cartItems[index];
        state.totalQuantity -= item.quantity;
        state.cartItems.splice(index, 1);
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item.name === action.payload);
      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item.name === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
      } else {
        // Remove item if quantity is 0
        state.cartItems = state.cartItems.filter(
          (item) => item.name !== action.payload
        );
        state.totalQuantity -= 1;
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
