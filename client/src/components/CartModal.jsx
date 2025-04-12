import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, totalQuantity } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(
        item.price?.toString().replace("रु", "").trim() || 0
      );
      return total + item.quantity * price;
    }, 0);
  };

  if (!isOpen) return null;

  const renderCustomizations = (customizations) => {
    if (!customizations || typeof customizations !== "object") return null;

    const hasCustoms = Object.values(customizations).some(
      (val) =>
        (Array.isArray(val) && val.length > 0) || (!Array.isArray(val) && val)
    );

    if (!hasCustoms) return null;

    return (
      <ul className="text-xs text-gray-600 list-disc ml-4 mt-1">
        {Object.entries(customizations).map(([key, value]) => {
          if (!value || (Array.isArray(value) && value.length === 0))
            return null;

          const formattedKey =
            key.charAt(0).toUpperCase() +
            key.slice(1).replace(/([A-Z])/g, " $1");
          const displayValue = Array.isArray(value) ? value.join(", ") : value;

          return (
            <li key={key}>
              <span className="font-medium text-gray-700">{formattedKey}:</span>{" "}
              {displayValue}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h2>

        {!isAuthenticated ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              You must be logged in to view your cart.
            </p>
            <button
              onClick={() => {
                onClose();
                navigate("/login");
              }}
              className="bg-maroon text-white py-2 px-4 rounded-lg hover:bg-dark-brown transition"
            >
              Login to Continue
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-start border-b pb-2"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={
                      item.img
                        ? item.img.startsWith("/")
                          ? `http://localhost:8001${item.img}`
                          : item.img
                        : "fallback-image.jpg"
                    }
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover"
                    onError={(e) => (e.target.src = "fallback-image.jpg")}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    {renderCustomizations(item.customizations)}
                    <p className="text-maroon font-bold mt-1">
                      रु {item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center text-white bg-red-500 rounded-full hover:bg-red-600"
                    onClick={() => dispatch(decreaseQuantity(item.itemId))}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center text-white bg-green-500 rounded-full hover:bg-green-600"
                    onClick={() => dispatch(increaseQuantity(item.itemId))}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-dark-brown transition"
                    onClick={() => dispatch(removeFromCart(item.itemId))}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total Items: {totalQuantity}</span>
              <span>Total: रु {calculateTotalPrice()}</span>
            </div>

            <div className="flex flex-col space-y-3 mt-4">
              <button
                className="w-full py-2 text-white bg-maroon rounded-lg hover:bg-dark-brown transition"
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
              >
                Proceed to Checkout
              </button>
              <button
                className="w-full py-2 text-maroon border border-maroon rounded-lg hover:bg-red-100 transition"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CartModal;
