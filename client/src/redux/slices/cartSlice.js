import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Get Auth Token
const getAuthToken = () => localStorage.getItem("authToken") || null;

// ✅ Fetch Cart from Backend
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8001/api/cart", {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        withCredentials: true, // ✅ Ensure session is used
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching cart");
    }
  }
);

// ✅ Add Item to Cart in Backend
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8001/api/cart/add",
        {
          itemId: item._id,
          name: item.name,
          price: item.price,
          img: item.image,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding item");
    }
  }
);

// ✅ Increase Item Quantity in Backend
export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8001/api/cart/increase/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error increasing quantity"
      );
    }
  }
);

// ✅ Decrease Item Quantity in Backend
export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8001/api/cart/decrease/${itemId}`, // `http://localhost:8001/api/cart/remove/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error decreasing item quantity"
      );
    }
  }
);

// ✅ Remove Item from Cart in Backend
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8001/api/cart/remove/${itemId}`,
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error removing item");
    }
  }
);

// ✅ Clear Cart in Backend (But Retain for User)
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        "http://localhost:8001/api/cart/clear",
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error clearing cart");
    }
  }
);

// ✅ Initialize cart state
const initialState = {
  cartItems: [],
  totalQuantity: 0,
  isAuthenticated: !!getAuthToken(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Set authentication status
    setAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Cart Data
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })

      // ✅ Add Item to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })

      // ✅ Increase Quantity
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })

      // ✅ Decrease Quantity
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })

      // ✅ Remove Item from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })

      // ✅ Clear Cart (Only clears if user manually removes items)
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
        state.totalQuantity = 0;
      });
  },
});

export const { setAuthentication } = cartSlice.actions;
export default cartSlice.reducer;
