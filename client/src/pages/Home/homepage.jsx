import { useState, useEffect } from "react";
import Slider from "react-slick";
import assets from "../../assets/assets"; // Ensure correct paths for your images
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const HomePage = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in effect after the component mounts
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: false, // Stop infinite scrolling
    speed: 500, // Smooth slide transition
    slidesToShow: 8, // Default for large screens
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Medium screens
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // Small screens
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480, // Extra small screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
    ],
  };

  // Handle click events for images
  const handleCategoryClick = (category) => {
    console.log(`${category} clicked`);
    // Placeholder for navigation to category-specific dishes
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative z-10 bg-cover bg-center py-20 md:py-28 lg:py-32 px-6 md:px-16 lg:px-32 rounded-3xl max-w-7xl mx-auto mt-8"
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

      <Footer />
    </>
  );
};

export default HomePage;
