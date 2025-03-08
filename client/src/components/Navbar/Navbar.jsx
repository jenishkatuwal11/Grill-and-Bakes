import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlices";
import { fetchCart, clearCart } from "../../redux/slices/cartSlice"; // ✅ Import cart actions
import { useNavigate, Link } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaBars, FaUserCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import API from "../../services/api";
import assets from "../../assets/assets";
import CartModal from "../CartModal"; // ✅ Import Cart Modal

const Navbar = ({ toggleLoginModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // ✅ State for Cart Modal

  const { user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart); // ✅ Get total cart count

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Fetch Cart when user logs in
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout", {}, { withCredentials: true }); // ✅ Properly destroy session
      dispatch(logout());
      dispatch(clearCart()); // ✅ Ensure cart is cleared on logout
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
        {/* ✅ Cart Icon with Badge */}
        <div
          className="relative cursor-pointer"
          onClick={() => setIsCartOpen(true)}
        >
          <IoFastFoodOutline className="w-7 h-7 sm:w-8 sm:h-8 text-maroon hover:text-black" />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalQuantity}
            </span>
          )}
        </div>

        {/* User Profile or Sign In */}
        {user ? (
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUserCircle className="text-maroon w-8 h-8 sm:w-10 sm:h-10" />
              <span className="ml-2 text-dark-brown font-medium">
                {user.username}
              </span>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-56 py-2 z-10">
                <div className="px-4 py-2 text-gray-700">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm">{user.email}</p>
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

        {/* Hamburger Menu */}
        <button
          className="block lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars className="w-6 h-6 sm:w-7 sm:h-7 text-maroon" />
        </button>
        {/*  Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 w-40 bg-white shadow-md flex flex-col space-y-4 px-2 py-4 lg:hidden">
            <Link
              to="/"
              className="text-dark-brown hover:text-maroon"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/your-drink"
              className="text-dark-brown hover:text-maroon"
              onClick={() => setIsMenuOpen(false)}
            >
              Your Drink
            </Link>
            <Link
              to="/mobile-app"
              className="text-dark-brown hover:text-maroon"
              onClick={() => setIsMenuOpen(false)}
            >
              Mobile App
            </Link>
            <Link
              to="/contact-us"
              className="text-dark-brown hover:text-maroon"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>

      {/* ✅ Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

Navbar.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
};

export default Navbar;
