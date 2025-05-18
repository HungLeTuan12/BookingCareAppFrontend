import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalSpecialties: 0,
    newPatientsThisMonth: 0,
    appointmentsThisMonth: 0,
    patientGrowth: 0,
    topSpecialties: [],
    doctorsBySpecialty: {},
    appointmentsOverDays: [],
    patientGrowthOverDays: [],
    topHours: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/booking/stats`
        );
        setStats(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        setStats({
          totalDoctors: 24,
          totalPatients: 150,
          totalAppointments: 300,
          totalSpecialties: 5,
          newPatientsThisMonth: 50,
          appointmentsThisMonth: 120,
          patientGrowth: 15.5,
          topSpecialties: [
            { name: "Tim Mạch", count: 30 },
            { name: "Phụ Sản", count: 25 },
            { name: "Da Liễu", count: 20 },
          ],
          doctorsBySpecialty: {
            "Tim Mạch": 8,
            "Phụ Sản": 6,
            "Da Liễu": 4,
            Nhi: 3,
            "Thần Kinh": 3,
          },
          appointmentsOverDays: Array(30)
            .fill(0)
            .map((_, i) => (i % 5) + 2),
          patientGrowthOverDays: Array(30)
            .fill(0)
            .map((_, i) => (i % 3) + 1),
          topHours: [
            { name: "8:00 - 9:00", count: 40 },
            { name: "9:00 - 10:00", count: 35 },
            { name: "14:00 - 15:00", count: 30 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Tạo nhãn cho 30 ngày
  const getDayLabels = () => {
    const labels = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(
        date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
      );
    }
    return labels;
  };

  // Biểu đồ lịch hẹn 30 ngày
  const appointmentsOverDaysData = {
    labels: getDayLabels(),
    datasets: [
      {
        label: "Lịch hẹn",
        data: stats.appointmentsOverDays,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // Biểu đồ tăng trưởng bệnh nhân 30 ngày
  const patientGrowthOverDaysData = {
    labels: getDayLabels(),
    datasets: [
      {
        label: "Bệnh nhân mới",
        data: stats.patientGrowthOverDays,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // Biểu đồ phân bố bác sĩ theo chuyên khoa
  const doctorsBySpecialtyData = {
    labels: Object.keys(stats.doctorsBySpecialty),
    datasets: [
      {
        label: "Số bác sĩ",
        data: Object.values(stats.doctorsBySpecialty),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        hoverOffset: 20,
      },
    ],
  };

  // Cấu hình chung cho biểu đồ Line
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
        ticks: {
          font: { size: 12 },
          color: "#666",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
        ticks: {
          font: { size: 12 },
          color: "#666",
          maxTicksLimit: 10,
          autoSkip: true,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // Cấu hình cho biểu đồ Pie
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <Layout title="Quản lý">
      <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Tiêu đề chính */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
              Trang quản lý
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Tổng quan hoạt động bệnh viện - Cập nhật ngày{" "}
              {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>

          {/* Thẻ Thống Kê Tổng Quan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              {
                title: "Tổng Số Bác Sĩ",
                value: stats.totalDoctors,
                color: "bg-indigo-50 border-indigo-100 text-indigo-700",
              },
              {
                title: "Tổng Số Bệnh Nhân",
                value: stats.totalPatients,
                color: "bg-purple-50 border-purple-100 text-purple-700",
              },
              {
                title: "Tổng Số Lịch Hẹn",
                value: stats.totalAppointments,
                color: "bg-yellow-50 border-yellow-100 text-yellow-700",
              },
              {
                title: "Tổng Số Chuyên Khoa",
                value: stats.totalSpecialties,
                color: "bg-blue-50 border-blue-100 text-blue-700",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${item.color} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
              >
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-3xl font-bold mt-3">
                  {loading ? "Đang tải..." : item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Thẻ Xu Hướng Tăng Trưởng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: "Bệnh Nhân Mới Tháng Này",
                value: stats.newPatientsThisMonth,
                color: "bg-green-50 border-green-100 text-green-700",
              },
              {
                title: "Lịch Hẹn Tháng Này",
                value: stats.appointmentsThisMonth,
                color: "bg-orange-50 border-orange-100 text-orange-700",
              },
              {
                title: "Tăng Trưởng Bệnh Nhân",
                value: `${stats.patientGrowth >= 0 ? "+" : ""}${
                  stats.patientGrowth
                }%`,
                color: `${
                  stats.patientGrowth >= 0
                    ? "bg-teal-50 border-teal-100 text-teal-700"
                    : "bg-red-50 border-red-100 text-red-700"
                }`,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${item.color} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
              >
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-3xl font-bold mt-3">
                  {loading ? "Đang tải..." : item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Top Chuyên Khoa */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Top 3 Chuyên Khoa Theo Số Lịch Hẹn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-gray-500 italic col-span-3 text-center">
                  Đang tải...
                </p>
              ) : stats.topSpecialties.length > 0 ? (
                stats.topSpecialties.map((specialty, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <h4 className="font-semibold text-lg text-gray-700">
                      {specialty.name}
                    </h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {specialty.count} lịch hẹn
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic col-span-3 text-center">
                  Chưa có dữ liệu
                </p>
              )}
            </div>
          </div>

          {/* Top Giờ Khám */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Top 3 Giờ Khám Được Ưa Chuộng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-gray-500 italic col-span-3 text-center">
                  Đang tải...
                </p>
              ) : stats.topHours.length > 0 ? (
                stats.topHours.map((hour, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <h4 className="font-semibold text-lg text-gray-700">
                      {hour.name}
                    </h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {hour.count} lịch hẹn
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic col-span-3 text-center">
                  Chưa có dữ liệu
                </p>
              )}
            </div>
          </div>

          {/* Biểu Đồ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Biểu đồ lịch hẹn 30 ngày */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Lịch Hẹn 30 Ngày Gần Nhất
              </h3>
              <div className="h-96">
                <Line
                  data={appointmentsOverDaysData}
                  options={{
                    ...lineChartOptions,
                    scales: {
                      ...lineChartOptions.scales,
                      y: {
                        ...lineChartOptions.scales.y,
                        title: {
                          ...lineChartOptions.scales.y.title,
                          text: "Số Lịch Hẹn",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Biểu đồ tăng trưởng bệnh nhân 30 ngày */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Bệnh Nhân Mới 30 Ngày Gần Nhất
              </h3>
              <div className="h-96">
                <Line
                  data={patientGrowthOverDaysData}
                  options={{
                    ...lineChartOptions,
                    scales: {
                      ...lineChartOptions.scales,
                      y: {
                        ...lineChartOptions.scales.y,
                        title: {
                          ...lineChartOptions.scales.y.title,
                          text: "Số Bệnh Nhân Mới",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Biểu đồ phân bố bác sĩ theo chuyên khoa */}
            <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Phân Bố Bác Sĩ Theo Chuyên Khoa
              </h3>
              <div className="h-96 max-w-2xl mx-auto">
                <Pie data={doctorsBySpecialtyData} options={pieChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
