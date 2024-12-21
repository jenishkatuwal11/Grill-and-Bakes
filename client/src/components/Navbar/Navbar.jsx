import { useState } from "react";
import PropTypes from "prop-types";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import assets from "../../assets/assets";

const Navbar = ({ toggleLoginModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 shadow-md"
      style={{ backgroundColor: "#F5F5DC" }}
    >
      {/* Logo and Brand */}
      <div className="flex items-center space-x-3">
        <img
          src={assets.Mainlogo}
          alt="LogoImage"
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-transparent"
        />
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
          <li className="hover:text-maroon cursor-pointer">Home</li>
          <li className="hover:text-maroon cursor-pointer">Your Drink</li>
          <li className="hover:text-maroon cursor-pointer">Mobile App</li>
          <li className="hover:text-maroon cursor-pointer">Contact Us</li>
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

      {/* Icons and Sign-In Button */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        {/* Basket Icon */}
        <IoFastFoodOutline className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-maroon hover:text-black cursor-pointer" />

        {/* Sign In Button */}
        <button
          className="px-3 py-1 sm:px-4 sm:py-1 md:px-5 md:py-2 border rounded-full text-dark-brown border-maroon hover:bg-maroon hover:text-light-beige text-sm sm:text-base md:text-lg"
          onClick={toggleLoginModal} // Single trigger for Login Modal
        >
          Sign In
        </button>

        {/* Hamburger Menu for Small Screens */}
        <button
          className="block lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars className="w-6 h-6 sm:w-7 sm:h-7 text-maroon" />
        </button>
      </div>

      {/* Dropdown Menu for Hamburger */}
      {isMenuOpen && (
        <div
          className="absolute top-[100%] right-4 bg-light-beige shadow-lg rounded-lg w-48 lg:hidden"
          style={{ backgroundColor: "#F5F5DC", padding: "0.5rem 1rem" }}
        >
          <ul className="flex flex-col items-start p-2 space-y-2 text-dark-brown">
            <li className="hover:text-maroon cursor-pointer w-full text-left">
              Home
            </li>
            <li className="hover:text-maroon cursor-pointer w-full text-left">
              Your Drink
            </li>
            <li className="hover:text-maroon cursor-pointer w-full text-left">
              Mobile App
            </li>
            <li className="hover:text-maroon cursor-pointer w-full text-left">
              Contact Us
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired, // Prop for triggering the Login Modal
};

export default Navbar;
