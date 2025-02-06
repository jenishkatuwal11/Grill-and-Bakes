import { useState } from "react";
import { useDispatch } from "react-redux"; // Add Redux hooks
import { loginUser } from "../../services/authService"; // API call for login
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";

const Login = ({ isOpen, onClose, switchMode }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch(); // Initialize dispatch
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});
    try {
      const response = await loginUser(
        {
          username: formData.username,
          password: formData.password,
        },
        dispatch // ✅ Pass dispatch to instantly update Redux
      );

      if (response.user.role === "admin") {
        setErrors({ form: "Admins are not allowed to log in here." });
        setIsLoading(false);
        return;
      }

      // ✅ User profile updates instantly in Redux without reload
      setSuccessMessage("Login successful!");

      setTimeout(() => {
        setFormData({ username: "", password: "" });
        setSuccessMessage("");
        onClose();
      }, 1000);
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "Login failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={() => {
            setFormData({ username: "", password: "" }); // Reset form
            setErrors({});
            setSuccessMessage("");
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition duration-300"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errors.form && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
            {errors.form}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={`mt-1 block w-full px-4 py-2 text-gray-800 bg-gray-50 border ${
                errors.username
                  ? "border-red-500"
                  : "border-gray-300 focus:border-maroon"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.username ? "focus:ring-red-500" : "focus:ring-maroon"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <span className="mr-2 text-sm">❗</span>
                {errors.username}
              </p>
            )}
          </div>
          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`mt-1 block w-full px-4 py-2 text-gray-800 bg-gray-50 border ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-maroon"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.password ? "focus:ring-red-500" : "focus:ring-maroon"
                }`}
              />
              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-maroon focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <span className="mr-2 text-sm">❗</span>
                {errors.password}
              </p>
            )}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-maroon rounded-lg hover:bg-dark-brown transition duration-300"
            disabled={isLoading} // Disable while loading
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Dont have an account?{" "}
          <span
            onClick={switchMode}
            className="text-maroon hover:underline hover:text-dark-brown transition cursor-pointer"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  switchMode: PropTypes.func.isRequired, // Required for toggling between Login and Register modals
};

export default Login;
