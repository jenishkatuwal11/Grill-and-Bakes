import { useState, useEffect, useCallback } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";
import axios from "axios";

const ActiveUsers = () => {
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //  useCallback  fix ESLint dependency warning
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users?page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/toggle/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, active: !user.active } : user
        )
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      filter === "all" || (filter === "active" ? user.active : !user.active)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        👥 User Management
      </h2>

      {/* Filter Dropdown */}
      <div className="mb-4 flex justify-end">
        <select
          className="p-2 border rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="inactive">Inactive Users</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-3 flex items-center space-x-2">
                  <FaUserLarge className="text-blue-500" />
                  <span>{user.username}</span>
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 text-center">
                  <span
                    className={
                      user.active
                        ? "bg-green-500 text-white px-3 py-1 rounded-lg"
                        : "bg-red-500 text-white px-3 py-1 rounded-lg"
                    }
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    className={`text-white px-3 py-2 rounded-lg transition-all ${
                      user.active
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => toggleStatus(user._id)}
                  >
                    {user.active ? <BsToggle2Off /> : <BsToggle2On />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActiveUsers;
