import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <FaTimesCircle className="text-red-500 text-6xl mb-4" />
      <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
      <p className="text-gray-700 mb-6">
        Something went wrong with your payment. Please try again.
      </p>
      <Link
        to="/checkout"
        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
      >
        Try Again
      </Link>
    </div>
  );
};

export default PaymentFailed;
