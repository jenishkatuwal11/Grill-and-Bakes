import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "../../redux/slices/authSlices";
import { fetchCart, clearCart } from "../../redux/slices/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaBars, FaUserCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import assets from "../../assets/assets";
import CartModal from "../CartModal";
import axios from "axios";

const Navbar = ({ toggleLoginModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser && !user) {
      dispatch(
        setUser({
          user: storedUser.user,
          token: localStorage.getItem("authToken"),
        })
      );
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      dispatch(logout());
      dispatch(clearCart());
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //  Handle Enter key press
  const handleSearchKeyPress = async (e) => {
    if (e.key === "Enter") {
      try {
        const res = await axios.get("http://localhost:8001/api/items");
        const allItems = res.data.items || [];

        const filtered = allItems.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );

        setSearchResults(filtered);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 shadow-md bg-[#F5F5DC]">
      {/* Brand */}
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

      {/* Nav Links and Search */}
      <div className="hidden lg:flex items-center space-x-6">
        <ul className="hidden md:flex space-x-6 lg:space-x-8 text-dark-brown">
          <li>
            <Link to="/" className="hover:text-maroon">
              Food
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

        {/*  Search Input */}
        <div className="relative">
          <div className="flex items-center border border-dark-brown focus-within:border-maroon rounded-full px-4 lg:px-6 w-64 lg:w-80 transition-all">
            <input
              type="text"
              placeholder="Search"
              className="w-full outline-none text-dark-brown placeholder-dark-brown text-sm lg:text-base bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            <IoIosSearch className="text-maroon w-6 h-6 lg:w-7 lg:h-10 ml-2 lg:ml-4" />
          </div>

          {/*  Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-20">
              {searchResults.length === 0 ? (
                <p className="p-3 text-gray-500 text-sm">No items found.</p>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item._id}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearch("");
                      setShowDropdown(false);
                      navigate(`/item/${item._id}`); //  implement item page if needed
                    }}
                  >
                    {item.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart & User */}
      <div className="flex items-center space-x-4 lg:space-x-6">
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

        {/* User Dropdown */}
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
                <div className="px-4 py-2 text-gray-700 hover:bg-red-300 cursor-pointer">
                  <Link to="/my-orders">My Orders</Link>
                </div>
                <div className="px-4 py-2 text-gray-700 hover:bg-red-300 cursor-pointer">
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
            Log In
          </button>
        )}

        <button
          className="block lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars className="w-6 h-6 sm:w-7 sm:h-7 text-maroon" />
        </button>
      </div>

      {/* Mobile Menu */}
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

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

Navbar.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
};

export default Navbar;
