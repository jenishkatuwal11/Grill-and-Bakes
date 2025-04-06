import { useState } from "react";
import axios from "axios";
import Footer from "../../components/Footer/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ success: null, message: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({ success: null, message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8001/api/contact",
        formData
      );
      setStatus({ success: true, message: response.data.message });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      setStatus({ success: false, message: msg });
    }
  };

  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-maroon mb-4 relative">
            <span className="relative z-10">Contact Us</span>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-3 w-24 bg-maroon/20 rounded-full"></span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Have any questions or concerns? Feel free to reach out to us.
            We&apos;re here to help you 24/7!
          </p>
        </div>

        {/* Form & Info */}
        <div className="flex flex-wrap items-start justify-center max-w-7xl w-full gap-10">
          {/* Contact Form */}
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full lg:w-1/2 border border-gray-100">
            <h2 className="text-2xl font-semibold text-dark-brown mb-6 flex items-center">
              <span className="w-2 h-6 bg-maroon rounded-full mr-3"></span>
              Send Us a Message
            </h2>

            {/* ✅ Status Message */}
            {status.message && (
              <div
                className={`mb-4 text-sm px-4 py-2 rounded ${
                  status.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status.message}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-maroon text-white py-3 px-4 rounded-lg hover:bg-dark-brown transition-all flex items-center justify-center shadow-lg"
              >
                <span>Submit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          {/* Keep your contact info section as it is */}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;
