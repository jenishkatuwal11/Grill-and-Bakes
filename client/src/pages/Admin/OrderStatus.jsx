import { useState } from "react";
import OrderDetailsModal from "../../components/OrderDetailsModal.jsx/OrderDetailsModal"; // ✅ Import Modal Component

const OrderStatus = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      user: "John Doe",
      contact: "9876543210",
      address: "123 Main St, NY",
      status: "Out for Delivery",
      total: "$120",
      items: [
        { name: "Burger", quantity: 2, price: "$20" },
        { name: "Fries", quantity: 1, price: "$10" },
      ],
    },
    {
      id: "ORD002",
      user: "Alice Smith",
      contact: "9841123456",
      address: "456 Elm St, CA",
      status: "Delivered",
      total: "$90",
      items: [
        { name: "Pizza", quantity: 1, price: "$50" },
        { name: "Soda", quantity: 2, price: "$20" },
      ],
    },
    {
      id: "ORD003",
      user: "Michael Brown",
      contact: "9807654321",
      address: "789 Oak St, TX",
      status: "Canceled",
      total: "$50",
      items: [
        { name: "Salad", quantity: 1, price: "$15" },
        { name: "Water", quantity: 1, price: "$5" },
      ],
    },
    {
      id: "ORD004",
      user: "Emily Davis",
      contact: "9753124680",
      address: "101 Pine St, FL",
      status: "Preparing",
      total: "$200",
      items: [
        { name: "Pasta", quantity: 1, price: "$30" },
        { name: "Juice", quantity: 2, price: "$40" },
      ],
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDetailsClick = (order) => {
    setSelectedOrder(order);
  };

  const closeDetailsModal = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter(
    (order) =>
      (filter === "All" || order.status === filter) &&
      (order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.user.toLowerCase().includes(search.toLowerCase()) ||
        order.contact.includes(search) ||
        order.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 lg:ml-64 max-w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        📦 Order Status
      </h2>

      {/* Search & Filter Controls */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Order ID, User, Contact, or Address"
          className="border border-gray-300 p-2 rounded-lg w-full md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 p-2 rounded-lg w-full md:w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Preparing">Preparing</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {/* Responsive Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-max">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-700">
              <th className="p-3">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3 sm:table-cell">Contact</th>
              <th className="p-3 md:table-cell">Address</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-100">
                <td className="p-3 font-medium">{order.id}</td>
                <td className="p-3">{order.user}</td>
                <td className="p-3 sm:table-cell">{order.contact}</td>
                <td className="p-3 md:table-cell">{order.address}</td>

                <td className="p-3">
                  <select
                    className={`p-2 rounded-md text-sm ${
                      order.status === "Out for Delivery"
                        ? "bg-yellow-200 text-yellow-700"
                        : order.status === "Delivered"
                        ? "bg-green-200 text-green-700"
                        : order.status === "Preparing"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-red-200 text-red-700"
                    }`}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </td>

                <td className="p-3 font-semibold">{order.total}</td>

                <td className="p-3">
                  <button
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition"
                    onClick={() => handleDetailsClick(order)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsModal order={selectedOrder} onClose={closeDetailsModal} />
    </div>
  );
};

export default OrderStatus;
