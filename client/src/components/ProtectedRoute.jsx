import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types"; // ✅ Import PropTypes

const ProtectedRoute = ({ allowedRoles }) => {
  const { adminToken } = useSelector((state) => state.auth);

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

// ✅ Add PropTypes validation
ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensure `allowedRoles` is an array of strings
};

export default ProtectedRoute;
