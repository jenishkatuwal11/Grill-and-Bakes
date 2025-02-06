import API from "./api";
import { setUser } from "../redux/slices/authSlices";

// Register User
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login User
export const loginUser = async (credentials, dispatch) => {
  try {
    const response = await API.post("/auth/login", credentials); // API call to login endpoint

    // Extract token and user data from the response
    const { token, user } = response.data;

    // Check the role and store the token appropriately
    if (user.role === "user") {
      localStorage.setItem("userAuthToken", token);
      localStorage.removeItem("adminAuthToken");
    } else if (user.role === "admin") {
      localStorage.setItem("adminAuthToken", token);
      localStorage.removeItem("userAuthToken");
    }

    //  Dispatch user data to Redux **instantly**
    dispatch(setUser({ user, role: user.role }));

    return { user, token };
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error.response?.data || { message: "An error occurred" };
  }
};
// Login Admin
export const loginAdmin = async (credentials, dispatch) => {
  // Accept dispatch
  try {
    const response = await API.post("/auth/admin/login", credentials);

    const { token, user } = response.data;

    // Save admin token and remove user token
    localStorage.setItem("adminAuthToken", token);
    localStorage.removeItem("userAuthToken");

    // Dispatch admin data to Redux store
    dispatch(setUser({ user, role: "admin" }));

    return { user, token };
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    throw error.response?.data || { message: "An error occurred" };
  }
};

// Logout User/Admin
export const logoutUser = () => {
  localStorage.removeItem("userAuthToken");
  localStorage.removeItem("adminAuthToken");
};
