import { useState } from "react";
import { registerUser } from "../../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";

const Register = ({ isOpen, onClose, switchMode }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setSuccessMessage("You have successfully registered!");
        setTimeout(() => {
          handleClose();
          switchMode();
        }, 2000);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        if (errorMessage.includes("Email")) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.includes("Username")) {
          setErrors({ username: errorMessage });
        } else {
          setErrors({ form: errorMessage });
        }
      }
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setSuccessMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition duration-300"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Sign Up
        </h2>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`mt-1 block w-full px-4 py-2 text-gray-800 bg-gray-50 border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-maroon"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-maroon"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <span className="mr-2 text-sm">❗</span>
                {errors.email}
              </p>
            )}
          </div>

          {[
            {
              label: "Password",
              name: "password",
              showPassword,
              setShowPassword,
            },
            {
              label: "Confirm Password",
              name: "confirmPassword",
              showPassword: showConfirmPassword,
              setShowPassword: setShowConfirmPassword,
            },
          ].map((field) => (
            <div className="relative" key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-600"
              >
                {field.label}
              </label>
              <input
                type={field.showPassword ? "text" : "password"}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                className={`mt-1 block w-full px-4 py-2 text-gray-800 bg-gray-50 border ${
                  errors[field.name]
                    ? "border-red-500"
                    : "border-gray-300 focus:border-maroon"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors[field.name]
                    ? "focus:ring-red-500"
                    : "focus:ring-maroon"
                }`}
              />
              <button
                type="button"
                onClick={() => field.setShowPassword(!field.showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-maroon focus:outline-none"
              >
                {field.showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <span className="mr-2 text-sm">❗</span>
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-maroon rounded-lg hover:bg-dark-brown transition duration-300"
          >
            Register
          </button>
        </form>

        {errors.form && (
          <div className="bg-red-100 text-red-700 p-4 rounded mt-4 text-center">
            {errors.form}
          </div>
        )}

        <div className="text-center mt-6 text-sm text-gray-600">
          Do you have an account?{" "}
          <span
            onClick={switchMode}
            className="text-maroon hover:underline hover:text-dark-brown transition cursor-pointer"
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  switchMode: PropTypes.func.isRequired, // Required for toggling between Login and Register modals
};

export default Register;
