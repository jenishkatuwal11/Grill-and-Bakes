import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    logout(state) {
      state.user = null;
      state.role = null;

      // Ensure correct token removal based on role
      localStorage.removeItem("userAuthToken");
      localStorage.removeItem("adminAuthToken");

      // Extra security to remove only auth-related session data
      sessionStorage.removeItem("userSession");
      sessionStorage.removeItem("adminSession");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
