import { useState } from "react";
import { FaCamera, FaSave, FaUndo, FaEye, FaEyeSlash } from "react-icons/fa";

const Setting = () => {
  // State Variables
  const [name, setName] = useState("Jenis Katuwal");
  const [email, setEmail] = useState("jenishkatuwal7@gmail.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Handle Profile Picture Upload
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle Save Changes
  const handleSaveChanges = () => {
    alert("Settings Saved Successfully! ");
  };

  // Handle Reset to Default
  const handleReset = () => {
    setName("Jenis Katuwal");
    setEmail("jenishkatuwal7@gmail.com");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setNotifications(true);
    setPushNotifications(false);
    setProfilePic(null);
    setPreview(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        ⚙️ Account Settings
      </h2>

      <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-6">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full shadow-md"
            />
          ) : (
            <div className="w-32 h-32 border-2 border-gray-300 flex items-center justify-center rounded-full">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <label className="mt-3 bg-blue-500 text-white px-5 py-2 rounded-lg cursor-pointer flex items-center space-x-2 hover:shadow-lg transition-all">
            <FaCamera /> <span>Change Profile</span>
            <input
              type="file"
              className="hidden"
              onChange={handleProfilePicUpload}
            />
          </label>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Change Password */}
        <h3 className="text-lg font-semibold text-gray-700 mt-6">
          Change Password
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              Current Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute top-11 right-4 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Preferences */}
        <h3 className="text-lg font-semibold text-gray-700 mt-6">
          Preferences
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span>Enable Email Notifications</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
            />
            <span>Enable Push Notifications</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center space-x-2"
            onClick={handleReset}
          >
            <FaUndo />
            <span>Reset to Default</span>
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
            onClick={handleSaveChanges}
          >
            <FaSave />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
