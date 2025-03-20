const User = require("../models/Users");

// ✅ Fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      { role: { $ne: "admin" } },
      "username email role"
    ); // Fetch only necessary fields
    res.status(200).json({ users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Toggle user active/inactive (Optional)
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle active/inactive status
    user.active = !user.active;
    await user.save();

    res.status(200).json({ message: "User status updated", user });
  } catch (error) {
    console.error("❌ Error toggling user status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUsers, toggleUserStatus };
