import Footer from "../../components/Footer/Footer";
import mobileAppGif from "../../assets/video/MobileApp.gif";

const MobileAppPage = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center bg-gray-100 min-h-screen px-6 py-12">
        {/* GIF Section */}
        <div
          className="w-40 max-w-md"
          style={{
            backgroundColor: "transparent", // Ensure transparent background
          }}
        >
          <img
            src={mobileAppGif}
            alt="Dancing Character"
            className="w-full h-auto rounded-lg bg-transparent shadow-lg"
            style={{
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          />
        </div>

        {/* App Announcement Section */}
        <div className="mt-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-brown mb-4">
            We’re launching our mobile app soon!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Stay tuned for our app on the Play Store and Apple Store to enjoy a
            seamless ordering experience.
          </p>
          {/* App Store and Play Store Icons */}
          <div className="flex justify-center space-x-6">
            {/* Google Play Store Badge */}
            <a
              href="#"
              className="transition-transform transform hover:scale-105"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play Store"
                className="h-14"
              />
            </a>
            {/* Apple App Store Badge */}
            <a
              href="#"
              className="transition-transform transform hover:scale-105"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Apple Store"
                className="h-14"
              />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default MobileAppPage;
