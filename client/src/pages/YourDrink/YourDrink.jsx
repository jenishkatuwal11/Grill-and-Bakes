import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import axios from "axios";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";

const YourDrink = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/items");
      console.log("API Response:", response.data);

      if (Array.isArray(response.data.items)) {
        setDrinks(response.data.items);
      } else {
        console.error("Error: API did not return an array", response.data);
        setDrinks([]);
      }
    } catch (err) {
      console.error("Error fetching drinks:", err);
      setDrinks([]);
    }
  };

  const getItemQuantity = (itemId) => {
    const item = cartItems.find((cartItem) => cartItem.itemId === itemId);
    return item ? item.quantity : 0;
  };

  const categorizedDrinks = {
    "Custom Drinks": drinks.filter((drink) => drink.category === "Drinks"),
    "Chef Favorite": drinks.filter(
      (drink) => drink.category === "Chef Favorite"
    ),
    Beverages: drinks.filter((drink) => drink.category === "Beverages"),
  };

  return (
    <>
      <div className="px-6 md:px-16 lg:px-32 py-10">
        {Object.entries(categorizedDrinks).map(([category, items], idx) => (
          <section key={idx} className="mb-12">
            <h2 className="text-3xl font-bold text-dark-brown mb-6">
              {category}
            </h2>
            {/* <hr className="mb-4 border-maroon-400" /> */}
            <hr className="w-3/4 mx-0 my-6 h-1 border-0 bg-gradient-to-r from-maroon to-transparent" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {items.map((drink) => (
                <div
                  key={drink._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden relative transition-all hover:shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={
                        drink.image.startsWith("/")
                          ? `http://localhost:8001${drink.image}`
                          : drink.image
                      }
                      alt={drink.name}
                      className="w-full h-40 object-cover"
                      onError={(e) => (e.target.src = "fallback-image.jpg")}
                    />
                    <div className="absolute bottom-2 right-2 flex items-center justify-center bg-white rounded-full shadow-md ">
                      {getItemQuantity(drink._id) > 0 ? (
                        <>
                          <button
                            onClick={() =>
                              dispatch(decreaseQuantity(drink._id))
                            }
                            className="w-7 h-7 flex items-center justify-center text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                          >
                            <FaMinus />
                          </button>
                          <span className="text-maroon font-semibold text-lg w-8 text-center">
                            {getItemQuantity(drink._id)}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(increaseQuantity(drink._id))
                            }
                            className="w-7 h-7 flex items-center justify-center text-white bg-green-500 rounded-full hover:bg-green-600 transition"
                          >
                            <FaPlus />
                          </button>
                          <button
                            onClick={() => dispatch(removeFromCart(drink._id))}
                            className="w-7 h-7 flex items-center justify-center text-red-500 hover:text-dark-brown transition"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => dispatch(addToCart(drink))}
                          className="w-7 h-7 flex items-center justify-center text-white bg-maroon rounded-full hover:bg-dark-brown transition"
                        >
                          <FaPlus />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {drink.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {drink.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-maroon">
                        रु. {drink.price}
                      </p>
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
