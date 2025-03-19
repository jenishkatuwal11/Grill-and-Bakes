import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { setUser } from "../../redux/slices/authSlices";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/admin/login", formData, {
        withCredentials: true, //  Ensure cookies are sent
      });

      console.log("Admin Login Response:", response.data); // Debugging log

      if (!response.data || !response.data.adminToken || !response.data.user) {
        throw new Error("Invalid response format: No user data");
      }

      const { user, adminToken } = response.data;

      // ✅ Store admin user in Redux (No more localStorage)
      dispatch(setUser({ user, token: adminToken }));

      // ✅ Save to localStorage
      localStorage.setItem("adminToken", adminToken);
      localStorage.setItem("adminData", JSON.stringify({ user }));

      console.log("Admin Login Success:", user); // Debugging log

      // ✅ Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.messag);
      //setError(err.message);
      // err.response?.data?.message || "Login failed. Please try again."
      //);
      console.error("Admin Login Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
