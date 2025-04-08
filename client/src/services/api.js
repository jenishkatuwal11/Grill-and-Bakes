import axios from "axios";
import { logoutUser } from "./authService"; // Ensure logout clears expired tokens

const API = axios.create({
  baseURL: "http://localhost:8001/api",
  withCredentials: true, //  Allow cookies (if needed)
});

// Attach JWT Token to all requests automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration automatically
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn(" Token expired or unauthorized access!");
      logoutUser(); // Clear invalid token & logout user
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

//  Fetch Items
export const fetchItems = async () => {
  const response = await API.get("/items");
  return response.data;
};

//  Add Item (Requires Admin JWT Token)
export const addItem = async (itemData) => {
  await API.post("/items/add", itemData);
};

//  Edit Item (Requires Admin JWT Token)
export const editItem = async (id, updatedData) => {
  await API.put(`/items/${id}`, updatedData);
};

//  Delete Item (Requires Admin JWT Token)
export const deleteItem = async (id) => {
  await API.delete(`/items/${id}`);
};

export default API;
