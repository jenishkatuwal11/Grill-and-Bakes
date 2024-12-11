import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import assets from "../../assets/assets";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-light-beige">
      {/* Logo and Brand */}
      <div className="flex items-center space-x-3">
        <img src={assets.Mainlogo} alt="LogoImage" className="w-16 h-16" />
        <div className="text-3xl font-bold text-maroon">
          Grill & Bakes <br />
          <span className="text-md text-dark-brown font-cursive">
            Family Restaurant
          </span>
        </div>
      </div>

      {/* Links */}
      <ul className="flex space-x-8 text-dark-brown">
        <li className="hover:text-maroon cursor-pointer">Home</li>
        <li className="hover:text-maroon cursor-pointer">Menu</li>
        <li className="hover:text-maroon cursor-pointer">Mobile app</li>
        <li className="hover:text-maroon cursor-pointer">Contact Us</li>
      </ul>

      {/* Search Bar and Icons */}
      <div className="flex items-center space-x-7">
        {/* Search Bar */}
        <div className="flex items-center border border-dark-brown rounded-full  px-8 mr-15">
          <IoIosSearch className="text-maroon w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="ml-2 outline-none text-dark-brown placeholder-dark-brown"
          />
        </div>

        {/* Basket Icon */}
        <IoFastFoodOutline className="w-8 h-8 text-maroon hover:text-black cursor-pointer" />

        {/* Sign In Button */}
        <button className="px-4 py-1 space-x-4 border rounded-full text-dark-brown border-maroon hover:bg-maroon hover:text-light-beige">
          Sign in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
