import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/homepage";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
import MobileApp from "./pages/Mobile_App/mobileApp";
import ContactUs from "./pages/ContactUs/contactUs";
import Cart from "./pages/Cart/Carts";

const App = () => {
  // State to manage modal visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Functions to switch between Login and Register modals
  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <Router>
      {/* Modals */}
      {isLoginOpen && (
        <Login
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          switchMode={switchToRegister} // Switch to Register modal
        />
      )}
      {isRegisterOpen && (
        <Register
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          switchMode={switchToLogin} // Switch to Login modal
        />
      )}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={<HomePage toggleLoginModal={() => setIsLoginOpen(true)} />}
        />
        <Route path="/mobile-app" element={<MobileApp />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
