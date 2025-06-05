import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/items/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItem();
  }, [id]);

  if (!item)
    return <p className="text-center mt-20">Loading item details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
      <img
        src={`${API_BASE_URL}${item.image}`}
        alt={item.name}
        className="w-full max-w-md h-auto rounded-lg mb-4"
      />
      <p className="text-lg mb-2 text-gray-700">{item.description}</p>
      <p className="text-xl font-semibold text-blue-600">रु{item.price}</p>
    </div>
  );
};

export default ItemDetails;
