import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaClipboardList,
  FaPlus,
  FaUsers,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on navigation
  const handleNavClick = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Menu Button (Mobile View) */}
      <button
        className="absolute top-4 left-4 text-maroon md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-100 shadow-lg w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="bg-maroon text-white text-lg font-bold px-6 py-4 flex items-center justify-between">
          <span>Dashboard</span>
          {/* Close Button for Mobile */}
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            ✖
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-4">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-3 ${
              location.pathname === "/admin/dashboard"
                ? "text-maroon font-bold"
                : "text-dark-brown"
            } hover:text-maroon`}
            onClick={handleNavClick}
          >
            <FaClipboardList /> <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center space-x-3 ${
              location.pathname === "/admin/orders"
                ? "text-maroon font-bold"
                : "text-dark-brown"
            } hover:text-maroon`}
            onClick={handleNavClick}
          >
            <FaClipboardList /> <span>Order Status</span>
          </Link>

          <Link
            to="/admin/add-items"
            className={`flex items-center space-x-3 ${
              location.pathname === "/admin/add-items"
                ? "text-maroon font-bold"
                : "text-dark-brown"
            } hover:text-maroon`}
            onClick={handleNavClick}
          >
            <FaPlus /> <span>Add Items</span>
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center space-x-3 ${
              location.pathname === "/admin/users"
                ? "text-maroon font-bold"
                : "text-dark-brown"
            } hover:text-maroon`}
            onClick={handleNavClick}
          >
            <FaUsers /> <span>Users</span>
          </Link>

          <Link
            to="/admin/reports"
            className={`flex items-center space-x-3 ${
              location.pathname === "/admin/reports"
                ? "text-maroon font-bold"
                : "text-dark-brown"
            } hover:text-maroon`}
            onClick={handleNavClick}
          >
            <FaFileAlt /> <span>Reports</span>
          </Link>

          <Link
            to="/admin/settings"
            className={`flex items-center space-x-3 ${
              location.pathname === "/admin/settings"
                ? "text-maroon font-bold"
                : "text-dark-brown"
            } hover:text-maroon`}
            onClick={handleNavClick}
          >
            <FaCog /> <span>Settings</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
