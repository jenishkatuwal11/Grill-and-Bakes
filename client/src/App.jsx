import { useState } from "react";
import HomePage from "./pages/Home/homepage";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";

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
    <>
      {/* Pass the function to toggle Login modal */}
      <HomePage toggleLoginModal={() => setIsLoginOpen(true)} />
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        switchMode={switchToRegister} // Switch to Register modal
      />
      <Register
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        switchMode={switchToLogin} // Switch to Login modal
      />
    </>
  );
};

export default App;
