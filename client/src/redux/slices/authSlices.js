import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    admin: null,
    token: localStorage.getItem("authToken") || null,
    adminToken: localStorage.getItem("adminToken") || null,
  },
  reducers: {
    setUser(state, action) {
      const { user, token } = action.payload || {};

      if (!user || !token) {
        console.error(
          " Error: Invalid user data received in setUser",
          action.payload
        );
        return;
      }

      if (user.role === "admin") {
        state.admin = user;
        state.adminToken = token;
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminData", JSON.stringify({ user }));
      } else {
        state.user = user;
        state.token = token;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify({ user }));
      }
    },

    logout(state, action) {
      const role = action.payload;

      if (role === "admin") {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        state.admin = null;
        state.adminToken = null;
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        state.user = null;
        state.token = null;
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
