import Footer from "../../components/Footer/Footer";

const ContactUs = () => {
  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-16 px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-maroon mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Have any questions or concerns? Feel free to reach out to us. We’re
            here to help you 24/7!
          </p>
        </div>

        {/* Contact Form and Info */}
        <div className="flex flex-wrap items-start justify-center max-w-7xl w-full gap-10">
          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-lg p-8 w-full lg:w-1/2">
            <h2 className="text-2xl font-semibold text-dark-brown mb-6">
              Send Us a Message
            </h2>
            <form className="space-y-6">
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
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none"
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
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none"
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
                  placeholder="Write your message here"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-maroon text-white py-2 px-4 rounded-lg hover:bg-dark-brown transition-all"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col space-y-6 w-full lg:w-1/3">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-dark-brown mb-4">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Phone:</strong> +1 234 567 890
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Email:</strong> support@yourwebsite.com
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> 123 Main Street, City, Country
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-dark-brown mb-4">
                Business Hours
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
              </p>
              <p className="text-gray-600">
                <strong>Saturday - Sunday:</strong> Closed
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;
