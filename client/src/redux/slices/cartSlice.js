import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

// Get Auth Token
const getAuthToken = () => localStorage.getItem("authToken") || null;

// Utility to calculate additional cost based on customizations
const calculateCustomizationCost = (item) => {
  const defaults = {
    "Iced Blended Caramel Frappe": {
      milk: "Whole milk",
      sweetness: "Regular",
      ice: "Regular ice",
      caramel: " ",
      whippedCream: "With whipped cream",
    },
    "Cafe Mocha Madness": {
      milk: "Whole milk",
      espresso: "Double shot",
      sweetness: "Regular",
      chocolate: "Dark chocolate",
    },
  };

  const pricePerCustomization = 10;
  let additionalCost = 0;
  const selected = item.customizations || {};
  const drinkDefaults = defaults[item.name] || {};

  for (const key in selected) {
    if (key === "toppings" && Array.isArray(selected.toppings)) {
      additionalCost += selected.toppings.length * pricePerCustomization;
    } else if (
      selected[key] &&
      drinkDefaults[key] &&
      selected[key] !== drinkDefaults[key]
    ) {
      additionalCost += pricePerCustomization;
    }
  }

  return additionalCost;
};

// Fetch Cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching cart");
    }
  }
);

// Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, { rejectWithValue }) => {
    try {
      // If item.price is already customized (from modal), don't add again
      const extraCost = item.customizations
        ? calculateCustomizationCost(item)
        : 0;

      const finalPrice =
        item.customizations && item.price
          ? item.price // already has customization cost included
          : item.price + extraCost;

      const response = await axios.post(
        `${BASE_URL}/cart/add`,
        {
          itemId: item._id,
          name: item.name,
          price: finalPrice,
          img: item.image,
          quantity: 1,
          customizations: item.customizations || {},
          customizationCost: extraCost,
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

// Increase Quantity
export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/cart/increase/${itemId}`,
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

// Decrease Quantity
export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/cart/decrease/${itemId}`,
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

// Remove Item
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error removing item");
    }
  }
);

// Clear Cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error clearing cart");
    }
  }
);

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  isAuthenticated: !!getAuthToken(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
        state.totalQuantity = 0;
      });
  },
});

export const { setAuthentication } = cartSlice.actions;
export default cartSlice.reducer;
