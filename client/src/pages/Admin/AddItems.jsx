import { useState } from "react";
import { FaUpload, FaEdit, FaTrash } from "react-icons/fa";

const AddItems = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Drinks");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [items, setItems] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName || !description || !price || !category || !image) {
      alert("Please fill all fields!");
      return;
    }

    const newItem = {
      id: Date.now(),
      itemName,
      description,
      price,
      category,
      image: preview,
    };

    setItems([...items, newItem]);
    handleClear();
  };

  const handleClear = () => {
    setItemName("");
    setDescription("");
    setPrice("");
    setCategory("Drinks");
    setImage(null);
    setPreview(null);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Add Item Form */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        ✨ Add Menu Items
      </h2>
      <form
        className="bg-white shadow-xl p-6 rounded-2xl border border-gray-200"
        onSubmit={handleSubmit}
      >
        {/* Image Upload */}
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
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Item Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter item description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Price ($)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Category
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Drinks">Drinks</option>
              <option value="Snacks">Snacks</option>
              <option value="Meals">Meals</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition-all"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Save
          </button>
        </div>
      </form>

      {/* List of Added Items */}
      <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-6 text-center">
        📋 Added Menu Items
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md p-5 rounded-lg flex flex-wrap sm:flex-nowrap items-center space-x-5 border border-gray-200"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.itemName}
              className="w-20 h-20 object-cover rounded-lg shadow-md"
            />

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-700 truncate">
                {item.itemName}
              </h3>
              <p className="text-gray-600 truncate">{item.description}</p>
              <p className="text-blue-500 font-bold">${item.price}</p>
              <p className="text-gray-500 text-sm">Category: {item.category}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 sm:justify-end w-full sm:w-auto mt-3 sm:mt-0">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all">
                <FaEdit />
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                onClick={() => handleDelete(item.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddItems;
