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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderCustomizations = (customizations) => {
    if (!customizations || typeof customizations !== "object") return null;

    const hasCustoms = Object.values(customizations).some(
      (val) =>
        (Array.isArray(val) && val.length > 0) || (!Array.isArray(val) && val)
    );

    if (!hasCustoms) return null;

    return (
      <div className="mt-1">
        <p className="text-xs font-semibold text-maroon mb-1">Customized:</p>
        <ul className="ml-4 text-xs text-gray-600 list-disc space-y-0.5">
          {Object.entries(customizations).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0))
              return null;

            const formattedKey =
              key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1");
            const displayValue = Array.isArray(value)
              ? value.join(", ")
              : value;

            return (
              <li key={key}>
                <span className="font-medium text-gray-700">
                  {formattedKey}:
                </span>{" "}
                {displayValue}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
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

        <div className="p-4 overflow-y-auto flex-1">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-medium">{order._id}</p>
            {order.createdAt && (
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(order.createdAt)}
              </p>
            )}
          </div>

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

          <div className="mb-4">
            <h4 className="font-medium mb-2 flex items-center">
              <FaUtensils className="mr-2" /> Items Ordered
            </h4>
            <div className="border rounded-md overflow-hidden">
              {order.items.map((item, index) => {
                console.log("Item details in modal:", item); // ✅ Debugging line
                return (
                  <div
                    key={index}
                    className={`p-3 ${
                      index !== order.items.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {item.product?.name || item.name || "Unknown Item"}
                      </p>
                      <p className="font-medium">रु {item.price}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    {renderCustomizations(item.customizations)}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t flex justify-between items-center">
            <h4 className="font-medium flex items-center">
              <FaRupeeSign className="mr-1" /> Total Amount
            </h4>
            <p className="text-lg font-bold">रु {order.totalPrice}</p>
          </div>
        </div>

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
