import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import assets from "../../assets/assets";

const YourDrink = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // Function to get item quantity from Redux store
  const getItemQuantity = (drinkName) => {
    const item = cartItems.find((item) => item.name === drinkName);
    return item ? item.quantity : 0;
  };

  // Drink Sections Data
  const sections = [
    {
      title: "Custom Drinks",
      drinks: [
        {
          name: "Mango Smoothie",
          img: assets.MangoSmoothie,
          price: "₹250",
          description: "A tropical blend of mangoes and yogurt.",
        },
        {
          name: "Berry Blast",
          img: assets.BerryBlast,
          price: "₹300",
          description: "A mix of berries for a refreshing taste.",
        },
        {
          name: "Tropical Fizz",
          img: assets.TropicalFizz,
          price: "₹270",
          description: "A fizzy delight with citrus flavors.",
        },
      ],
      showCustomizeButton: true,
    },
    {
      title: "Chef Favorite",
      drinks: [
        {
          name: "Signature Latte",
          img: assets.SignatureLatte,
          price: "₹180",
          description: "Rich espresso with steamed milk.",
        },
        {
          name: "Espresso Shot",
          img: assets.EspressoShot,
          price: "₹150",
          description: "A bold and strong coffee shot.",
        },
        {
          name: "Caramel Macchiato",
          img: assets.CaramelMacchiato,
          price: "₹200",
          description: "Sweet caramel espresso with foamed milk.",
        },
        {
          name: "Vanilla Frappe",
          img: assets.VanillaFrappe,
          price: "₹230",
          description: "Creamy vanilla blended with ice.",
        },
      ],
      showCustomizeButton: false,
    },
    {
      title: "Beverages",
      drinks: [
        {
          name: "Lemon Iced Tea",
          img: assets.LemonIcedTea,
          price: "₹160",
          description: "Refreshing iced tea with lemon.",
        },
        {
          name: "Mocha Coffee",
          img: assets.MochaCoffee,
          price: "₹190",
          description: "Espresso with chocolate and steamed milk.",
        },
        {
          name: "Matcha Latte",
          img: assets.MatchaLatte,
          price: "₹210",
          description: "Japanese matcha with warm milk.",
        },
        {
          name: "Hot Chocolate",
          img: assets.HotChocolate,
          price: "₹220",
          description: "Smooth and creamy chocolate drink.",
        },
      ],
      showCustomizeButton: false,
    },
  ];

  return (
    <>
      <div className="px-6 md:px-16 lg:px-32 py-10">
        {sections.map((section, idx) => (
          <section key={idx} className="mb-12">
            <h2 className="text-3xl font-bold text-dark-brown mb-6">
              {section.title}
            </h2>
            <hr className="mb-4 border-gray-300" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {section.drinks.map((drink, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg overflow-hidden relative transition-all hover:shadow-xl"
                >
                  {/* Drink Image */}
                  <div className="relative">
                    <img
                      src={drink.img}
                      alt={drink.name}
                      className="w-full h-40 object-cover"
                    />

                    {/* Add Button - Bottom-Right of Image */}
                    <div className="absolute bottom-2 right-2 flex items-center justify-center bg-white rounded-full shadow-md ">
                      {getItemQuantity(drink.name) > 0 ? (
                        <>
                          <button
                            onClick={() =>
                              dispatch(decreaseQuantity(drink.name))
                            }
                            className="w-7 h-7 flex items-center justify-center text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                          >
                            <FaMinus />
                          </button>
                          <span className="text-maroon font-semibold text-lg w-8 text-center">
                            {getItemQuantity(drink.name)}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(increaseQuantity(drink.name))
                            }
                            className="w-7 h-7  flex items-center justify-center text-white bg-green-500 rounded-full hover:bg-green-600 transition"
                          >
                            <FaPlus />
                          </button>
                          <button
                            onClick={() => dispatch(removeFromCart(drink.name))}
                            className="w-7 h-7 flex items-center justify-center text-red-500 hover:text-dark-brown transition"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => dispatch(addToCart(drink))}
                          className="w-7 h-7  flex items-center justify-center text-white bg-maroon rounded-full hover:bg-dark-brown transition"
                        >
                          <FaPlus />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Drink Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {drink.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {drink.description}
                    </p>

                    {/* Price & Customize Button */}
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-maroon">
                        {drink.price}
                      </p>
                      {section.showCustomizeButton && (
                        <button className="px-1 py-1 bg-maroon text-white rounded-2xl text-sm hover:bg-dark-brown transition">
                          Customize
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default YourDrink;
