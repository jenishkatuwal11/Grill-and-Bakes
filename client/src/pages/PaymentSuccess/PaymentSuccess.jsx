import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Move useSelector outside useEffect
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyAndPlaceOrder = async () => {
      const query = new URLSearchParams(location.search);
      const pidx = query.get("pidx");

      const orderDataString = localStorage.getItem("pendingOrder");
      const orderData = orderDataString ? JSON.parse(orderDataString) : null;

      console.log(" Received pidx:", pidx);
      console.log(" orderData:", orderData);
      console.log(" user:", user);

      if (!pidx || !orderData || !user?.id) {
        console.error(" Missing pidx, orderData, or userId");
        alert("Missing payment verification data.");
        return navigate("/");
      }

      try {
        const verifyRes = await fetch(
          "http://localhost:8001/api/payment/khalti/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pidx,
              orderData,
              userId: user.id,
            }),
          }
        );

        const verifyData = await verifyRes.json();
        console.log(" Khalti Verification Response:", verifyData);

        if (verifyData.success) {
          setSuccess(true);
          dispatch(clearCart());
          localStorage.removeItem("pendingOrder");
        } else {
          console.error(" Verification failed:", verifyData);
          alert("Khalti verification failed.");
          navigate("/");
        }
      } catch (err) {
        console.error(" Order Placement Error:", err);
        alert("Something went wrong after payment.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    verifyAndPlaceOrder();
  }, [location, dispatch, navigate, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center text-lg">
        Verifying Payment...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      {success ? (
        <>
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-700 mb-6">
            Thank you for your order. Your payment via Khalti has been verified.
          </p>
          <Link
            to="/"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Go to Homepage
          </Link>
        </>
      ) : (
        <p className="text-red-600 font-semibold">Order could not be placed.</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
