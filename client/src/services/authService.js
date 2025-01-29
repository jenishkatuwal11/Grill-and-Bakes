import API from "./api";

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials); // Using API instead of API_URL
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};
