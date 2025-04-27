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
          "http://localhost:8080/api/v1/booking/stats"
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
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <Layout title="Dashboard Giám Đốc">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Tổng Quan Bệnh Viện</h2>

        {/* Thẻ Thống Kê Tổng Quan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="font-medium text-indigo-700">Tổng Số Bác Sĩ</h3>
            <p className="text-2xl font-bold mt-2">
              {loading ? "Đang tải..." : stats.totalDoctors}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-medium text-purple-700">Tổng Số Bệnh Nhân</h3>
            <p className="text-2xl font-bold mt-2">
              {loading ? "Đang tải..." : stats.totalPatients}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="font-medium text-yellow-700">Tổng Số Lịch Hẹn</h3>
            <p className="text-2xl font-bold mt-2">
              {loading ? "Đang tải..." : stats.totalAppointments}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-700">Tổng Số Chuyên Khoa</h3>
            <p className="text-2xl font-bold mt-2">
              {loading ? "Đang tải..." : stats.totalSpecialties}
            </p>
          </div>
        </div>

        {/* Thẻ Xu Hướng Tăng Trưởng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-medium text-green-700">
              Bệnh Nhân Mới Tháng Này
            </h3>
            <p className="text-2xl font-bold mt-2">
              {loading ? "Đang tải..." : stats.newPatientsThisMonth}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h3 className="font-medium text-orange-700">Lịch Hẹn Tháng Này</h3>
            <p className="text-2xl font-bold mt-2">
              {loading ? "Đang tải..." : stats.appointmentsThisMonth}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg border ${
              stats.patientGrowth >= 0
                ? "bg-teal-50 border-teal-100"
                : "bg-red-50 border-red-100"
            }`}
          >
            <h3
              className={`font-medium ${
                stats.patientGrowth >= 0 ? "text-teal-700" : "text-red-700"
              }`}
            >
              Tăng Trưởng Bệnh Nhân
            </h3>
            <p className="text-2xl font-bold mt-2">
              {loading
                ? "Đang tải..."
                : `${stats.patientGrowth >= 0 ? "+" : ""}${
                    stats.patientGrowth
                  }%`}
            </p>
          </div>
        </div>

        {/* Top Chuyên Khoa */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-medium text-gray-700 mb-4">
            Top 3 Chuyên Khoa Theo Số Lịch Hẹn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <p>Đang tải...</p>
            ) : stats.topSpecialties.length > 0 ? (
              stats.topSpecialties.map((specialty, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border"
                >
                  <h4 className="font-medium text-gray-700">
                    {specialty.name}
                  </h4>
                  <p className="text-xl font-bold mt-2">
                    {specialty.count} lịch hẹn
                  </p>
                </div>
              ))
            ) : (
              <p>Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Top Giờ Khám */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-medium text-gray-700 mb-4">
            Top 3 Giờ Khám Được Ưa Chuộng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <p>Đang tải...</p>
            ) : stats.topHours.length > 0 ? (
              stats.topHours.map((hour, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border"
                >
                  <h4 className="font-medium text-gray-700">{hour.name}</h4>
                  <p className="text-xl font-bold mt-2">
                    {hour.count} lịch hẹn
                  </p>
                </div>
              ))
            ) : (
              <p>Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Biểu Đồ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Biểu đồ lịch hẹn 30 ngày */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-700 mb-4">
              Lịch Hẹn 30 Ngày Gần Nhất
            </h3>
            <div className="h-64">
              <Line
                data={appointmentsOverDaysData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Số Lịch Hẹn",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Ngày",
                      },
                      ticks: {
                        maxTicksLimit: 10, // Giới hạn số nhãn trên trục x để dễ đọc
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Biểu đồ tăng trưởng bệnh nhân 30 ngày */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-700 mb-4">
              Bệnh Nhân Mới 30 Ngày Gần Nhất
            </h3>
            <div className="h-64">
              <Line
                data={patientGrowthOverDaysData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Số Bệnh Nhân Mới",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Ngày",
                      },
                      ticks: {
                        maxTicksLimit: 10,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Biểu đồ phân bố bác sĩ theo chuyên khoa */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-700 mb-4">
              Phân Bố Bác Sĩ Theo Chuyên Khoa
            </h3>
            <div className="h-64">
              <Pie
                data={doctorsBySpecialtyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
