import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate for redirection
import { FaUserCircle, FaSignOutAlt, FaBell } from "react-icons/fa";

const AdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New Order from John Doe (ORD001)", read: false },
    { id: 2, message: "New Order from Alice Smith (ORD002)", read: false },
  ]);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigation

  // Handle Click Outside to Close Dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("adminAuthToken"); // ✅ Remove Token
    navigate("/admin/login"); // ✅ Redirect to Admin Login
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="sticky top-0 z-40 bg-slate-300 shadow-md p-4 flex justify-between items-center">
      {/* ✅ Hide Dashboard Title on sm & md screens */}
      <h1 className="text-maroon text-lg font-bold hidden md:hidden lg:block">
        Dashboard
      </h1>

      {/* ✅ Prevent stacking & ensure alignment */}
      <div className="ml-auto flex items-center space-x-2 md:space-x-4">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            className="relative text-maroon text-2xl focus:outline-none"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <FaBell />
            {notifications.some((n) => !n.read) && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {notificationOpen && (
            <div className="absolute right-0 top-10 bg-white shadow-md rounded-lg w-64 py-2 px-3 z-50">
              <h3 className="text-gray-700 font-semibold pb-2 border-b">
                Notifications
              </h3>
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">
                  No new notifications
                </p>
              ) : (
                <div className="max-h-56 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-3 py-2 border-b ${
                        notif.read ? "bg-gray-100" : "bg-blue-50"
                      }`}
                    >
                      {notif.message}
                    </div>
                  ))}
                  <button
                    className="w-full text-blue-600 hover:bg-gray-100 p-2 text-sm mt-2"
                    onClick={markAllAsRead}
                  >
                    Mark All as Read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ✅ Admin Profile Dropdown (Visible on all screens) */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle className="text-maroon text-2xl" />
            <span className="block">Jenis Katuwal</span>{" "}
            {/* ✅ Always visible */}
          </div>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white shadow-md rounded-lg min-w-[200px] max-w-[300px] py-2 px-4">
              <p className="text-gray-700 border-b py-2 break-words whitespace-normal">
                jenishkatuwal7@gmail.com
              </p>
              <button
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                onClick={handleLogout} // ✅ Call Logout Function
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
