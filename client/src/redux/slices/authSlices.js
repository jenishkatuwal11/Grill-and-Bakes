import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
  },
  reducers: {
    setUser(state, action) {
      if (!action.payload || !action.payload.user) {
        console.error(
          "Error: Invalid user data received in setUser",
          action.payload
        );
        return;
      }
      state.user = action.payload.user;
      state.role = action.payload.role;

      // ✅ Store session separately for security
      if (state.role === "admin") {
        localStorage.setItem("adminAuthToken", action.payload.user._id);
        sessionStorage.setItem(
          "adminSession",
          JSON.stringify(action.payload.user)
        );
      } else {
        localStorage.setItem("userAuthToken", action.payload.user._id);
        sessionStorage.setItem(
          "userSession",
          JSON.stringify(action.payload.user)
        );
      }
    },

    logout(state) {
      if (state.role === "admin") {
        localStorage.removeItem("adminAuthToken");
        sessionStorage.removeItem("adminSession");
      } else {
        localStorage.removeItem("userAuthToken");
        sessionStorage.removeItem("userSession");
      }

      // ✅ Reset state
      state.user = null;
      state.role = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
