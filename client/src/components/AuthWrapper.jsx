import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../redux/slices/authSlices";
import { fetchCart } from "../redux/slices/cartSlice";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreAuthState = () => {
      const adminToken = localStorage.getItem("adminToken");
      const userToken = localStorage.getItem("authToken");
      const storedAdmin = JSON.parse(localStorage.getItem("adminData"));
      const storedUser = JSON.parse(localStorage.getItem("userData"));

      //  Check Admin Authentication First
      if (adminToken && storedAdmin) {
        try {
          const decodedAdmin = jwtDecode(adminToken);

          if (decodedAdmin.exp * 1000 < Date.now()) {
            console.warn("Admin Token expired, logging out...");
            dispatch(logout("admin"));
            return;
          }

          dispatch(setUser({ user: storedAdmin.user, token: adminToken }));
          return; //  Prevent checking user if admin is logged in
        } catch (error) {
          console.error(" Error decoding admin token:", error);
          dispatch(logout("admin"));
          return;
        }
      }

      // Check User Authentication
      if (userToken && storedUser) {
        try {
          const decodedUser = jwtDecode(userToken);

          if (decodedUser.exp * 1000 < Date.now()) {
            console.warn("User Token expired, logging out...");
            dispatch(logout());
            return;
          }

          dispatch(setUser({ user: storedUser.user, token: userToken }));
          dispatch(fetchCart()); //  Load cart after authentication
        } catch (error) {
          console.error(" Error decoding user token:", error);
          dispatch(logout());
        }
      }
    };

    restoreAuthState();
  }, [dispatch]);

  return <>{children}</>;
};

AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthWrapper;
