import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

// Register Chart.js components and the datalabels plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Sponsored = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchCategoryDistribution = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/order/get-category-distribution/${user.email}`
        );

        console.log("API Response:", response.data);

        if (response.data.success) {
          setCategoryData(response.data.categoryPercentage);
        } else {
          console.error("Failed to fetch category distribution");
        }
      } catch (error) {
        console.error("Error fetching category distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDistribution();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (categoryData.length === 0) {
    return <div>No category data available</div>;
  }

  // Calculate total for percentage calculation
  const totalValue = categoryData.reduce(
    (sum, item) => sum + parseFloat(item.percentage),
    0
  );

  // Pie Chart Data
  const chartData = {
    labels: categoryData.map((item) => item.category),
    datasets: [
      {
        label: "Product Categories",
        data: categoryData.map((item) => parseFloat(item.percentage)),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  // Chart Options with Percentage Display
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            let value = context.raw;
            let percentage = ((value / totalValue) * 100).toFixed(2);
            return `${label}: ${percentage}%`;
          },
        },
      },
      datalabels: {
        display: true,
        formatter: (value) => {
          let percentage = ((value / totalValue) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl">
      <div className="w-full max-w-lg">
        <h2 className="text-center text-xl font-semibold mb-4">
          Customer Purchase Distribution
        </h2>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Sponsored;
