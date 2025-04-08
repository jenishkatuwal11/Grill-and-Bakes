// ... existing imports
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import OrderDetailsModal from "../../components/OrderDetailsModal.jsx/OrderDetailsModal";

const OrderStatus = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { admin } = useSelector((state) => state.auth);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      let url = `http://localhost:8001/api/orders?page=${currentPage}&limit=${limit}`;

      if (dateFilter === "today") {
        const today = new Date().toISOString().split("T")[0];
        url += `&startDate=${today}&endDate=${today}`;
      } else if (dateFilter === "last7days") {
        const today = new Date();
        const past7 = new Date(today);
        past7.setDate(today.getDate() - 6);
        url += `&startDate=${past7.toISOString().split("T")[0]}&endDate=${
          today.toISOString().split("T")[0]
        }`;
      } else if (dateFilter === "last30days") {
        const today = new Date();
        const past30 = new Date(today);
        past30.setDate(today.getDate() - 29);
        url += `&startDate=${past30.toISOString().split("T")[0]}&endDate=${
          today.toISOString().split("T")[0]
        }`;
      } else if (dateFilter === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await axios.get(url, { headers });

      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [currentPage, dateFilter, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(
        `http://localhost:8001/api/orders/${id}`,
        { status: newStatus },
        { headers }
      );

      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
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
      (order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
        order.contact.includes(search) ||
        order.address.toLowerCase().includes(search.toLowerCase()))
  );

  if (!admin) {
    return <p className="text-center text-red-500">Unauthorized Access</p>;
  }

  return (
    <div className="p-6 md:p-8 lg:ml-64 max-w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        📦 Order Status
      </h2>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Order ID, User, Contact, or Address"
          className="border border-gray-300 p-2 rounded-lg w-full md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-gray-300 p-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Preparing">Preparing</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>

        <select
          className="border border-gray-300 p-2 rounded-lg"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateFilter === "custom" && (
          <>
            <input
              type="date"
              className="border border-gray-300 p-2 rounded-lg"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border border-gray-300 p-2 rounded-lg"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <>
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
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const isFinal =
                      order.status === "Delivered" ||
                      order.status === "Canceled";

                    return (
                      <tr
                        key={order._id}
                        className="border-t hover:bg-gray-100"
                      >
                        <td className="p-3 font-medium">{order._id}</td>
                        <td className="p-3">{order.user?.username}</td>
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
                              handleStatusChange(order._id, e.target.value)
                            }
                            disabled={isFinal}
                          >
                            {order.status === "Preparing" && (
                              <>
                                <option value="Preparing">Preparing</option>
                                <option value="Out for Delivery">
                                  Out for Delivery
                                </option>
                                <option value="Canceled">Canceled</option>
                              </>
                            )}
                            {order.status === "Out for Delivery" && (
                              <>
                                <option value="Out for Delivery">
                                  Out for Delivery
                                </option>
                                <option value="Delivered">Delivered</option>
                                <option value="Canceled">Canceled</option>
                              </>
                            )}
                            {isFinal && (
                              <option value={order.status}>
                                {order.status}
                              </option>
                            )}
                          </select>
                        </td>
                        <td className="p-3 font-semibold">
                          रु {order.totalPrice}
                        </td>
                        <td className="p-3">
                          <button
                            className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition"
                            onClick={() => handleDetailsClick(order)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-gray-500 py-6 font-medium"
                    >
                      No orders have been placed on this day.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      <OrderDetailsModal order={selectedOrder} onClose={closeDetailsModal} />
    </div>
  );
};

export default OrderStatus;
