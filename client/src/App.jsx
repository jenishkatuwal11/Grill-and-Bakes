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
// Admin Routes
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ActiveUsers from "./pages/Admin/ActiveUsers";
import AddItems from "./pages/Admin/AddItems";
import OrderStatus from "./pages/Admin/OrderStatus";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Setting";
import AdminLayout from "./pages/Admin/AdminLayout";

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toggleLoginModal = () => {
    setIsLoginOpen(!isLoginOpen);
    setIsRegisterOpen(false);
  };

  const toggleRegisterModal = () => {
    setIsRegisterOpen(!isRegisterOpen);
    setIsLoginOpen(false);
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
        {/* Conditional rendering for Navbar */}
        {!window.location.pathname.startsWith("/admin") && (
          <Navbar toggleLoginModal={toggleLoginModal} />
        )}

        {/* Modals for Login and Register */}
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

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/mobile-app" element={<MobileApp />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes with Layout */}
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="add-items" element={<AddItems />} />
                  <Route path="orders" element={<OrderStatus />} />
                  <Route path="users" element={<ActiveUsers />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </AdminLayout>
            }
          />
        </Routes>
      </Router>
    </AuthWrapper>
  );
};

export default App;
