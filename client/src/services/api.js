import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8001/api",
  withCredentials: true, // ✅ Ensure cookies are sent
});

export const fetchItems = async () => {
  const response = await API.get("/items");
  return response.data;
};

export const addItem = async (itemData) => {
  await API.post("/items/add", itemData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`,
    },
  });
};

export const editItem = async (id, updatedData) => {
  await API.put(`/items/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`,
    },
  });
};

export const deleteItem = async (id) => {
  await API.delete(`/items/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`,
    },
  });
};

export default API;
