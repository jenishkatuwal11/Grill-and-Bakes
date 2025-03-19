import PropTypes from "prop-types"; // Import PropTypes
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import HomePage from "./pages/Home/homepage";
import MobileApp from "./pages/Mobile_App/mobileApp";
import ContactUs from "./pages/ContactUs/contactUs";
import YourDrink from "./pages/YourDrink/YourDrink";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
import AuthWrapper from "./components/AuthWrapper";
import Checkout from "./pages/Checkout/Checkout";
// Admin Routes
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ActiveUsers from "./pages/Admin/ActiveUsers";
import AddItems from "./pages/Admin/AddItems";
import OrderStatus from "./pages/Admin/OrderStatus";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Setting";
import AdminLayout from "./pages/Admin/AdminLayout";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { adminToken, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // ✅ Check authentication
  const isAuthenticated = adminToken || token;
  const isAdmin = adminToken && allowedRoles.includes("admin");
  const isUser = token && allowedRoles.includes("user");

  // ✅ Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to={allowedRoles.includes("admin") ? "/admin/login" : "/login"}
        replace
        state={{ from: location }}
      />
    );
  }

  // ✅ Redirect if role mismatch
  if (!isAdmin && allowedRoles.includes("admin")) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!isUser && allowedRoles.includes("user")) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired, // Ensure element is a React element
  allowedRoles: PropTypes.arrayOf(PropTypes.string), // Ensure allowedRoles is an array of strings
};

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
    <Router>
      <AuthWrapper>
        <Layout
          isLoginOpen={isLoginOpen}
          isRegisterOpen={isRegisterOpen}
          toggleLoginModal={toggleLoginModal}
          toggleRegisterModal={toggleRegisterModal}
          switchToRegister={switchToRegister}
          switchToLogin={switchToLogin}
        />
      </AuthWrapper>
    </Router>
  );
};

// ✅ Pass Props to Layout Component
const Layout = ({
  isLoginOpen,
  isRegisterOpen,
  toggleLoginModal,
  toggleRegisterModal,
  switchToRegister,
  switchToLogin,
}) => {
  const location = useLocation();

  return (
    <>
      {/* ✅ Hide Navbar for Admin Pages */}
      {!location.pathname.startsWith("/admin") && (
        <Navbar toggleLoginModal={toggleLoginModal} />
      )}

      {/* ✅ Login/Register Modals */}
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
        {/* ✅ Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/mobile-app" element={<MobileApp />} />
        <Route path="/your-drink" element={<YourDrink />} />
        <Route path="/contact-us" element={<ContactUs />} />

        {/* ✅ Protected Route: Only Authenticated Users */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute
              element={<Checkout />}
              allowedRoles={["user", "admin"]}
            />
          }
        />

        {/* ✅ Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ✅ Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute
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
              allowedRoles={["admin"]}
            />
          }
        />
      </Routes>
    </>
  );
};

Layout.propTypes = {
  isLoginOpen: PropTypes.bool.isRequired,
  isRegisterOpen: PropTypes.bool.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
  toggleRegisterModal: PropTypes.func.isRequired,
  switchToRegister: PropTypes.func.isRequired,
  switchToLogin: PropTypes.func.isRequired,
};

export default App;
