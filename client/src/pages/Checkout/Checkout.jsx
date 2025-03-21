import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { placeOrder } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import OrderSuccessModal from "../../components/OrderSuccessModal/OrderSuccessModal"; // ✅ Import Success Modal

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalQuantity } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [userInfo, setUserInfo] = useState({
    name: user?.username || "",
    phone: "",
    address: "",
    paymentMethod: "Cash On Delivery",
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false); //  Success state

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("You need to log in to place an order.");
      return navigate("/login");
    }

    if (!userInfo.name || !userInfo.phone || !userInfo.address) {
      alert("Please fill all required fields.");
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        itemId: item.itemId || item._id, // Ensure correct ID
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: cartItems.reduce(
        (total, item) => total + item.quantity * parseFloat(item.price),
        0
      ),
      contact: userInfo.phone,
      address: userInfo.address,
    };

    try {
      setLoading(true);
      await dispatch(placeOrder(orderData)).unwrap(); //  Dispatch Redux action

      setOrderSuccess(true); //  Show Success Modal
      dispatch(clearCart()); //  Clear cart after successful order
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-maroon mb-4">Checkout</h2>

      {/*  Success Modal */}
      <OrderSuccessModal
        isOpen={orderSuccess}
        onClose={() => setOrderSuccess(false)}
      />

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
          <option value="Cash On Delivery">Cash On Delivery</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <p>Total Items: {totalQuantity}</p>
        <p className="font-bold">
          Total Price: रु{" "}
          {cartItems.reduce(
            (total, item) => total + item.quantity * parseFloat(item.price),
            0
          )}
        </p>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        className="w-full bg-maroon text-white py-2 rounded-lg hover:bg-dark-brown"
        disabled={loading}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
