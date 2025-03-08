import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // ✅ Import PropTypes
import { FaUpload, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const AddItems = ({ updateHomepage }) => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Drinks");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);

  // Applying Filter
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Delete Confirmation Modal State
  const [showModal, setShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Add empty string to avoid infinite loop of fetching data

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/items");
      setItems(response.data.items || []);
      if (updateHomepage) updateHomepage();
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !description || !price || !category) {
      alert("Please fill all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Admin token is missing");

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      if (editId) {
        await axios.put(
          `http://localhost:8001/api/items/update/${editId}`,
          formData,
          { headers }
        );
      } else {
        await axios.post("http://localhost:8001/api/items/add", formData, {
          headers,
        });
      }

      await fetchItems();
      handleClear();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // ✅ Open Delete Confirmation Modal
  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Admin token is missing");

      await axios.delete(
        `http://localhost:8001/api/items/delete/${deleteItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== deleteItemId)
      );
      if (updateHomepage) updateHomepage();
    } catch (error) {
      console.error("Error deleting item:", error);
    }

    setShowModal(false);
  };

  const handleEdit = (item) => {
    setItemName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setPreview(
      item.image.startsWith("http")
        ? item.image
        : `http://localhost:8001${item.image}`
    );
    setEditId(item._id);
  };

  const handleClear = () => {
    setItemName("");
    setDescription("");
    setPrice("");
    setCategory("Drinks");
    setImage(null);
    setPreview(null);
    setEditId(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handling filter
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        ✨ {editId ? "Edit" : "Add"} Menu Item
      </h2>
      <form
        className="bg-white shadow-xl p-6 rounded-2xl border border-gray-200"
        onSubmit={handleSubmit}
      >
        {/* ✅ Image Upload */}
        <div className="flex flex-col items-center mb-6">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-32 h-32 border-2 border-gray-300 flex items-center justify-center rounded-lg">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <label className="mt-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-5 py-2 rounded-lg cursor-pointer flex items-center space-x-2 hover:shadow-lg transition-all">
            <FaUpload /> <span>Upload Image</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* ✅ Form Fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Enter item description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Drinks">Custom Drinks</option>
            <option value="Chef Favorite">Chef Favorite</option>
            <option value="Beverages">Beverages</option>
            <option value="Meals">Meals</option>
          </select>
        </div>

        {/* ✅ Form Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition-all"
            onClick={handleClear}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            {editId ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {/* ✅ Filter Dropdown */}
      <div className="flex justify-end mt-6">
        <select
          className="border border-gray-300 p-2 rounded-lg"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Drinks">Custom Drinks</option>
          <option value="Chef Favorite">Chef Favorite</option>
          <option value="Beverages">Beverages</option>
          <option value="Meals">Meals</option>
        </select>
      </div>

      {/* ✅ Menu Items List */}
      <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-6 text-center">
        📋 Menu Items
      </h2>
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md p-5 rounded-lg flex items-center space-x-5 border border-gray-200"
            >
              <img
                src={`http://localhost:8001${item.image}`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p>{item.description}</p>
                <p className="text-blue-500 font-bold">रु{item.price}</p>
              </div>
              <button
                onClick={() => handleEdit(item)}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteClick(item._id)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No items found.</p>
        )}
      </div>

      {/* ✅ Fancy Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">You cannot undo this action.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Prop Validation
AddItems.propTypes = {
  updateHomepage: PropTypes.func.isRequired,
};

export default AddItems;
