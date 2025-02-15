import { useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";

const ActiveUsers = () => {
  const [filter, setFilter] = useState("all"); // Filter State
  const [users, setUsers] = useState([
    { id: 1, name: "Jenis Katuwal", email: "jenish@example.com", active: true },
    { id: 2, name: "Prem Guragain", email: "prem@example.com", active: false },
    {
      id: 3,
      name: "Kanchi Katuwal",
      email: "kanchi@example.com",
      active: true,
    },
  ]);

  // Toggle Active/Inactive Status
  const toggleStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  // Filter Users Based on Active/Inactive Status
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
              <tr key={user.id} className="border-b">
                <td className="p-3 flex items-center space-x-2">
                  <FaUserLarge className="text-blue-500" />
                  <span>{user.name}</span>
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
                    onClick={() => toggleStatus(user.id)}
                  >
                    {user.active ? <BsToggle2Off /> : <BsToggle2On />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveUsers;
