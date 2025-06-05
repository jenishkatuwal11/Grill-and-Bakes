import { useState, useEffect } from "react";
import { FaShoppingCart, FaUsers, FaClock, FaBan } from "react-icons/fa";
import { TbCurrencyRupeeNepalese } from "react-icons/tb";
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
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    canceledOrders: 0,
    orderTrend: [],
    categoryRevenue: {},
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        const data = await res.json();
        setDashboardData({
          ...data.stats,
          orderTrend: data.orderTrend,
          categoryRevenue: data.categoryRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // every 60s

    return () => clearInterval(interval); // cleanup
  }, []);

  const stats = [
    {
      title: "Total Orders",
      value: dashboardData.totalOrders,
      icon: <FaShoppingCart />,
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: dashboardData.activeUsers,
      icon: <FaUsers />,
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: `Rs. ${dashboardData.totalRevenue}`,
      icon: <TbCurrencyRupeeNepalese />,
      color: "bg-yellow-500",
    },
    {
      title: "Pending Orders",
      value: dashboardData.pendingOrders,
      icon: <FaClock />,
      color: "bg-red-500",
    },
    {
      title: "Total Orders Canceled",
      value: dashboardData.canceledOrders,
      icon: <FaBan />,
      color: "bg-gray-500",
    },
  ];

  const lineData = {
    labels: dashboardData.orderTrend.map((day) => day._id),
    datasets: [
      {
        label: "Orders",
        data: dashboardData.orderTrend.map((day) => day.count),
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: Object.keys(dashboardData.categoryRevenue),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(dashboardData.categoryRevenue),
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  return (
    <div className="p-6 md:p-8 ml-0 md:ml-64 max-w-full">
      <h1 className="text-2xl font-bold text-dark-brown text-center">
        Welcome to Admin Dashboard
      </h1>
      <p className="text-gray-700 text-center mt-2">
        Manage your orders, users, and reports here.
      </p>

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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Orders Trend ({filter})
          </h3>
          <Line data={lineData} />
        </div>

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
