import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalQuantity } = useSelector((state) => state.cart);

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "Esewa",
  });

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.address) {
      alert("Please fill all required fields");
      return;
    }

    // Simulate Order Processing
    setTimeout(() => {
      alert("Order placed successfully!");
      dispatch(clearCart()); // Clear cart after successful order
      navigate("/order-confirmation");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-maroon mb-4">Checkout</h2>

      {/* User Details */}
      <div className="mb-4">
        <label className="block text-gray-700">Full Name</label>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={userInfo.phone}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Delivery Address</label>
        <textarea
          name="address"
          value={userInfo.address}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Payment Options */}
      <div className="mb-4">
        <label className="block text-gray-700">Payment Method</label>
        <select
          name="paymentMethod"
          value={userInfo.paymentMethod}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="Esewa">Esewa</option>
          <option value="Khalti">Khalti</option>
          <option value="Card">Credit/Debit Card</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <p>Total Items: {totalQuantity}</p>
        <p className="font-bold">
          Total Price: रु{" "}
          {cartItems.reduce(
            (total, item) =>
              total +
              item.quantity *
                (typeof item.price === "string"
                  ? parseInt(item.price.replace("₹", ""))
                  : item.price),
            0
          )}
        </p>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        className="w-full bg-maroon text-white py-2 rounded-lg hover:bg-dark-brown"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
