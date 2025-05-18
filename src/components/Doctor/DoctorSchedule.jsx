import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  Calendar,
  Filter,
  ArrowRight,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPageWrapper, {
  childVariants,
} from "../Default/AnimatedPageWrapper";
import Layout from "../Default/Layout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DoctorScheduleForm = ({ doctorId }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [weekSchedule, setWeekSchedule] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getMonday(new Date())
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("schedule");
  const [loadingStates, setLoadingStates] = useState({
    fetchSchedule: false,
    fetchBookings: false,
    fetchStatistics: false,
    submitSchedule: false,
    deleteSchedule: false,
    approveBooking: false,
    rejectBooking: false,
    sendReminders: false,
  });
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [messageSendReminders, setMessageSendReminders] = useState("");

  doctorId = localStorage.getItem("userId");

  // Cập nhật danh sách hours với khung giờ 30 phút
  const hours = [
    { id: 1, name: "7h00 - 7h30", startHour: 7, startMinute: 0 },
    { id: 2, name: "7h30 - 8h00", startHour: 7, startMinute: 30 },
    { id: 3, name: "8h00 - 8h30", startHour: 8, startMinute: 0 },
    { id: 4, name: "8h30 - 9h00", startHour: 8, startMinute: 30 },
    { id: 5, name: "9h00 - 9h30", startHour: 9, startMinute: 0 },
    { id: 6, name: "9h30 - 10h00", startHour: 9, startMinute: 30 },
    { id: 7, name: "10h00 - 10h30", startHour: 10, startMinute: 0 },
    { id: 8, name: "10h30 - 11h00", startHour: 10, startMinute: 30 },
    { id: 9, name: "13h00 - 13h30", startHour: 13, startMinute: 0 },
    { id: 10, name: "13h30 - 14h00", startHour: 13, startMinute: 30 },
    { id: 11, name: "14h00 - 14h30", startHour: 14, startMinute: 0 },
    { id: 12, name: "14h30 - 15h00", startHour: 14, startMinute: 30 },
    { id: 13, name: "15h00 - 15h30", startHour: 15, startMinute: 0 },
    { id: 14, name: "15h30 - 16h00", startHour: 15, startMinute: 30 },
    { id: 15, name: "16h00 - 16h30", startHour: 16, startMinute: 0 },
    { id: 16, name: "16h30 - 17h00", startHour: 16, startMinute: 30 },
  ];

  function getMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchWeeklySchedule = async () => {
    setLoadingStates((prev) => ({ ...prev, fetchSchedule: true }));
    try {
      const startDate = new Date(currentWeekStart);
      const endDate = new Date(currentWeekStart);
      endDate.setDate(endDate.getDate() + 6);

      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/schedule/doctor/${doctorId}`,
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        }
      );

      setWeekSchedule(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy lịch làm việc:", error);
      toast.error("Có lỗi xảy ra khi lấy lịch làm việc!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, fetchSchedule: false }));
    }
  };

  const fetchPendingBookings = async () => {
    setLoadingStates((prev) => ({ ...prev, fetchBookings: true }));
    try {
      const params = { doctorId };
      if (filterStatus) params.status = filterStatus;
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        params.endDate = end.toISOString();
      }
      if (searchTerm) params.searchTerm = searchTerm;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/pending/${doctorId}`,
        { params }
      );
      setPendingBookings(response.data || []);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách lịch hẹn!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, fetchBookings: false }));
    }
  };

  const fetchStatistics = async () => {
    setLoadingStates((prev) => ({ ...prev, fetchStatistics: true }));
    try {
      const params = { doctorId };
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        params.endDate = end.toISOString();
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/statistics/${doctorId}`,
        { params }
      );
      setStatistics(response.data || {});
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu thống kê!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, fetchStatistics: false }));
    }
  };

  const formatDateForAPI = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    const startDate = new Date(currentWeekStart);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(formatDateForAPI(date));
    }

    return dates;
  };

  const getSlotsForDate = (date) => {
    const daySchedule = weekSchedule.filter((schedule) => {
      const scheduleDate = schedule.date;
      return scheduleDate === date;
    });
    return daySchedule.map((schedule) => schedule.hourId);
  };

  const getScheduleForDateAndHour = (date, hourId) => {
    return weekSchedule.find((schedule) => {
      const scheduleDate = schedule.date;
      return scheduleDate === date && schedule.hourId === hourId;
    });
  };

  // Cập nhật hàm isHourDisabled với startMinute
  const isHourDisabled = (slotId, selectedDate) => {
    if (!selectedDate) return false;

    const currentTime = new Date(); // Thời điểm hiện tại: 17h31 ngày 27/04/2025
    const selectedDateTime = new Date(selectedDate);
    const slot = hours.find((h) => h.id === slotId);
    if (!slot) return false;

    const slotStartTime = new Date(selectedDateTime);
    slotStartTime.setHours(slot.startHour, slot.startMinute, 0, 0);

    return slotStartTime < currentTime;
  };

  // Hàm xử lý khi thay đổi ngày
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    // Làm mới selectedSlots: Chỉ giữ lại các khung giờ hợp lệ với ngày mới
    const validSlots = selectedSlots.filter(
      (slotId) => !isHourDisabled(slotId, newDate)
    );
    setSelectedSlots(validSlots);

    // Nếu không còn khung giờ nào hợp lệ, thông báo cho người dùng
    if (selectedSlots.length > 0 && validSlots.length === 0) {
      toast.warn(
        "Các khung giờ đã chọn không hợp lệ với ngày mới và đã bị xóa!"
      );
    }
  };

  // Hàm nhảy sang ngày tiếp theo
  const goToNextDay = () => {
    if (!selectedDate) return;

    const currentDate = new Date(selectedDate);
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);

    // Kiểm tra nếu ngày tiếp theo nhỏ hơn ngày tối thiểu (27/04/2025)
    const minDate = new Date();
    if (nextDate < minDate) {
      toast.error("Không thể chọn ngày trong quá khứ!");
      return;
    }

    const formattedNextDate = formatDateForAPI(nextDate);
    setSelectedDate(formattedNextDate);

    // Làm mới selectedSlots: Chỉ giữ lại các khung giờ hợp lệ với ngày mới
    const validSlots = selectedSlots.filter(
      (slotId) => !isHourDisabled(slotId, formattedNextDate)
    );
    setSelectedSlots(validSlots);

    // Nếu không còn khung giờ nào hợp lệ, thông báo cho người dùng
    if (selectedSlots.length > 0 && validSlots.length === 0) {
      toast.warn(
        "Các khung giờ đã chọn không hợp lệ với ngày mới và đã bị xóa!"
      );
    }
  };

  const toggleSlot = (slotId) => {
    if (isHourDisabled(slotId, selectedDate)) {
      toast.error("Không thể chọn khung giờ đã qua!");
      return;
    }

    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleSelectAll = () => {
    const validSlots = hours
      .filter((slot) => !isHourDisabled(slot.id, selectedDate))
      .map((slot) => slot.id);

    if (validSlots.length === 0) {
      toast.error("Không có khung giờ nào hợp lệ để chọn!");
      return;
    }

    setSelectedSlots(validSlots);
    toast.success("Đã chọn tất cả khung giờ hợp lệ!");
  };

  const handleEditSchedule = (date, hourId) => {
    const schedule = getScheduleForDateAndHour(date, hourId);
    if (schedule) {
      if (schedule.isBooked) {
        toast.error("Không thể sửa lịch đã được đặt!");
        return;
      }
      setScheduleToEdit({ schedule, date, hourId });
      setShowEditModal(true);
    }
  };

  const confirmEditSchedule = () => {
    if (!scheduleToEdit) return;

    const { schedule, date, hourId } = scheduleToEdit;
    setIsEditing(true);
    setEditingScheduleId(schedule.id);
    setSelectedDate(schedule.date);
    setSelectedSlots([schedule.hourId]);
    setEditingCell({ date, hourId });
    setShowEditModal(false);
    setScheduleToEdit(null);
  };

  const handleDeleteSchedule = (date, hourId) => {
    const schedule = getScheduleForDateAndHour(date, hourId);
    if (schedule) {
      setScheduleToDelete(schedule);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    setLoadingStates((prev) => ({ ...prev, deleteSchedule: true }));
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/schedule/${scheduleToDelete.id}`
      );
      toast.success("Xóa lịch thành công!");
      fetchWeeklySchedule();
    } catch (error) {
      console.error("Lỗi khi xóa lịch:", error);
      toast.error(error.response?.data || "Có lỗi xảy ra khi xóa lịch!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, deleteSchedule: false }));
      setShowDeleteModal(false);
      setScheduleToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || selectedSlots.length === 0) {
      toast.error("Vui lòng chọn ngày và ít nhất một khung giờ!");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, submitSchedule: true }));
    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/schedule`, {
          id: editingScheduleId,
          doctorId,
          date: selectedDate,
          hourId: selectedSlots[0],
        });
        toast.success("Cập nhật lịch thành công!");
      } else {
        for (const slotId of selectedSlots) {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/schedule`, {
            doctorId,
            date: selectedDate,
            hourId: slotId,
          });
        }
        toast.success("Tạo lịch thành công!");
      }

      const selectedDateObj = new Date(selectedDate);
      setCurrentWeekStart(getMonday(selectedDateObj));

      setSelectedDate("");
      setSelectedSlots([]);
      setIsEditing(false);
      setEditingScheduleId(null);
      setEditingCell(null);
      fetchWeeklySchedule();
    } catch (error) {
      console.error(
        isEditing ? "Lỗi khi cập nhật lịch:" : "Lỗi khi tạo lịch:",
        error
      );
      toast.error(
        isEditing
          ? "Có lỗi xảy ra khi cập nhật lịch!"
          : error.response?.data || "Có lỗi xảy ra khi tạo lịch!"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, submitSchedule: false }));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingScheduleId(null);
    setSelectedDate("");
    setSelectedSlots([]);
    setEditingCell(null);
  };

  const handleApprove = async (bookingId) => {
    setLoadingStates((prev) => ({ ...prev, approveBooking: bookingId }));
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/approve/${bookingId}`
      );
      toast.success("Đã gửi email xác nhận cho bệnh nhân!");
      fetchPendingBookings();
    } catch (error) {
      toast.error(error.response?.data || "Có lỗi xảy ra khi xác nhận!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, approveBooking: false }));
    }
  };

  const handleReject = async (bookingId) => {
    setLoadingStates((prev) => ({ ...prev, rejectBooking: bookingId }));
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/reject/${bookingId}`
      );
      toast.success("Đã từ chối lịch hẹn!");
      fetchPendingBookings();
    } catch (error) {
      toast.error(error.response?.data || "Có lỗi xảy ra khi từ chối!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, rejectBooking: false }));
    }
  };

  const handleSendReminders = async () => {
    setLoadingStates((prev) => ({ ...prev, sendReminders: true }));
    setMessageSendReminders("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/reminders/send`
      );
      setMessageSendReminders(response.data);
      toast.success(response.data);
    } catch (error) {
      const errorMsg =
        error.response?.data || "Có lỗi xảy ra khi gửi email nhắc nhở!";
      setMessageSendReminders(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoadingStates((prev) => ({ ...prev, sendReminders: false }));
    }
  };

  const isFormDisabled =
    isEditing && (!selectedDate || selectedSlots.length === 0);

  useEffect(() => {
    const today = new Date(); // Ngày hiện tại: 27/04/2025
    setSelectedDate(formatDateForAPI(today));
  }, []);

  useEffect(() => {
    fetchWeeklySchedule();
  }, [currentWeekStart, doctorId]);

  useEffect(() => {
    fetchPendingBookings();
  }, [doctorId, filterStatus, startDate, endDate, searchTerm]);

  useEffect(() => {
    if (activeTab === "statistics") {
      fetchStatistics();
    }
  }, [doctorId, startDate, endDate, activeTab]);

  const weekDates = getWeekDates();
  const weekDayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "CN",
  ];

  const getHourName = (idHour) => {
    const hour = hours.find((h) => h.id === idHour);
    return hour ? hour.name : "N/A";
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const clearFilters = () => {
    setFilterStatus("");
    setStartDate(null);
    setEndDate(null);
    setSearchTerm("");
  };

  const isDateInPast = (dateString) => {
    const scheduleDate = new Date(dateString);
    const today = new Date(); // Ngày hiện tại: 27/04/2025
    today.setHours(0, 0, 0, 0);
    return scheduleDate < today;
  };

  const bookingStatusChartData = statistics?.bookingStatusStats
    ? {
        labels: Object.keys(statistics.bookingStatusStats).map((status) =>
          status === "PENDING"
            ? "Đang chờ"
            : status === "SUCCESS"
            ? "Thành công"
            : "Đã hủy"
        ),
        datasets: [
          {
            label: "Số lượng lịch hẹn",
            data: Object.values(statistics.bookingStatusStats),
            backgroundColor: ["#FBBF24", "#10B981", "#EF4444"],
            borderWidth: 1,
          },
        ],
      }
    : {};

  const bookingHourChartData = statistics?.bookingHourStats
    ? {
        labels: Object.keys(statistics.bookingHourStats),
        datasets: [
          {
            label: "Số lượng lịch hẹn",
            data: Object.values(statistics.bookingHourStats),
            backgroundColor: "#3B82F6",
            borderWidth: 1,
          },
        ],
      }
    : {};

  const scheduleBookingRatioChartData = statistics?.scheduleBookingRatio
    ? {
        labels: ["Đã được đặt", "Chưa được đặt"],
        datasets: [
          {
            data: [
              statistics.scheduleBookingRatio.booked,
              statistics.scheduleBookingRatio.notBooked,
            ],
            backgroundColor: ["#10B981", "#D1D5DB"],
            borderWidth: 1,
          },
        ],
      }
    : {};

  const bookingDayOfWeekChartData = statistics?.bookingDayOfWeekStats
    ? {
        labels: Object.keys(statistics.bookingDayOfWeekStats),
        datasets: [
          {
            label: "Số lượng lịch hẹn",
            data: Object.values(statistics.bookingDayOfWeekStats),
            fill: false,
            borderColor: "#8B5CF6",
            tension: 0.1,
          },
        ],
      }
    : {};

  return (
    <Layout>
      <AnimatedPageWrapper className="w-full min-h-screen bg-gray-100 text-sm">
        <div className="section max-w-8xl mx-auto mt-10 p-6 sm:p-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            {/* Title Section */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl sm:text-4xl font-bold uppercase text-gray-800 border-b-2 border-blue-500 inline-block pb-2"
              >
                Quản lý lịch làm việc
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-2 text-gray-600 text-sm sm:text-base"
              >
                Tạo, sửa hoặc xóa lịch làm việc của bạn một cách dễ dàng.
              </motion.p>
            </div>

            {/* Tabs Section */}
            <div className="section mb-6">
              <div className="flex border-b border-gray-200">
                {["schedule", "bookings", "statistics"].map((tab, index) => (
                  <motion.button
                    key={tab}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={childVariants}
                    className={`px-4 py-2 font-semibold transition-all duration-300 ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "schedule"
                      ? "Lịch làm việc"
                      : tab === "bookings"
                      ? "Quản lý lịch hẹn"
                      : "Thống kê"}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <div className="section flex flex-col lg:flex-row gap-6">
                {/* Form Tạo/Sửa Lịch */}
                <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-2xl shadow-md">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <CalendarDays className="text-blue-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">
                      {isEditing ? "Sửa lịch làm việc" : "Tạo lịch làm việc"}
                    </h2>
                  </motion.div>

                  {/* Chọn ngày */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn ngày làm việc <span className="text-red-600">*</span>
                  </label>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={formatDateForAPI(new Date())}
                      className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
                      disabled={isFormDisabled || loadingStates.submitSchedule}
                    />
                    <button
                      onClick={goToNextDay}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
                      disabled={isFormDisabled || loadingStates.submitSchedule}
                      title="Ngày tiếp theo"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>

                  {/* Chọn khung giờ */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn khung giờ <span className="text-red-600">*</span>
                  </label>
                  <div
                    className="max-h-64 overflow-y-auto border rounded-lg p-3 mb-4" // Điều chỉnh max-h-64 (16rem) để thay đổi chiều cao khung giờ
                  >
                    <div
                      className="grid gap-2"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(100px, 1fr))", // Tự động điều chỉnh số cột, min 100px mỗi cột
                      }}
                    >
                      {hours.map((slot, index) => {
                        const disabled = isHourDisabled(slot.id, selectedDate);
                        return (
                          <motion.button
                            key={slot.id}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={childVariants}
                            type="button"
                            onClick={() => toggleSlot(slot.id)}
                            className={`text-xs px-2 py-2 border rounded-lg transition-all duration-300 font-medium shadow-sm relative group ${
                              selectedSlots.includes(slot.id)
                                ? "bg-blue-600 text-white border-blue-600"
                                : disabled
                                ? "bg-gray-200 text-gray-500 border-gray-300"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                            } ${
                              disabled ||
                              isFormDisabled ||
                              loadingStates.submitSchedule
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={
                              disabled ||
                              isFormDisabled ||
                              loadingStates.submitSchedule
                            }
                          >
                            {slot.name}
                            {disabled && (
                              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                                Khung giờ đã qua
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nút Chọn Tất Cả */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onClick={handleSelectAll}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center mb-4"
                    disabled={isFormDisabled || loadingStates.submitSchedule}
                  >
                    Chọn tất cả khung giờ
                  </motion.button>

                  {/* Nút Submit và Hủy */}
                  <div className="flex gap-3">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      onClick={handleSubmit}
                      className="w-full bg-[#06a3da] hover:bg-[#0589b7] text-white py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={isFormDisabled || loadingStates.submitSchedule}
                    >
                      {loadingStates.submitSchedule ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={18} />
                          Đang xử lý...
                        </>
                      ) : (
                        <>{isEditing ? "Cập nhật lịch" : "Tạo lịch làm việc"}</>
                      )}
                    </motion.button>
                    {isEditing && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        onClick={handleCancelEdit}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm"
                      >
                        Hủy
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Bảng Lịch Làm Việc */}
                <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-md">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-between items-center mb-4"
                  >
                    <button
                      onClick={goToPreviousWeek}
                      className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                      disabled={loadingStates.fetchSchedule}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <h2 className="text-lg font-semibold text-gray-800">
                      Lịch làm việc: {formatDateForDisplay(weekDates[0])} -{" "}
                      {formatDateForDisplay(weekDates[6])}
                    </h2>

                    <button
                      onClick={goToNextWeek}
                      className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                      disabled={loadingStates.fetchSchedule}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </motion.div>

                  {loadingStates.fetchSchedule ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2
                        className="animate-spin text-blue-600"
                        size={28}
                      />
                      <span className="ml-3 text-gray-600 text-base">
                        Đang tải lịch làm việc...
                      </span>
                    </div>
                  ) : weekSchedule.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-base">
                        Không có lịch làm việc nào trong tuần này.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto max-h-[70vh] border rounded-lg">
                        {/* Điều chỉnh max-h-[70vh] để thay đổi chiều cao bảng lịch */}
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="p-2 border bg-gray-50 text-gray-700 font-semibold text-left text-xs sticky top-0 z-10">
                                Giờ
                              </th>
                              {weekDates.map((date, index) => (
                                <th
                                  key={date}
                                  className="p-2 border bg-gray-50 text-gray-700 font-semibold min-w-[100px] text-center text-xs sticky top-0 z-10"
                                >
                                  <div>{formatDateForDisplay(date)}</div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {hours.map((hour) => (
                              <tr key={hour.id} className="hover:bg-gray-50">
                                <td className="p-2 border text-gray-700 font-medium text-xs">
                                  {hour.name}
                                </td>
                                {weekDates.map((date) => {
                                  const dateSlots = getSlotsForDate(date);
                                  const isSlotBooked = dateSlots.includes(
                                    hour.id
                                  );
                                  const schedule = getScheduleForDateAndHour(
                                    date,
                                    hour.id
                                  );
                                  const isEditingThisCell =
                                    isEditing &&
                                    editingCell?.date === date &&
                                    editingCell?.hourId === hour.id;
                                  const isPastDate = isDateInPast(date);

                                  return (
                                    <td
                                      key={`${date}-${hour.id}`}
                                      className={`p-2 border text-center relative group min-w-[100px] ${
                                        isSlotBooked ? "bg-blue-50" : "bg-white"
                                      } ${
                                        isEditingThisCell ? "bg-yellow-100" : ""
                                      } ${
                                        isPastDate
                                          ? "opacity-50 cursor-not-allowed"
                                          : "cursor-pointer"
                                      }`}
                                      onClick={
                                        isPastDate || !isSlotBooked
                                          ? undefined
                                          : () =>
                                              handleEditSchedule(date, hour.id)
                                      }
                                      onContextMenu={
                                        isPastDate || !isSlotBooked
                                          ? undefined
                                          : (e) => {
                                              e.preventDefault();
                                              handleDeleteSchedule(
                                                date,
                                                hour.id
                                              );
                                            }
                                      }
                                    >
                                      {isSlotBooked ? (
                                        <>
                                          <span className="inline-block w-4 h-4 bg-blue-600 rounded-full"></span>
                                          {schedule?.isBooked && (
                                            <span className="inline-block w-4 h-4 bg-red-600 rounded-full ml-1"></span>
                                          )}
                                          {!isPastDate && (
                                            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                                              {schedule?.isBooked
                                                ? "Lịch đã được đặt"
                                                : "Nhấn để sửa lịch"}
                                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-gray-800"></div>
                                            </div>
                                          )}
                                          {isPastDate && (
                                            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                                              Không thể chỉnh sửa lịch trong quá
                                              khứ
                                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-gray-800"></div>
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <span className="text-gray-400">—</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 flex items-center text-sm text-gray-600"
                      >
                        <span className="inline-block w-4 h-4 bg-blue-600 rounded-full mr-2"></span>
                        <span>Đã lên lịch</span>
                        <span className="inline-block w-4 h-4 bg-red-600 rounded-full mr-2 ml-4"></span>
                        <span>Đã được đặt</span>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="section w-full bg-white p-6 rounded-2xl shadow-md">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl font-semibold text-gray-800 mb-6"
                >
                  Quản lý lịch hẹn
                </motion.h2>

                <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                      <label className="text-gray-700 font-medium flex items-center mb-2">
                        <Filter className="mr-2 w-5 h-5" />
                        Lọc theo trạng thái:
                      </label>
                      <select
                        value={filterStatus}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      >
                        <option value="">Tất cả</option>
                        <option value="PENDING">Đang chờ xác nhận</option>
                        <option value="SUCCESS">Thành công</option>
                        <option value="FAILURE">Đã hủy</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-700 font-medium flex items-center mb-2">
                        <Calendar className="mr-2 w-5 h-5" />
                        Từ ngày:
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày"
                        locale={vi}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700 font-medium flex items-center mb-2">
                        <Calendar className="mr-2 w-5 h-5" />
                        Đến ngày:
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày"
                        locale={vi}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700 font-medium flex items-center mb-2">
                        Tìm kiếm:
                      </label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm theo tên, số điện thoại, email..."
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={clearFilters}
                        className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
                      >
                        <X className="mr-2" size={16} />
                        Xóa bộ lọc
                      </button>
                      {filterStatus === "SUCCESS" && (
                        <button
                          onClick={handleSendReminders}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
                          disabled={loadingStates.sendReminders}
                        >
                          {loadingStates.sendReminders ? (
                            <>
                              <Loader2
                                className="mr-2 animate-spin"
                                size={16}
                              />
                              Đang gửi...
                            </>
                          ) : (
                            "Gửi lịch hẹn"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {messageSendReminders && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`mt-4 text-center ${
                        messageSendReminders.includes("thành công")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {messageSendReminders}
                    </motion.p>
                  )}
                </div>

                {loadingStates.fetchBookings ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="animate-spin text-blue-600" size={28} />
                    <span className="ml-3 text-gray-600 text-base">
                      Đang tải danh sách lịch hẹn...
                    </span>
                  </div>
                ) : pendingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={childVariants}
                        className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-200"
                      >
                        <div className="text-gray-700 text-sm">
                          <p>
                            <strong className="font-semibold">
                              Bệnh nhân:
                            </strong>{" "}
                            {booking.fullName}
                          </p>
                          <p>
                            <strong className="font-semibold">
                              Số điện thoại:
                            </strong>{" "}
                            {booking.phone}
                          </p>
                          <p>
                            <strong className="font-semibold">Email:</strong>{" "}
                            {booking.email}
                          </p>
                          <p>
                            <strong className="font-semibold">
                              Ngày khám:
                            </strong>{" "}
                            {formatTimestampToDate(booking.date)}
                          </p>
                          <p>
                            <strong className="font-semibold">
                              Khung giờ:
                            </strong>{" "}
                            {getHourName(booking.idHour)}
                          </p>
                          <p>
                            <strong className="font-semibold">
                              Trạng thái:
                            </strong>{" "}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                booking.status === "SUCCESS"
                                  ? "bg-green-100 text-green-700"
                                  : booking.status === "FAILURE"
                                  ? "bg-red-100 text-red-700"
                                  : booking.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {booking.status === "SUCCESS"
                                ? "Thành công"
                                : booking.status === "PENDING"
                                ? "Đang chờ xác nhận"
                                : booking.status === "FAILURE"
                                ? "Đã hủy"
                                : booking.status}
                            </span>
                          </p>
                          <p>
                            <strong className="font-semibold">
                              Lý do khám bệnh:
                            </strong>{" "}
                            {booking.note || "Không có ghi chú"}
                          </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          {booking.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApprove(booking.id)}
                                className="flex-1 sm:flex-none px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold flex items-center justify-center shadow-sm disabled:bg-green-400 disabled:cursor-not-allowed"
                                disabled={
                                  loadingStates.approveBooking === booking.id
                                }
                              >
                                {loadingStates.approveBooking === booking.id ? (
                                  <>
                                    <Loader2
                                      className="mr-2 animate-spin"
                                      size={16}
                                    />
                                    Đang xử lý...
                                  </>
                                ) : (
                                  "Đồng ý"
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(booking.id)}
                                className="flex-1 sm:flex-none px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold flex items-center justify-center shadow-sm disabled:bg-red-400 disabled:cursor-not-allowed"
                                disabled={
                                  loadingStates.rejectBooking === booking.id
                                }
                              >
                                {loadingStates.rejectBooking === booking.id ? (
                                  <>
                                    <Loader2
                                      className="mr-2 animate-spin"
                                      size={16}
                                    />
                                    Đang xử lý...
                                  </>
                                ) : (
                                  "Từ chối"
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-base">
                      Không có lịch hẹn nào phù hợp với bộ lọc.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === "statistics" && (
              <div className="section w-full bg-white p-6 rounded-2xl shadow-md">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl font-semibold text-gray-800 mb-6"
                >
                  Thống kê lịch làm việc và lịch hẹn
                </motion.h2>

                <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="text-gray-700 font-medium flex items-center mb-2">
                        <Calendar className="mr-2 w-5 h-5" />
                        Từ ngày:
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày"
                        locale={vi}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700 font-medium flex items-center mb-2">
                        <Calendar className="mr-2 w-5 h-5" />
                        Đến ngày:
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày"
                        locale={vi}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                    <button
                      onClick={clearFilters}
                      className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
                    >
                      <X className="mr-2" size={16} />
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>

                {loadingStates.fetchStatistics ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="animate-spin text-blue-600" size={28} />
                    <span className="ml-3 text-gray-600 text-base">
                      Đang tải dữ liệu thống kê...
                    </span>
                  </div>
                ) : statistics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Số lượng lịch hẹn theo trạng thái",
                        chart: (
                          <Bar
                            data={bookingStatusChartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false },
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  title: { display: true, text: "Số lượng" },
                                },
                                x: {
                                  title: { display: true, text: "Trạng thái" },
                                },
                              },
                            }}
                          />
                        ),
                      },
                      {
                        title: "Số lượng lịch hẹn theo khung giờ",
                        chart: (
                          <Bar
                            data={bookingHourChartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false },
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  title: { display: true, text: "Số lượng" },
                                },
                                x: {
                                  title: { display: true, text: "Khung giờ" },
                                },
                              },
                            }}
                          />
                        ),
                      },
                      {
                        title: "Tỷ lệ lịch làm việc đã được đặt",
                        chart: (
                          <Pie
                            data={scheduleBookingRatioChartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { position: "bottom" },
                              },
                            }}
                          />
                        ),
                      },
                      {
                        title: "Số lượng lịch hẹn theo ngày trong tuần",
                        chart: (
                          <Line
                            data={bookingDayOfWeekChartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false },
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  title: { display: true, text: "Số lượng" },
                                },
                                x: {
                                  title: {
                                    display: true,
                                    text: "Ngày trong tuần",
                                  },
                                },
                              },
                            }}
                          />
                        ),
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={childVariants}
                        className="bg-gray-50 p-4 rounded-lg shadow-md"
                      >
                        <h3 className="text-base font-semibold text-gray-800 mb-3">
                          {item.title}
                        </h3>
                        <div className="h-52">{item.chart}</div>{" "}
                        {/* Điều chỉnh h-52 để thay đổi chiều cao biểu đồ */}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-base">
                      Không có dữ liệu thống kê.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
              {showEditModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300"
                >
                  <div
                    className="fixed inset-0 bg-black opacity-50"
                    onClick={() => setShowEditModal(false)}
                  ></div>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50 transform transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Xác nhận sửa lịch
                      </h3>
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Bạn có chắc chắn muốn sửa lịch làm việc này không?
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 font-semibold shadow-sm"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={confirmEditSchedule}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-sm"
                      >
                        Sửa
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
              {showDeleteModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300"
                >
                  <div
                    className="fixed inset-0 bg-black opacity-50"
                    onClick={() => setShowDeleteModal(false)}
                  ></div>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50 transform transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Xác nhận xóa lịch
                      </h3>
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-600 mb-2">
                      Bạn có chắc chắn muốn xóa lịch làm việc này không?
                    </p>
                    {scheduleToDelete?.isBooked && (
                      <p className="text-red-600 mb-4 flex items-center">
                        <AlertCircle className="mr-2" size={16} />
                        Lưu ý: Lịch này đã được đặt.
                      </p>
                    )}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 font-semibold shadow-sm"
                        disabled={loadingStates.deleteSchedule}
                      >
                        Hủy
                      </button>
                      <button
                        onClick={confirmDeleteSchedule}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold flex items-center justify-center shadow-sm disabled:bg-red-400 disabled:cursor-not-allowed"
                        disabled={loadingStates.deleteSchedule}
                      >
                        {loadingStates.deleteSchedule ? (
                          <>
                            <Loader2 className="mr-2 animate-spin" size={18} />
                            Đang xử lý...
                          </>
                        ) : (
                          "Xóa"
                        )}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <ToastContainer />
          </div>
        </div>
      </AnimatedPageWrapper>
    </Layout>
  );
};

export default DoctorScheduleForm;
