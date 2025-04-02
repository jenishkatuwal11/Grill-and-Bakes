import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";
import { placeOrder } from "../../redux/slices/orderSlice";
import OrderSuccessModal from "../../components/OrderSuccessModal/OrderSuccessModal";

const KhaltiVerify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Read token & amount from Khalti redirect URL
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const amount = query.get("amount");

  useEffect(() => {
    const verifyAndPlaceOrder = async () => {
      if (!token || !amount || !user) {
        alert("Invalid or incomplete payment information.");
        navigate("/checkout");
        return;
      }

      try {
        // Step 1: Verify Khalti Payment
        const verifyRes = await fetch(
          "http://localhost:8001/api/payment/khalti/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, amount }),
          }
        );

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
          alert("Khalti Payment Verification Failed");
          return navigate("/checkout");
        }

        // Step 2: Place Order
        const totalAmount = cartItems.reduce(
          (total, item) => total + item.quantity * parseFloat(item.price),
          0
        );

        const orderData = {
          items: cartItems.map((item) => ({
            itemId: item.itemId || item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice: totalAmount,
          contact: user.phone || "", // optional: replace with actual form value if needed
          address: user.address || "", // optional: replace with actual form value if needed
        };

        await dispatch(placeOrder(orderData)).unwrap();
        dispatch(clearCart());
        setOrderSuccess(true);
      } catch (err) {
        console.error("Khalti Verify or Order Error:", err);
        alert("Something went wrong. Try again.");
        navigate("/checkout");
      } finally {
        setLoading(false);
      }
    };

    verifyAndPlaceOrder();
  }, [token, amount, user, cartItems, dispatch, navigate]);

  if (loading) {
    return <p className="text-center mt-10">Verifying payment...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-4 bg-white shadow-md rounded">
      <OrderSuccessModal
        isOpen={orderSuccess}
        onClose={() => navigate("/myorders")}
      />
    </div>
  );
};

export default KhaltiVerify;
