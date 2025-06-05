import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { placeOrder } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import OrderSuccessModal from "../../components/OrderSuccessModal/OrderSuccessModal";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalQuantity } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.quantity * parseFloat(item.price),
    0
  );

  const [userInfo, setUserInfo] = useState({
    name: user?.username || "",
    phone: "",
    address: "",
    paymentMethod: "Cash On Delivery",
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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
        itemId: item.itemId || item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        customizations: item.customizations || {},
      })),
      totalPrice: totalAmount,
      contact: userInfo.phone,
      address: userInfo.address,
    };

    //  Khalti Payment Flow
    if (userInfo.paymentMethod === "Khalti") {
      const returnUrl = `${window.location.origin}/payment-success`;

      //  Store order data in localStorage instead of URL
      localStorage.setItem("pendingOrder", JSON.stringify(orderData));

      console.log("Sending to Khalti backend:", {
        amount: totalAmount * 100,
        return_url: returnUrl,
      });

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/payment/khalti/initiate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: totalAmount * 100,
              return_url: returnUrl,
            }),
          }
        );

        const data = await response.json();

        if (data && data.payment_url) {
          // Store order data before redirecting
          localStorage.setItem("pendingOrder", JSON.stringify(orderData));
          window.location.href = data.payment_url;
          return;
        } else {
          alert("Failed to initialize Khalti payment.");
        }
      } catch (error) {
        console.error("Khalti Payment Error:", error);
        alert("Error occurred during Khalti payment.");
      }

      return;
    }

    //  Cash On Delivery Flow
    try {
      setLoading(true);
      await dispatch(placeOrder(orderData)).unwrap();
      setOrderSuccess(true);
      dispatch(clearCart());
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

      {/* Payment Method Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700">Payment Method</label>
        <select
          name="paymentMethod"
          value={userInfo.paymentMethod}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="Cash On Delivery">Cash On Delivery</option>
          <option value="Khalti">Khalti</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <p>Total Items: {totalQuantity}</p>
        <p className="font-bold">Total Price: रु {totalAmount.toFixed(2)}</p>
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
