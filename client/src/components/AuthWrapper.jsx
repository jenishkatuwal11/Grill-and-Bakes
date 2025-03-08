import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../redux/slices/authSlices";
import { fetchCart } from "../redux/slices/cartSlice";
import API from "../services/api"; // ✅ API service imported
import PropTypes from "prop-types";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await API.get("/auth/user", {
          withCredentials: true, // ✅ Ensure cookies are sent
        });

        if (response.data.user && response.data.user.role === "user") {
          dispatch(
            setUser({ user: response.data.user, role: response.data.user.role })
          );

          dispatch(fetchCart()); // ✅ Fetch user's cart after setting user
        } else {
          dispatch(logout()); // ✅ Logout if no user session or admin
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
        dispatch(logout()); // ✅ Ensure logout if error occurs
      }
    };

    checkUserSession(); // ✅ Run on mount
  }, [dispatch]);

  return <>{children}</>;
};

AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthWrapper;
