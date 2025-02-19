import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlices";
import { useNavigate, Link } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa"; // Added FaTimes for closing the menu
import PropTypes from "prop-types";
import assets from "../../assets/assets";

const Navbar = ({ toggleLoginModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authToken");
    setIsDropdownOpen(false);
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 shadow-md"
      style={{ backgroundColor: "#F5F5DC" }}
    >
      {/* Logo and Brand */}
      <div className="flex items-center space-x-3">
        <Link to="/">
          <img
            src={assets.Mainlogo}
            alt="LogoImage"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-transparent"
          />
        </Link>
        <div className="text-lg sm:text-xl md:text-3xl font-bold text-maroon">
          <div style={{ marginBottom: "-6px" }}>Grill & Bakes</div>
          <span className="text-sm sm:text-md md:text-lg text-dark-brown font-cursive">
            Family Restaurant
          </span>
        </div>
      </div>

      {/* Links and Search Bar */}
      <div className="hidden lg:flex items-center space-x-6">
        <ul className="hidden md:flex space-x-6 lg:space-x-8 text-dark-brown">
          <li>
            <Link to="/" className="hover:text-maroon">
              Home
            </Link>
          </li>
          <li>
            <Link to="/your-drink" className="hover:text-maroon">
              Your Drink
            </Link>
          </li>
          <li>
            <Link to="/mobile-app" className="hover:text-maroon">
              Mobile App
            </Link>
          </li>
          <li>
            <Link to="/contact-us" className="hover:text-maroon">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Search Bar */}
        <div className="flex items-center border border-dark-brown focus-within:border-maroon rounded-full px-4 lg:px-6 w-64 lg:w-80 transition-all">
          <input
            type="text"
            placeholder="Search"
            className="w-full outline-none text-dark-brown placeholder-dark-brown text-sm lg:text-base bg-transparent"
          />
          <button>
            <IoIosSearch className="text-maroon w-6 h-6 lg:w-7 lg:h-10 ml-2 lg:ml-4" />
          </button>
        </div>
      </div>

      {/* Icons and Profile/Sign In */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        {/* Basket Icon */}
        <IoFastFoodOutline className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-maroon hover:text-black cursor-pointer" />

        {/* Show Profile Icon or Sign In Instantly */}
        {currentUser ? (
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUserCircle className="text-maroon w-8 h-8 sm:w-10 sm:h-10" />
              <span className="ml-2 text-dark-brown font-medium">
                {currentUser.username}
              </span>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-56 py-2 z-10">
                <div className="px-4 py-2 text-gray-700">
                  <p className="font-semibold">{currentUser.username}</p>
                  <p className="text-sm">{currentUser.email}</p>
                </div>
                <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="px-3 py-1 sm:px-4 sm:py-1 md:px-5 md:py-2 border rounded-full text-dark-brown border-maroon hover:bg-maroon hover:text-light-beige text-sm sm:text-base md:text-lg"
            onClick={toggleLoginModal}
          >
            Sign In
          </button>
        )}

        {/* Hamburger Menu for Small Screens */}
        <button
          className="block lg:hidden ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <FaTimes className="w-6 h-6 sm:w-7 sm:h-7 text-maroon" />
          ) : (
            <FaBars className="w-6 h-6 sm:w-7 sm:h-7 text-maroon" />
          )}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-40 bg-pink-100 shadow-md z-40 lg:hidden">
          <ul className="flex flex-col text-center text-dark-brown p-4 space-y-3">
            <li>
              <Link
                to="/"
                className="hover:text-maroon"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/your-drink"
                className="hover:text-maroon"
                onClick={() => setIsMenuOpen(false)}
              >
                Your Drink
              </Link>
            </li>
            <li>
              <Link
                to="/mobile-app"
                className="hover:text-maroon"
                onClick={() => setIsMenuOpen(false)}
              >
                Mobile App
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className="hover:text-maroon"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
};

export default Navbar;
