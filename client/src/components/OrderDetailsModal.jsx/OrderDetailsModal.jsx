import PropTypes from "prop-types";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUtensils,
  FaTimes,
} from "react-icons/fa";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="px-4 py-3 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">Order Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* Order ID and Date */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-medium">{order._id}</p>
            {order.createdAt && (
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(order.createdAt)}
              </p>
            )}
          </div>

          {/* Customer Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Customer Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-2" />
                <span>{order.user?.username || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-2" />
                <span className="break-all">{order.user?.email || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-400 mr-2" />
                <span>{order.contact || "N/A"}</span>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                <span className="break-words">{order.address || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h4 className="font-medium mb-2 flex items-center">
              <FaUtensils className="mr-2" /> Items Ordered
            </h4>
            <div className="border rounded-md overflow-hidden">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 ${
                    index !== order.items.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {item.product?.name || "Unknown Item"}
                    </p>
                    <p className="font-medium">रु {item.price}</p>
                  </div>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-4 pt-2 border-t flex justify-between items-center">
            <h4 className="font-medium flex items-center">
              <FaRupeeSign className="mr-1" /> Total Amount
            </h4>
            <p className="text-lg font-bold">रु {order.totalPrice}</p>
          </div>
        </div>

        {/* Footer with close button */}
        <div className="p-4 border-t sticky bottom-0 bg-white">
          <button
            className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

OrderDetailsModal.propTypes = {
  order: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default OrderDetailsModal;
