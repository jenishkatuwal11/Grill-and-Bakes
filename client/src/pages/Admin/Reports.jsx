import { useEffect, useState } from "react";
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    bestSellers: [],
    orderStatusData: {
      pending: 0,
      preparing: 0,
      delivered: 0,
      canceled: 0,
    },
  });
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const params = new URLSearchParams({ range: filter });

        if (filter === "custom" && startDate && endDate) {
          params.set("startDate", startDate);
          params.set("endDate", endDate);
        }

        const res = await fetch(
          `http://localhost:8001/api/admin/reports/filter?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );

        const data = await res.json();
        setReportData(data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      }
    };

    fetchReports();
  }, [filter, startDate, endDate]); //  clean now

  const salesChartData = {
    labels: reportData.bestSellers.map((item) => item.name),
    datasets: [
      {
        label: "Best Selling Items",
        data: reportData.bestSellers.map((item) => item.sales),
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

  const orderChartData = {
    labels: ["Pending", "Preparing", "Delivered", "Canceled"],
    datasets: [
      {
        label: "Orders",
        data: [
          reportData.orderStatusData.pending,
          reportData.orderStatusData.preparing,
          reportData.orderStatusData.delivered,
          reportData.orderStatusData.canceled,
        ],
        backgroundColor: ["#FBBF24", "#3B82F6", "#10B981", "#EF4444"],
      },
    ],
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📊 Reports & Analytics
      </h2>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 justify-end items-center mb-6">
        <select
          className="border border-gray-300 p-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="custom">Custom Date</option>
        </select>

        {filter === "custom" && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded-lg"
            />
          </>
        )}
      </div>

      {/* Sales Overview */}
      <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-gray-700 mb-4">
          💰 Sales Overview
        </h3>
        <p className="text-gray-600 text-lg">
          Total Revenue:{" "}
          <span className="text-green-600 font-bold">
            रु {reportData.totalRevenue}
          </span>
        </p>
        <p className="text-gray-600 text-lg">
          Total Orders:{" "}
          <span className="text-blue-600 font-bold">
            {reportData.totalOrders}
          </span>
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            🔥 Best Selling Items
          </h3>
          <Bar data={salesChartData} />
        </div>

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
