import { useState } from "react";
import { FaBoxOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const MyOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      date: "2024-03-20",
      total: 3500,
      status: "Delivered",
    },
    {
      id: "ORD002",
      date: "2024-03-18",
      total: 2200,
      status: "Pending",
    },
    {
      id: "ORD003",
      date: "2024-03-15",
      total: 5000,
      status: "Cancelled",
    },
  ]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🛒 My Orders
      </h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Order ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-3 flex items-center space-x-2">
                  <FaBoxOpen className="text-blue-500" />
                  <span>{order.id}</span>
                </td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">रु {order.total}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-lg ${
                      order.status === "Delivered"
                        ? "bg-green-500 text-white"
                        : order.status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {order.status === "Delivered" ? (
                      <FaCheckCircle className="inline-block mr-1" />
                    ) : order.status === "Pending" ? (
                      "⏳"
                    ) : (
                      <FaTimesCircle className="inline-block mr-1" />
                    )}
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
