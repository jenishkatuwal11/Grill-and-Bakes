import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlices";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const UserInfo = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 cursor-pointer">
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="rounded-full w-10 h-10"
        />
        <span className="text-gray-700 font-medium">{user.username}</span>
      </div>
      <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-40 py-2">
        <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

UserInfo.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired, // Ensure username is a required string
  }),
};

export default UserInfo;
