import { useState } from "react";
import {
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaBan,
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [filter, setFilter] = useState("last7days");

  // Quick Stats Data (Added Cancel Orders)
  const stats = [
    {
      title: "Total Orders",
      value: "1,250",
      icon: <FaShoppingCart />,
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: "320",
      icon: <FaUsers />,
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "$25,460",
      icon: <FaDollarSign />,
      color: "bg-yellow-500",
    },
    {
      title: "Pending Orders",
      value: "15",
      icon: <FaClock />,
      color: "bg-red-500",
    },
    {
      title: "Total Orders Canceled",
      value: "30",
      icon: <FaBan />,
      color: "bg-gray-500",
    },
  ];

  // Line Chart Data (Orders Trend)
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [25, 40, 30, 50, 60, 80, 90],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Bar Chart Data (Revenue per Category)
  const barData = {
    labels: ["Drinks", "Meals", "Snacks"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 12000, 8000],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  return (
    <div className="p-6 md:p-8 ml-0 md:ml-64 max-w-full">
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold text-dark-brown text-center">
        Welcome to Admin Dashboard
      </h1>
      <p className="text-gray-700 text-center mt-2">
        Manage your orders, users, and reports here.
      </p>

      {/* Filters Dropdown */}
      <div className="flex justify-end mt-6">
        <select
          className="p-2 border rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="custom">Custom Date</option>
        </select>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-5 rounded-lg shadow-md flex items-center space-x-4 text-white ${stat.color}`}
          >
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Orders Trend (Line Chart) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Orders Trend (Last 7 Days)
          </h3>
          <Line data={lineData} />
        </div>

        {/* Revenue per Category (Bar Chart) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Revenue by Category
          </h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
