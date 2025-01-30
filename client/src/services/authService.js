import API from "./api";

// Register User
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials); // API call to login endpoint

    // Extract token and user data from the response
    const { token, user } = response.data;

    // Save the token in localStorage for persistence
    localStorage.setItem("authToken", token);

    // Return the user data for further use
    return { user, token };
  } catch (error) {
    console.error("Error in loginUser:", error); // Log error for debugging
    throw error.response?.data || { message: "An error occurred" };
  }
};

// Logout User (Optional)
export const logoutUser = () => {
  localStorage.removeItem("authToken");
};
