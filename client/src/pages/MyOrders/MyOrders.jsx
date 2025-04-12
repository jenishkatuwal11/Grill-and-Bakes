import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaReceipt,
  FaShoppingBag,
  FaExclamationTriangle,
} from "react-icons/fa";

const MyOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:8001/api/orders/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Preparing":
        return <FaClock className="text-blue-500 text-lg" />;
      case "Out for Delivery":
        return <FaTruck className="text-yellow-500 text-lg" />;
      case "Delivered":
        return <FaCheckCircle className="text-green-500 text-lg" />;
      case "Canceled":
        return <FaTimesCircle className="text-red-500 text-lg" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Preparing":
        return "bg-blue-100 text-blue-700";
      case "Out for Delivery":
        return "bg-yellow-100 text-yellow-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const renderCustomizations = (customizations) => {
    if (!customizations || typeof customizations !== "object") return null;

    return (
      <ul className="text-xs text-gray-500 mt-1 list-disc list-inside space-y-0.5">
        {Object.entries(customizations).map(([key, value]) => {
          if (!value || value.length === 0) return null;
          const formattedValue = Array.isArray(value)
            ? value.join(", ")
            : value;
          const formattedKey =
            key.charAt(0).toUpperCase() +
            key.slice(1).replace(/([A-Z])/g, " $1");
          return (
            <li key={key}>
              <span className="font-medium text-gray-600">{formattedKey}:</span>{" "}
              {formattedValue}
            </li>
          );
        })}
      </ul>
    );
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6">
        <FaExclamationTriangle className="text-yellow-500 text-4xl mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Authentication Required
        </h3>
        <p className="text-gray-600">
          Please log in to view your order history.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-1 flex items-center">
          <FaShoppingBag className="text-emerald-600 mr-3" />
          My Orders
        </h2>
        <p className="text-gray-500 mb-4">
          Track and manage your order history
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaShoppingBag className="text-gray-400 text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You haven’t placed any orders yet. Browse our menu and place your
            first order!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Order Header */}
              <div
                className="p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setSelectedOrder(
                    selectedOrder === order._id ? null : order._id
                  )
                }
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`${getStatusClass(
                        order.status
                      )} w-10 h-10 rounded-full flex items-center justify-center`}
                    >
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Order #{order._id.substring(order._id.length - 8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="ml-4 font-bold text-gray-800">
                      ₹{order.totalPrice}
                    </span>
                    <svg
                      className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                        selectedOrder === order._id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {selectedOrder === order._id && (
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Order Info */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        Order Details
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">{order._id}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {formatDate(order.createdAt)}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium flex items-center">
                            <FaMoneyBillWave className="text-gray-400 mr-1" />
                            {order.paymentMethod}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`font-medium ${
                              order.status === "Delivered"
                                ? "text-green-600"
                                : order.status === "Canceled"
                                ? "text-red-600"
                                : "text-blue-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Enhanced Payment Summary */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <FaReceipt className="text-gray-400 mr-2" />
                        Payment Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        {order.items.map((item, idx) => {
                          const base = item.product?.price || 0;
                          const customizationCost = item.price - base;
                          const hasCustomization = customizationCost > 0;

                          return (
                            <div
                              key={idx}
                              className="flex justify-between items-start border-b border-gray-100 pb-2"
                            >
                              <div>
                                <span className="font-medium text-gray-700">
                                  {item.name} × {item.quantity}
                                </span>
                                {hasCustomization && (
                                  <p className="text-xs text-gray-500">
                                    Base: ₹{base} + Custom: ₹{customizationCost}
                                  </p>
                                )}
                              </div>
                              <span className="font-semibold text-gray-800">
                                ₹{item.price}
                              </span>
                            </div>
                          );
                        })}

                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Fee:</span>
                          <span className="font-medium">₹0</span>
                        </div>

                        <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-bold">
                          <span>Total:</span>
                          <span>₹{order.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <h4 className="font-medium text-gray-700 mb-3">
                    Order Items
                  </h4>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.product?._id}-${index}`}
                        className={`flex items-start p-3 ${
                          index !== order.items.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={
                              item.product?.image
                                ? `http://localhost:8001${item.product.image}`
                                : "/fallback-image.jpg"
                            }
                            alt={item.product?.name || "Item"}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.target.src = "/fallback-image.jpg")
                            }
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h5 className="font-medium text-gray-800">
                            {item.name}
                          </h5>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          {renderCustomizations(item.customizations)}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            ₹{item.price}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₹{(item.price / item.quantity).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
