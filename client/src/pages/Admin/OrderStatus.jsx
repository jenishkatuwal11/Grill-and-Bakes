// ... existing imports
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import OrderDetailsModal from "../../components/OrderDetailsModal.jsx/OrderDetailsModal";

const OrderStatus = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  console.log("Selected Order: ", selectedOrder); // Debugging line

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const limit = 5;
  const [todayPage, setTodayPage] = useState(1);
  const [yesterdayPage, setYesterdayPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);

  const { admin } = useSelector((state) => state.auth);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          headers,
        }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
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

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const d = new Date(date);
    return (
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear()
    );
  };

  const getSorted = (orders) => {
    const priority = {
      Preparing: 1,
      "Out for Delivery": 2,
      Delivered: 3,
      Canceled: 4,
    };
    return [...orders].sort((a, b) => priority[a.status] - priority[b.status]);
  };

  const filteredOrders = orders.filter(
    (order) =>
      (filter === "All" || order.status === filter) &&
      (order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
        order.contact.includes(search) ||
        order.address.toLowerCase().includes(search.toLowerCase()))
  );

  const todayOrders = getSorted(
    filteredOrders.filter((order) => isToday(order.createdAt))
  );
  const yesterdayOrders = getSorted(
    filteredOrders.filter((order) => isYesterday(order.createdAt))
  );
  const previousOrders = getSorted(
    filteredOrders.filter(
      (order) => !isToday(order.createdAt) && !isYesterday(order.createdAt)
    )
  );

  const paginate = (orders, page) => {
    const start = (page - 1) * limit;
    return orders.slice(start, start + limit);
  };

  if (!admin) {
    return <p className="text-center text-red-500">Unauthorized Access</p>;
  }

  const renderSection = (title, orders, page, setPage) => {
    const totalPages = Math.ceil(orders.length / limit);
    const paginated = paginate(orders, page);

    return (
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-700 mb-4">{title}</h3>
        {paginated.length > 0 ? (
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => {
                  const isFinal =
                    order.status === "Delivered" || order.status === "Canceled";
                  return (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{order._id}</td>
                      <td className="p-3">{order.user?.username}</td>
                      <td className="p-3">{order.contact}</td>
                      <td className="p-3">{order.address}</td>
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
                            <option value={order.status}>{order.status}</option>
                          )}
                        </select>
                      </td>
                      <td className="p-3 font-semibold">
                        रु {order.totalPrice}
                      </td>
                      <td className="p-3">
                        <button
                          className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
                          onClick={() => handleDetailsClick(order)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center items-center mt-4 gap-4">
              <button
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No orders available.</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 lg:ml-64 max-w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        📦 Order Status
      </h2>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
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
          <option value="Preparing">Preparing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <>
          {renderSection(
            "Today's Orders",
            todayOrders,
            todayPage,
            setTodayPage
          )}
          {renderSection(
            "Yesterday's Orders",
            yesterdayOrders,
            yesterdayPage,
            setYesterdayPage
          )}
          {renderSection(
            "Previous Orders",
            previousOrders,
            previousPage,
            setPreviousPage
          )}
        </>
      )}

      <OrderDetailsModal order={selectedOrder} onClose={closeDetailsModal} />
    </div>
  );
};

export default OrderStatus;
