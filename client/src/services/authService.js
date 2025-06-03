import API from "./api";
import { setUser, logout } from "../redux/slices/authSlices";
import { jwtDecode } from "jwt-decode";

//  Extract user from JWT Token
const extractUserFromToken = (token) => {
  try {
    return jwtDecode(token); // Decode the JWT Token
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

//  Register User
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data; //  Don't auto-login
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error.response?.data || { message: "Registration failed" };
  }
};

//  Login User
export const loginUser = async (credentials, dispatch) => {
  try {
    const response = await API.post("/auth/login", credentials);

    const { token } = response.data;

    if (token) {
      const user = extractUserFromToken(token);

      //  Store user data properly
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify({ user }));

      dispatch(setUser({ user, token }));
    }

    return response.data;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error.response?.data || { message: "Login failed" };
  }
};

export const loginAdmin = async (credentials, dispatch, navigate) => {
  try {
    const response = await API.post("/auth/admin/login", credentials);
    console.log(" Admin Login Response:", response.data);

    const { adminToken, user } = response.data; // Ensure both values exist

    if (!adminToken || !user) {
      console.error(" Missing adminToken or user data in API response");
      return;
    }

    //  Ensure adminToken is stored properly
    localStorage.setItem("adminToken", adminToken);
    localStorage.setItem("adminData", JSON.stringify({ user }));

    //  Dispatch admin data to Redux store
    dispatch(setUser({ user, token: adminToken }));

    //  Redirect to admin dashboard
    navigate("/admin/dashboard");
  } catch (error) {
    console.error(" Error in loginAdmin:", error);
  }
};

//  Logout User
export const logoutUser = (dispatch) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  dispatch(logout());
};

//  Logout Admin
export const logoutAdmin = (dispatch) => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminData");
  dispatch(logout());
};
