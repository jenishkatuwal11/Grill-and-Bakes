import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../redux/slices/authSlices";
import { jwtDecode } from "jwt-decode"; // Ensure this is correctly imported
import PropTypes from "prop-types";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const userToken = localStorage.getItem("userAuthToken");
    const adminToken = localStorage.getItem("adminAuthToken");

    const decodeAndSetUser = (token, role) => {
      try {
        const decoded = jwtDecode(token);

        // Check if token has expired
        if (decoded.exp * 1000 < Date.now()) {
          console.warn(`${role} token expired. Logging out...`);
          localStorage.removeItem(
            role === "admin" ? "adminAuthToken" : "userAuthToken"
          );
          dispatch(logout());
          return;
        }

        dispatch(
          setUser({
            user: {
              username: decoded.username,
              email: decoded.email,
              role: decoded.role,
              _id: decoded.id,
            },
            role: decoded.role,
          })
        );
      } catch (error) {
        console.error(`Error decoding ${role} token:`, error);
        localStorage.removeItem(
          role === "admin" ? "adminAuthToken" : "userAuthToken"
        ); // Remove invalid token
        dispatch(logout()); // Ensure state is cleared
      }
    };

    if (userToken) decodeAndSetUser(userToken, "user");
    if (adminToken) decodeAndSetUser(adminToken, "admin");
  }, [dispatch]);

  return <>{children}</>;
};

AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthWrapper;
