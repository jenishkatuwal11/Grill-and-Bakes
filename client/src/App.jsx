import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/Home/homepage";
import MobileApp from "./pages/Mobile_App/mobileApp";
import ContactUs from "./pages/ContactUs/contactUs";
import Cart from "./pages/Cart/Carts";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
import AuthWrapper from "./components/AuthWrapper";

const App = () => {
  // State for modal visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Modal handlers
  const toggleLoginModal = () => {
    setIsLoginOpen(!isLoginOpen);
    setIsRegisterOpen(false); // Ensure only one modal is open
  };

  const toggleRegisterModal = () => {
    setIsRegisterOpen(!isRegisterOpen);
    setIsLoginOpen(false); // Ensure only one modal is open
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <AuthWrapper>
      <Router>
        {/* Navbar with toggleLoginModal prop */}
        <Navbar toggleLoginModal={toggleLoginModal} />

        {/* Login and Register Modals */}
        <Login
          isOpen={isLoginOpen}
          onClose={toggleLoginModal}
          switchMode={switchToRegister}
        />
        <Register
          isOpen={isRegisterOpen}
          onClose={toggleRegisterModal}
          switchMode={switchToLogin}
        />

        {/* Routes */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mobile-app" element={<MobileApp />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </AuthWrapper>
  );
};

export default App;
