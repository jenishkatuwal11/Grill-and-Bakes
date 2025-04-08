import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import assets from "../../assets/assets";

const Footer = () => {
  return (
    <footer
      className="relative text-white"
      style={{
        backgroundImage: `url(${assets.footerImg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
      }}
    >
      {/* Overlay for Better Text Visibility */}
      <div className="absolute inset-0 bg-dark-gray bg-opacity-60"></div>

      {/* Footer Content */}
      <div className="relative flex flex-col lg:flex-row justify-between items-start px-6 lg:px-16 py-8 lg:py-16">
        {/* Left Content */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-maroon mb-4">Grill & Bakes</h2>
          <p className="text-lg font-medium mb-4">
            <strong>Hours of Operation:</strong>
            <br />
            Monday-Saturday: 11 A.M. to 2 P.M.
            <br />
            Thursday-Saturday: 5 P.M. to 8 P.M.
          </p>
          <p className="text-md mb-4">
            1611 Farnam Street
            <br />
            Omaha, Nebraska 68106
            <br />
            <a
              href="mailto:block16info@gmail.com"
              className="hover:text-maroon underline"
            >
              block16info@gmail.com
            </a>
          </p>
          <p className="text-md mb-4">
            ➤ Eat in or take out. We accept credit cards, personal checks, and
            cold-hard cash.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-brown hover:bg-maroon"
            >
              <FaFacebookF className="text-white w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-brown hover:bg-maroon"
            >
              <FaTwitter className="text-white w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-brown hover:bg-maroon"
            >
              <FaInstagram className="text-white w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-brown hover:bg-maroon"
            >
              <FaYoutube className="text-white w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-dark-gray bg-opacity-90 py-4 relative z-10">
        <p className="text-center text-sm text-white font-medium">
          © 2024 Grill & Bakes | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
