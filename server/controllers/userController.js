const User = require("../models/Users");

//  Fetch all users
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 10; // default to 10 users per page
    const skip = (page - 1) * limit;

    // Fetch total count for pagination
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });

    // Paginated users
    const users = await User.find(
      { role: { $ne: "admin" } },
      "username email role"
    )
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Toggle user active/inactive (Optional)
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
    console.error(" Error toggling user status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUsers, toggleUserStatus };
