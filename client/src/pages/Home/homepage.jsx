import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice"; // ✅ Import Cart Actions
import Slider from "react-slick";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import assets from "../../assets/assets";
import Footer from "../../components/Footer/Footer";

const HomePage = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [fadeIn, setFadeIn] = useState(false);

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

  const getItemQuantity = (itemName) => {
    const item = cartItems.find((item) => item.name === itemName);
    return item ? item.quantity : 0;
  };

  return (
    <>
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
            <p className="text-light-beige text-base md:text-lg mb-6">
              Choose from a diverse menu featuring a delectable array of dishes
              crafted with the finest ingredients and culinary expertise.
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
              { name: "Pizza", img: assets.pizza },
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
                <p className="mt-2 text-dark-brown text-sm md:text-base font-medium">
                  {item.name}
                </p>
              </div>
            ))}
          </Slider>
        </div>
      </section>

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
              { name: "BBQ Prawns", price: "₹850", img: assets.BBQPrawns },
              {
                name: "Bologna Pizza",
                price: "₹1150",
                img: assets.BolognaPizza,
              },
              { name: "Spring Roll", price: "₹280", img: assets.SpringRoll },
              {
                name: "Mix Fruit Salad",
                price: "₹480",
                img: assets.FruitSalad,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 flex items-center bg-white rounded-full shadow-md">
                    {getItemQuantity(item.name) > 0 ? (
                      <>
                        <button
                          onClick={() => dispatch(decreaseQuantity(item.name))}
                          className="w-7 h-7 flex items-center justify-center text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                        >
                          <FaMinus />
                        </button>
                        <span className="text-maroon font-semibold text-lg w-8 text-center">
                          {getItemQuantity(item.name)}
                        </span>
                        <button
                          onClick={() => dispatch(increaseQuantity(item.name))}
                          className="w-7 h-7 flex items-center justify-center text-white bg-green-500 rounded-full"
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() => dispatch(removeFromCart(item.name))}
                          className="w-7 h-7 flex items-center justify-center text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => dispatch(addToCart(item))}
                        className="w-8 h-8 flex items-center justify-center text-white bg-maroon rounded-full hover:bg-dark-brown transition"
                      >
                        <FaPlus />
                      </button>
                    )}
                  </div>
                </div>
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
