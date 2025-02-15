import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS Components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [filter, setFilter] = useState("last30days");

  // Sales Data (Dummy Data for Now)
  const salesData = {
    totalRevenue: "$15,230",
    totalOrders: 325,
    bestSellers: [
      { name: "Cheese Burger", sales: 85 },
      { name: "Pepperoni Pizza", sales: 72 },
      { name: "Iced Coffee", sales: 65 },
      { name: "Grilled Chicken", sales: 50 },
      { name: "Pasta Alfredo", sales: 48 },
    ],
  };

  // Order Status Breakdown (Dummy Data)
  const orderStatusData = {
    pending: 45,
    preparing: 30,
    delivered: 210,
    canceled: 40,
  };

  // Sales Bar Chart Data
  const salesChartData = {
    labels: salesData.bestSellers.map((item) => item.name),
    datasets: [
      {
        label: "Best Selling Items",
        data: salesData.bestSellers.map((item) => item.sales),
        backgroundColor: [
          "#3B82F6",
          "#F59E0B",
          "#10B981",
          "#EF4444",
          "#6366F1",
        ],
      },
    ],
  };

  // Order Status Pie Chart Data
  const orderChartData = {
    labels: ["Pending", "Preparing", "Delivered", "Canceled"],
    datasets: [
      {
        label: "Orders",
        data: [
          orderStatusData.pending,
          orderStatusData.preparing,
          orderStatusData.delivered,
          orderStatusData.canceled,
        ],
        backgroundColor: ["#FBBF24", "#3B82F6", "#10B981", "#EF4444"],
      },
    ],
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📊 Reports & Analytics
      </h2>

      {/* Filter Controls */}
      <div className="flex justify-end mb-6">
        <select
          className="border border-gray-300 p-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="custom">Custom Date</option>
        </select>
      </div>

      {/* Sales Overview */}
      <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-gray-700 mb-4">
          💰 Sales Overview
        </h3>
        <p className="text-gray-600 text-lg">
          Total Revenue:{" "}
          <span className="text-green-600 font-bold">
            {salesData.totalRevenue}
          </span>
        </p>
        <p className="text-gray-600 text-lg">
          Total Orders:{" "}
          <span className="text-blue-600 font-bold">
            {salesData.totalOrders}
          </span>
        </p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Selling Items - Bar Chart */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            🔥 Best Selling Items
          </h3>
          <Bar data={salesChartData} />
        </div>

        {/* Order Status Breakdown - Pie Chart */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            📦 Order Status Breakdown
          </h3>
          <Pie data={orderChartData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
