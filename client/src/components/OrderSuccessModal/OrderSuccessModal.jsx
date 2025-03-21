import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg max-w-sm">
        {/*  Success Icon */}
        <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />

        {/*  Success Message */}
        <h2 className="text-xl font-bold mb-2">Success</h2>
        <p className="text-gray-600 mb-4">
          Order placed successfully. Kindly check your order to view the
          status.Food’s On the Way!
        </p>

        {/*  Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
            onClick={() => {
              onClose(); // Close Modal
              navigate("/my-orders"); // Redirect to MyOrders Page
            }}
          >
            View Order
          </button>

          <button
            className="text-green-600 font-bold hover:text-green-700 transition"
            onClick={() => {
              onClose(); // Close Modal
              navigate("/"); // Redirect to HomePage
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

OrderSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderSuccessModal;
