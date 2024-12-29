import { useState, useEffect } from "react";
import Slider from "react-slick";
import assets from "../../assets/assets"; // Ensure correct paths for your images
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Login from "../Login/login";
import Register from "../Register/register";

const HomePage = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false); // Optional for Register
  const [fadeIn, setFadeIn] = useState(false);

  const toggleLoginModal = () => {
    setLoginOpen(!isLoginOpen);
  };

  const toggleRegisterModal = () => {
    setRegisterOpen(!isRegisterOpen);
  };

  const switchToRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const switchToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 3, slidesToScroll: 2 } },
    ],
  };

  const handleCategoryClick = (category) => {
    console.log(`${category} clicked`);
  };

  return (
    <>
      <Navbar toggleLoginModal={toggleLoginModal} />
      <Login
        isOpen={isLoginOpen}
        onClose={toggleLoginModal}
        switchMode={switchToRegister} // Optional for switching to Register
      />
      <Register
        isOpen={isRegisterOpen}
        onClose={toggleRegisterModal}
        switchMode={switchToLogin} // Optional for switching to Login
      />
      {/* Hero Section */}
      <section
        className="relative z-10 bg-cover bg-center py-20 md:py-28 lg:py-32 px-6 md:px-16 lg:px-32 rounded-3xl max-w-7xl mx-auto mt-8 bg-transparent"
        style={{ backgroundImage: `url(${assets.HeaderImg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
        <div
          className={`relative z-10 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto transition-opacity duration-[3000ms] ease-in-out ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-lg md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Order your favourite food here
            </h1>
            <p className="text-light-beige text-base md:text-lg mb-6 text-opacity-10">
              Choose from a diverse menu featuring a delectable array of dishes
              crafted with the finest ingredients and culinary expertise. Our
              mission is to satisfy your cravings and elevate your dining
              experience, one delicious meal at a time.
            </p>
            <button className="px-6 py-3 bg-maroon text-light-beige text-lg rounded-full hover:bg-dark-brown transition-all">
              View Menu
            </button>
          </div>
        </div>
      </section>

      {/* Explore Menu Section */}
      <section className="bg-white py-12 md:py-20 px-6 md:px-16 lg:px-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-brown mb-4 text-left">
            Explore our menu
          </h2>
          <p className="text-dark-gray text-base md:text-lg mb-10 text-left">
            Choose from a diverse menu featuring a delectable array of dishes.
            Our mission is to satisfy your cravings and elevate your dining
            experience, one delicious meal at a time.
          </p>

          {/* Slider */}
          <Slider {...sliderSettings}>
            {[
              { name: "Salad", img: assets.salad },
              { name: "Rolls", img: assets.rolls },
              { name: "Desserts", img: assets.dessert },
              { name: "Sandwich", img: assets.sandwich },
              { name: "Cake", img: assets.cake },
              { name: "Pure Veg", img: assets.veg },
              { name: "Pasta", img: assets.pasta },
              { name: "Noodles", img: assets.noddles },
              { name: "Coffee", img: assets.coffee },
              { name: "pizza", img: assets.pizza },
              { name: "Hot Soup", img: assets.soup },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center px-2 cursor-pointer"
                onClick={() => handleCategoryClick(item.name)}
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-dark-brown text-sm md:text-base font-medium mr-8 md:mr-8 sm:mr-8">
                  {item.name}
                </p>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      {/* Horizontal Line Below the Item Section */}
      <div className="mt-8 mb-12 flex justify-center items-center">
        <hr className="w-3/4 h-1 rounded-full bg-gradient-to-r from-maroon to-dark-brown border-0" />
      </div>
      {/* Menu Items Section */}
      <section className="bg-white py-12 md:py-20 px-6 md:px-16 lg:px-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-brown mb-6">
            Top Dishes Near You
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Grill Basa Fish",
                price: "₹700",
                img: assets.Grillbasafish,
              },
              {
                name: "Chicken Biryani",
                price: "₹900",
                img: assets.chickenbiryani,
              },
              {
                name: "Chicken Parmesan",
                price: "₹650",
                img: assets.chickenparmesan,
              },
              {
                name: "Hot Mexican Pizza",
                price: "₹1200",
                img: assets.mexican_Pizza,
              },
              {
                name: "BBQ Prawns",
                price: "₹850",
                img: assets.BBQPrawns,
              },
              {
                name: "Bologna Pizza",
                price: "₹1150",
                img: assets.BolognaPizza,
              },
              {
                name: "Spring Roll",
                price: "₹280",
                img: assets.SpringRoll,
              },
              {
                name: "Mix Fruit Salad",
                price: "₹480",
                img: assets.FruitSalad,
              },

              // Add more items here
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 flex items-center bg-white rounded-full shadow-md">
                    <button className="w-8 h-8 text-center text-white bg-maroon rounded-full hover:bg-dark-brown transition">
                      +
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-dark-brown">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Food provides essential nutrients for overall health and
                    well-being.
                  </p>
                  <p className="text-lg font-bold text-maroon">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
