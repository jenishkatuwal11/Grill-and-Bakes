import API from "./api";
import { setUser } from "../redux/slices/authSlices";

// ✅ Register User
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// ✅ Fetch User Data (New Function)
export const fetchUser = async (dispatch) => {
  try {
    const response = await API.get("/auth/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    // ✅ Dispatch the user details to Redux
    dispatch(setUser({ user: response.data.user }));
  } catch (error) {
    console.error("Error fetching user data:", error);
    dispatch(setUser({ user: null })); // Clear user state if request fails
  }
};

// ✅ Login User
export const loginUser = async (credentials, dispatch) => {
  try {
    const response = await API.post("/auth/login", credentials);

    // ✅ Store only the token
    localStorage.setItem("authToken", response.data.token);

    // ✅ Fetch user details after login
    await fetchUser(dispatch);

    return response.data;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error.response?.data || { message: "An error occurred" };
  }
};

// ✅ Login Admin
export const loginAdmin = async (credentials, dispatch) => {
  try {
    const response = await API.post("/auth/admin/login", credentials);

    // ✅ Store only the token
    localStorage.setItem("authToken", response.data.token);

    // ✅ Fetch user details after login
    await fetchUser(dispatch);

    return response.data;
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    throw error.response?.data || { message: "An error occurred" };
  }
};

// ✅ Logout User/Admin
export const logoutUser = (dispatch) => {
  localStorage.removeItem("authToken");
  dispatch(setUser({ user: null })); // Clear user state in Redux
};
