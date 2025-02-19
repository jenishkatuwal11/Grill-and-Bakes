import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slices/cartSlice";
import PropTypes from "prop-types";

const CartModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cartItems, totalQuantity } = useSelector((state) => state.cart);

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity * parseInt(item.price.replace("₹", "")),
      0
    );
  };

  if (!isOpen) return null;

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

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-maroon font-bold">{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className="w-8 h-8 text-white bg-red-500 rounded-full hover:bg-red-600"
                    onClick={() => dispatch(decreaseQuantity(item.name))}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    className="w-8 h-8 text-white bg-green-500 rounded-full hover:bg-green-600"
                    onClick={() => dispatch(increaseQuantity(item.name))}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="w-8 h-8 text-red-500 hover:text-dark-brown transition"
                    onClick={() => dispatch(removeFromCart(item))}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total Items: {totalQuantity}</span>
              <span>Total: ₹{calculateTotalPrice()}</span>
            </div>

            <button
              className="w-full py-2 text-white bg-maroon rounded-lg hover:bg-dark-brown transition"
              onClick={() => dispatch(clearCart())}
            >
              Checkout
            </button>
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
