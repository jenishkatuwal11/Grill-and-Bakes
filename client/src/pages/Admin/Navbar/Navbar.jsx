import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const AdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle Click Outside to Close Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-light-beige shadow-md p-4 flex justify-between items-center">
      {/*  Removing "Dashboard" from Small Screens */}
      <h1 className="text-maroon text-lg font-bold hidden md:block">
        Dashboard
      </h1>

      {/* Admin Profile (Right Side) */}
      <div className="relative ml-auto" ref={dropdownRef}>
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FaUserCircle className="text-maroon text-2xl" />
          <span className="sm:block">Jenis Katuwal</span>
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white shadow-md rounded-lg w-48 py-2">
            <p className="px-4 py-2 text-gray-700 border-b">
              jenishkatuwal7@gmail.com
            </p>
            <button
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
              onClick={() => alert("Logging out...")}
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
