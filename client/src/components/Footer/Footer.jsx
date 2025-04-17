import { FaFacebookF, FaInstagram } from "react-icons/fa";
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
            Monday-Saturday: 09 A.M. to 9:30 P.M.
            <br />
            Thursday-Saturday: 09 A.M. to 9:30 P.M.
          </p>
          <p className="text-md mb-4">
            Kapan marg - Chakrapath,
            <br />
            Kathmandu, Nepal-44600
            <br />
            <a
              href="mailto:block16info@gmail.com"
              className="hover:text-maroon underline"
            >
              info.grillandbakes@gmail.com
            </a>
          </p>
          <p className="text-md mb-4">
            ➤ Eat in or take out. We accept credit cards, personal checks, and
            cold-hard cash.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.facebook.com/Grillandbakes/"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-brown hover:bg-maroon"
            >
              <FaFacebookF className="text-white w-4 h-4" />
            </a>

            <a
              href="https://www.instagram.com/grillandbakes/?fbclid=IwY2xjawJtfZdleHRuA2FlbQIxMAABHjLw8_IEpdJelPWJu5WIbFqo42n2RXp-r3oLAHOnXyOs167wvktlGzypYQHr_aem_6zQoMyw85yAtj5heVg0iUg#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-brown hover:bg-maroon"
            >
              <FaInstagram className="text-white w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-dark-gray bg-opacity-90 py-4 relative z-10">
        <p className="text-center text-sm text-white font-medium">
          © 2025 Grill & Bakes | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
