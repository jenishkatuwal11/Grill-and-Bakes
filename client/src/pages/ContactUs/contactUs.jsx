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

  // Services offered
  const services = [
    { name: "Delivery", icon: "truck" },
    { name: "Takeaway", icon: "bag-shopping" },
    { name: "Dine in", icon: "utensils" },
    { name: "Outdoor seating", icon: "umbrella-beach" },
    { name: "Online booking", icon: "calendar-check" },
    { name: "Reservations", icon: "book" },
    { name: "In-store collection", icon: "store" },
  ];

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 px-6">
        {/* Hero Section with animated elements */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-64 h-64 rounded-full bg-maroon animate-pulse"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-maroon mb-6 relative">
            <span className="relative z-10 tracking-tight">Get in Touch</span>
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-3 w-32 bg-maroon/30 rounded-full"></span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Have any questions or concerns? We&apos;re always ready to help you
            with any queries. Our team is available 24/7!
          </p>
        </div>

        {/* Services Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-dark-brown relative inline-block">
              Our Services
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-maroon/40 rounded-full"></span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-4 transition-all hover:shadow-xl hover:scale-105 border border-gray-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-maroon/10 rounded-full flex items-center justify-center text-maroon">
                  <i className={`fas fa-${service.icon}`}></i>
                </div>
                <span className="font-medium text-gray-700">
                  {service.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form & Contact Info */}
        <div className="flex flex-wrap items-stretch justify-center max-w-7xl mx-auto gap-10">
          {/* Contact Form */}
          <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 w-full lg:w-1/2 border border-gray-100 relative overflow-hidden transition-all hover:shadow-maroon/20">
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-maroon/5 rounded-full"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-maroon/5 rounded-full"></div>

            <h2 className="text-3xl font-semibold text-dark-brown mb-8 flex items-center">
              <span className="w-1.5 h-8 bg-maroon rounded-full mr-3"></span>
              Send Us a Message
            </h2>

            {/* Status Message */}
            {status.message && (
              <div
                className={`mb-6 px-6 py-4 rounded-lg shadow-inner ${
                  status.success
                    ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                    : "bg-red-50 text-red-700 border-l-4 border-red-500"
                } flex items-center`}
              >
                <div
                  className={`mr-3 ${
                    status.success ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <i
                    className={`fas fa-${
                      status.success ? "check-circle" : "exclamation-circle"
                    } text-lg`}
                  ></i>
                </div>
                <p>{status.message}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="group">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2 ml-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <i className="fas fa-user"></i>
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon focus:border-transparent focus:outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2 ml-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon focus:border-transparent focus:outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2 ml-1"
                >
                  Message
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-gray-400">
                    <i className="fas fa-comment-alt"></i>
                  </div>
                  <textarea
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here"
                    required
                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon focus:border-transparent focus:outline-none transition-all bg-gray-50 focus:bg-white"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-maroon text-white py-4 px-6 rounded-xl hover:bg-dark-brown transition-all flex items-center justify-center shadow-lg hover:shadow-maroon/30 group"
              >
                <span className="text-lg font-medium">Submit Message</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
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
          <div className="w-full lg:w-2/5">
            <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-100 mb-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-maroon/5 rounded-full"></div>

              <h2 className="text-3xl font-semibold text-dark-brown mb-8 flex items-center">
                <span className="w-1.5 h-8 bg-maroon rounded-full mr-3"></span>
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center text-maroon mr-4 mt-1">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-800 mb-1">
                      Our Location
                    </h3>
                    <p className="text-gray-600">
                      Kapan marg - Chakrapath, Kathmandu, Nepal 44600
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center text-maroon mr-4 mt-1">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-800 mb-1">
                      Phone Number
                    </h3>
                    <p className="text-gray-600">+977 01-4017680</p>
                    <p className="text-gray-600">+977 984-1475282</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center text-maroon mr-4 mt-1">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-800 mb-1">
                      Email Address
                    </h3>
                    <p className="text-gray-600">
                      info.grillandbakes@gmail.com
                    </p>
                    {/* <p className="text-gray-600">support@restaurant.com</p> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-maroon text-white shadow-2xl rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-10 -mb-10"></div>

              <h2 className="text-2xl font-semibold mb-6">Opening Hours</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">09:00 AM - 09:30 PM</span>
                </div>
                <div className="h-px bg-white/20"></div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">09:00 AM - 09:30 PM</span>
                </div>
                <div className="h-px bg-white/20"></div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">09:00 AM - 09:30 PM</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center space-x-4">
                <a
                  href="https://www.facebook.com/Grillandbakes/"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <i className="fab fa-facebook-f text-white"></i>
                </a>
                <a
                  href="https://www.instagram.com/grillandbakes/?fbclid=IwY2xjawJtfZdleHRuA2FlbQIxMAABHjLw8_IEpdJelPWJu5WIbFqo42n2RXp-r3oLAHOnXyOs167wvktlGzypYQHr_aem_6zQoMyw85yAtj5heVg0iUg#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <i className="fab fa-instagram text-white"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add FontAwesome in the real implementation */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <Footer />
    </>
  );
};

export default ContactUs;
