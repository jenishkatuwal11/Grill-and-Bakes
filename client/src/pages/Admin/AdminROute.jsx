import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
  const { user, role } = useSelector((state) => state.auth);

  // Check if the user is logged in and has the "admin" role
  if (!user || role !== "admin") {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "admin") {
          return <Outlet />;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("authToken");
      }
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
