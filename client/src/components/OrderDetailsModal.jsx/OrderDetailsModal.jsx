import PropTypes from "prop-types";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null; // Ensure the modal is only rendered when needed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">Order Details - {order.id}</h3>
        <p className="text-gray-700">User: {order.user}</p>
        <p className="text-gray-700">Contact: {order.contact}</p>
        <p className="text-gray-700">Address: {order.address}</p>
        <p className="text-gray-700">Total: {order.total}</p>

        <h4 className="font-semibold mt-4">Items Ordered:</h4>
        <ul className="list-disc ml-5">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity}x ({item.price})
            </li>
          ))}
        </ul>

        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ✅ Prop Validation
OrderDetailsModal.propTypes = {
  order: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default OrderDetailsModal;
