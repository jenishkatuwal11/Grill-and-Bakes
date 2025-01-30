import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlices"; // Adjust the path as needed
import { jwtDecode } from "jwt-decode";

import PropTypes from "prop-types"; // Import PropTypes

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const user = jwtDecode(token); // Decode token to extract user info
        dispatch(setUser(user)); // Update Redux store with user info
      } catch (error) {
        console.error("Error decoding token:", error);
        // Clear invalid token
        localStorage.removeItem("authToken");
      }
    }
  }, [dispatch]);

  return <>{children}</>;
};

// Add PropTypes validation
AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children are valid React nodes and required
};

export default AuthWrapper;
