import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Default/Layout";
import {
  PlusCircle,
  Trash2,
  Loader2,
  RefreshCw,
  LogIn,
  X,
  Calendar,
  Filter,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import AnimatedPageWrapper, {
  childVariants,
} from "../Default/AnimatedPageWrapper";
import { toast } from "react-toastify"; // Đảm bảo đã import toast

// Variants cho hiệu ứng fade-in và slide-in
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const PatientAppointmentManager = () => {
  const [formData, setFormData] = useState({
    token: "",
    cancelOtp: "",
    cancelToken: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isCancelOtpSent, setIsCancelOtpSent] = useState(false);
  const [selectedCancelToken, setSelectedCancelToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [filterStatus, setFilterStatus] = useState("CONFIRMING");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const hours = [
    { id: 1, name: "7h - 8h" },
    { id: 2, name: "8h - 9h" },
    { id: 3, name: "9h - 10h" },
    { id: 4, name: "10h - 11h" },
    { id: 5, name: "13h - 14h" },
    { id: 6, name: "14h - 15h" },
    { id: 7, name: "15h - 16h" },
    { id: 8, name: "16h - 17h" },
  ];

  const patientToken = sessionStorage.getItem("patientToken");
  const timeoutsRef = useRef({});

  useEffect(() => {
    if (patientToken) {
      setFormData((prev) => ({ ...prev, token: patientToken }));
      fetchAppointmentsByToken(patientToken);
    }
  }, []);

  useEffect(() => {
    if (patientToken) {
      fetchAppointmentsByToken(patientToken);
    }
  }, [filterStatus, startDate, endDate]);

  useEffect(() => {
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};

    appointments.forEach((appt) => {
      if (appt.status === "CONFIRMING" && appt.createdAt) {
        const createdTime = new Date(appt.createdAt).getTime();
        const currentTime = new Date().getTime();
        const eightHoursInMs = 8 * 60 * 60 * 1000;
        const timeUntilEightHours = createdTime + eightHoursInMs - currentTime;

        if (timeUntilEightHours <= 0) {
          updateStatusToSuccess(appt.token);
        } else {
          const timeoutId = setTimeout(() => {
            updateStatusToSuccess(appt.token);
          }, timeUntilEightHours);
          timeoutsRef.current[appt.token] = timeoutId;
        }
      }
    });

    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, [appointments]);

  useEffect(() => {
    if (!patientToken) return;

    const intervalId = setInterval(() => {
      fetchAppointmentsByToken(patientToken);
    }, 4 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [patientToken]);

  const formatTimestampToDateTime = (timestamp) => {
    if (!timestamp || isNaN(new Date(timestamp).getTime())) {
      return "Ngày không xác định";
    }
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return "N/A";
    }
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getHourName = (idHour) => {
    const hour = hours.find((h) => h.id === parseInt(idHour));
    return hour ? hour.name : "Giờ không xác định";
  };

  const isCancelAllowed = (createdAt) => {
    if (!createdAt) return false;
    const createdTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - createdTime;
    const eightHoursInMs = 8 * 60 * 60 * 1000;
    return timeDifference <= eightHoursInMs;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const fetchAppointmentsByToken = async (token) => {
    setIsLoading(true);
    try {
      const params = { token };
      if (filterStatus) params.status = filterStatus;
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        params.endDate = end.toISOString();
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/by-token-filtered`,
        { params }
      );
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setAppointments(data);
      console.log("res: ", response.data);

      localStorage.setItem("patientToken", token);
      sessionStorage.setItem("patientToken", token);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
      toast.error(error.response?.data || "Không thể lấy danh sách lịch hẹn!");
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendCancelOtp = async (token) => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy lịch hẹn này?"
    );
    if (!confirmCancel) return;

    setIsSendingOtp(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/cancel/otp/send`,
        null,
        { params: { token } }
      );
      toast.success(response.data || "Mã OTP đã được gửi!");
      setIsCancelOtpSent(true);
      setSelectedCancelToken(token);
    } catch (error) {
      console.error("Lỗi khi gửi mã OTP hủy:", error);
      toast.error(error.response?.data || "Không thể gửi mã OTP!");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const resendCancelOtp = async () => {
    if (!selectedCancelToken) return;
    setIsSendingOtp(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/cancel/otp/send`,
        null,
        { params: { token: selectedCancelToken } }
      );
      toast.success(response.data || "Mã OTP đã được gửi lại!");
    } catch (error) {
      console.error("Lỗi khi gửi lại mã OTP:", error);
      toast.error(error.response?.data || "Không thể gửi lại mã OTP!");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyCancelOtpAndCancel = async () => {
    if (!formData.cancelOtp) {
      setErrors((prev) => ({ ...prev, cancelOtp: "Vui lòng nhập mã OTP!" }));
      return;
    }

    setIsLoading(true);
    try {
      const verifyResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/cancel/otp/verify`,
        null,
        { params: { token: selectedCancelToken, otp: formData.cancelOtp } }
      );
      toast.success(verifyResponse.data);

      const cancelResponse = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/booking/cancel/${selectedCancelToken}`
      );
      toast.success(cancelResponse.data || "Hủy lịch hẹn thành công!");

      if (timeoutsRef.current[selectedCancelToken]) {
        clearTimeout(timeoutsRef.current[selectedCancelToken]);
        delete timeoutsRef.current[selectedCancelToken];
      }

      setAppointments((prev) =>
        prev.filter((appt) => appt.token !== selectedCancelToken)
      );
      setFormData((prev) => ({ ...prev, cancelOtp: "", cancelToken: "" }));
      setIsCancelOtpSent(false);
      setSelectedCancelToken("");
    } catch (error) {
      console.error("Lỗi khi hủy lịch:", error);
      toast.error(error.response?.data || "Không thể hủy lịch hẹn!");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBookingDirectly = async (token) => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy lịch hẹn này?"
    );
    if (!confirmCancel) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/cancel/${token}`
      );
      toast.success(response.data || "Hủy lịch hẹn thành công!");

      if (timeoutsRef.current[token]) {
        clearTimeout(timeoutsRef.current[token]);
        delete timeoutsRef.current[token];
      }

      setAppointments((prev) => prev.filter((appt) => appt.token !== token));
    } catch (error) {
      console.error("Lỗi khi hủy lịch trực tiếp:", error);
      toast.error(error.response?.data || "Không thể hủy lịch hẹn!");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusToSuccess = async (token) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/booking/set-status-success/${token}`
      );
      toast.success(response.data || "Cập nhật trạng thái thành công!");
      fetchAppointmentsByToken(patientToken);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error(error.response?.data || "Không thể cập nhật trạng thái!");
    }
  };

  const resetForm = () => {
    setFormData({ token: "", cancelOtp: "", cancelToken: "" });
    setErrors({});
    setAppointments([]);
    setIsCancelOtpSent(false);
    setSelectedCancelToken("");
    setFilterStatus("");
    setStartDate(null);
    setEndDate(null);
    localStorage.removeItem("patientToken");
    sessionStorage.setItem("patientToken");
  };

  const getRemainingCancelTime = (createdAt) => {
    if (!createdAt) return null;

    const createdTime = new Date(createdAt).getTime();
    const cancelDeadline = createdTime + 8 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();

    const diff = cancelDeadline - currentTime;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  };

  const clearFilters = () => {
    setFilterStatus("");
    setStartDate(null);
    setEndDate(null);
  };

  // Hàm định dạng phí khám
  const formatFee = (fee) => {
    if (fee === 0 || fee === null || fee === undefined) {
      return "Miễn phí";
    }
    return `${fee.toLocaleString("vi-VN")}đ`;
  };

  return (
    <Layout>
      <AnimatedPageWrapper className="w-full min-h-screen bg-gray-100">
        <motion.div
          className="max-w-6xl mx-auto mt-16 px-4 sm:px-6 lg:px-8 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tiêu đề trang */}
          <motion.div className="text-center mb-10" variants={childVariants}>
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-gray-800 uppercase border-b-2 border-[#06a3da] inline-block pb-2"
              variants={childVariants}
            >
              Quản Lý Lịch Hẹn
            </motion.h1>
            <motion.p
              className="text-gray-600 mt-3 text-lg"
              variants={childVariants}
            >
              Tra cứu và quản lý lịch hẹn khám bệnh của bạn một cách dễ dàng.
            </motion.p>
          </motion.div>

          <motion.div
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
            variants={childVariants}
          >
            {!patientToken ? (
              <motion.div
                className="text-center py-12"
                variants={childVariants}
              >
                <motion.p
                  className="text-gray-600 text-lg mb-6"
                  variants={childVariants}
                >
                  Vui lòng đăng nhập để xem danh sách lịch hẹn.
                </motion.p>
                <motion.button
                  className="flex items-center mx-auto px-6 py-3 bg-[#06a3da] text-white rounded-lg hover:bg-[#0589b7] transition-all duration-300 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#06a3da]"
                  onClick={() => (window.location.href = "/login")}
                  variants={childVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="mr-2" size={20} />
                  Đăng Nhập
                </motion.button>
              </motion.div>
            ) : (
              <>
                {/* Header tài khoản */}
                <motion.div
                  className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
                  variants={childVariants}
                >
                  <motion.div variants={childVariants}>
                    <motion.h2
                      className="text-xl sm:text-2xl font-semibold text-gray-800"
                      variants={childVariants}
                    >
                      Mã Bệnh Nhân:{" "}
                      <span className="text-[#06a3da]">{formData.token}</span>
                    </motion.h2>
                    <motion.p
                      className="text-sm text-gray-500 mt-1"
                      variants={childVariants}
                    >
                      Quản lý tất cả lịch hẹn của bạn tại đây.
                    </motion.p>
                  </motion.div>
                  <motion.button
                    className="flex items-center px-6 py-3 bg-[#06a3da] text-white rounded-lg hover:bg-[#0589b7] transition-all duration-300 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#06a3da]"
                    onClick={() => navigate("/booking")}
                    variants={childVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Tạo lịch hẹn mới"
                  >
                    <PlusCircle className="mr-2" size={18} />
                    Đặt Lịch Mới
                  </motion.button>
                </motion.div>

                {/* Bộ lọc */}
                <motion.div
                  className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm"
                  variants={childVariants}
                >
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
                    variants={childVariants}
                  >
                    <motion.div variants={childVariants}>
                      <motion.label
                        className="text-gray-700 font-medium flex items-center mb-2"
                        variants={childVariants}
                      >
                        <Filter className="mr-2 w-5 h-5" />
                        Trạng Thái:
                      </motion.label>
                      <motion.select
                        value={filterStatus}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 bg-white"
                        variants={childVariants}
                      >
                        <option value="">Tất Cả</option>
                        <option value="CONFIRMING">Đang Xác Nhận</option>
                        <option value="SUCCESS">Thành Công</option>
                        <option value="FAILURE">Đã Hủy</option>
                      </motion.select>
                    </motion.div>
                    <motion.div variants={childVariants}>
                      <motion.label
                        className="text-gray-700 font-medium flex items-center mb-2"
                        variants={childVariants}
                      >
                        <Calendar className="mr-2 w-5 h-5" />
                        Từ Ngày:
                      </motion.label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày"
                        locale={vi}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 bg-white"
                      />
                    </motion.div>
                    <motion.div variants={childVariants}>
                      <motion.label
                        className="text-gray-700 font-medium flex items-center mb-2"
                        variants={childVariants}
                      >
                        <Calendar className="mr-2 w-5 h-5" />
                        Đến Ngày:
                      </motion.label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày"
                        locale={vi}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 bg-white"
                      />
                    </motion.div>
                    <motion.button
                      onClick={clearFilters}
                      className="flex items-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold h-[48px] focus:outline-none focus:ring-2 focus:ring-gray-300"
                      variants={childVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Xóa bộ lọc"
                    >
                      <X className="mr-2" size={18} />
                      Xóa Bộ Lọc
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Danh sách lịch hẹn */}
                {isLoading ? (
                  <motion.div
                    className="flex justify-center items-center py-12"
                    variants={childVariants}
                  >
                    <Loader2
                      className="animate-spin text-[#06a3da]"
                      size={40}
                    />
                  </motion.div>
                ) : appointments.length > 0 ? (
                  <motion.div className="space-y-6" variants={childVariants}>
                    {appointments.map((appt, index) => (
                      <motion.div
                        key={appt.token}
                        className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                        variants={childVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.div
                          className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
                          variants={childVariants}
                        >
                          <motion.div
                            className="space-y-3 col-span-2"
                            variants={childVariants}
                          >
                            <motion.div
                              className="flex items-center space-x-2"
                              variants={childVariants}
                            >
                              <span className="text-gray-600 font-medium">
                                Bác Sĩ:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {appt.user?.fullname || "N/A"}
                              </span>
                            </motion.div>
                            <motion.div
                              className="flex items-center space-x-2"
                              variants={childVariants}
                            >
                              <span className="text-gray-600 font-medium">
                                Ngày Khám:
                              </span>
                              <span className="text-gray-800">
                                {formatTimestampToDateTime(appt.date)}
                              </span>
                            </motion.div>
                            <motion.div
                              className="flex items-center space-x-2"
                              variants={childVariants}
                            >
                              <span className="text-gray-600 font-medium">
                                Giờ Khám:
                              </span>
                              <span className="text-gray-800">
                                {getHourName(appt.idHour)}
                              </span>
                            </motion.div>
                            <motion.div
                              className="flex items-center space-x-2"
                              variants={childVariants}
                            >
                              <span className="text-gray-600 font-medium">
                                Chi Phí Khám:
                              </span>
                              <span className="text-gray-800">
                                {formatFee(appt.user.fee)}
                              </span>
                            </motion.div>
                            <motion.div
                              className="flex items-center space-x-2"
                              variants={childVariants}
                            >
                              <span className="text-gray-600 font-medium">
                                Trạng Thái:
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  appt.status === "SUCCESS"
                                    ? "bg-green-100 text-green-700"
                                    : appt.status === "FAILURE"
                                    ? "bg-red-100 text-red-700"
                                    : appt.status === "CONFIRMING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {appt.status === "SUCCESS"
                                  ? "Thành Công"
                                  : appt.status === "CONFIRMING"
                                  ? "Đang Xác Nhận"
                                  : appt.status === "FAILURE"
                                  ? "Đã Hủy"
                                  : appt.status}
                              </span>
                            </motion.div>
                            {appt.status === "CONFIRMING" && (
                              <motion.div
                                className="flex items-center space-x-2"
                                variants={childVariants}
                              >
                                <span className="text-red-600 font-medium text-sm">
                                  * Lưu ý: Bạn có 8 tiếng để hủy lịch hẹn, nếu
                                  quá 8 tiếng trạng thái sẽ tự động chuyển thành
                                  "Thành Công".
                                </span>
                              </motion.div>
                            )}
                          </motion.div>
                          <motion.div
                            className="flex flex-col space-y-3 sm:items-end"
                            variants={childVariants}
                          >
                            {appt.status === "SUCCESS" && (
                              <motion.p
                                className="text-sm text-green-600 italic"
                                variants={childVariants}
                              >
                                Lịch hẹn đã được xác nhận thành công!
                              </motion.p>
                            )}
                            {appt.status === "CONFIRMING" &&
                              isCancelAllowed(appt.createdAt) && (
                                <motion.button
                                  onClick={() =>
                                    cancelBookingDirectly(appt.token)
                                  }
                                  className="flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto"
                                  disabled={isLoading}
                                  variants={childVariants}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Hủy lịch hẹn này"
                                >
                                  {isLoading &&
                                  selectedCancelToken === appt.token ? (
                                    <>
                                      <Loader2
                                        className="animate-spin mr-2"
                                        size={18}
                                      />
                                      Đang Hủy...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="mr-2" size={18} />
                                      Hủy Lịch
                                    </>
                                  )}
                                </motion.button>
                              )}
                            {appt.status === "CONFIRMING" &&
                              getRemainingCancelTime(appt.createdAt) && (
                                <motion.p
                                  className="text-sm text-gray-600 italic"
                                  variants={childVariants}
                                >
                                  Còn lại:{" "}
                                  {getRemainingCancelTime(appt.createdAt).hours}{" "}
                                  giờ{" "}
                                  {
                                    getRemainingCancelTime(appt.createdAt)
                                      .minutes
                                  }{" "}
                                  phút để hủy
                                </motion.p>
                              )}
                            {appt.status === "CONFIRMING" &&
                              !getRemainingCancelTime(appt.createdAt) && (
                                <motion.p
                                  className="text-sm text-red-500 italic"
                                  variants={childVariants}
                                >
                                  Đã quá thời gian hủy, trạng thái sẽ sớm chuyển
                                  thành "Thành Công".
                                </motion.p>
                              )}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-12"
                    variants={childVariants}
                  >
                    <motion.p
                      className="text-gray-600 text-lg mb-6"
                      variants={childVariants}
                    >
                      Không tìm thấy lịch hẹn nào.
                    </motion.p>
                    <motion.button
                      className="flex items-center mx-auto px-6 py-3 bg-[#06a3da] text-white rounded-lg hover:bg-[#0589b7] transition-all duration-300 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#06a3da]"
                      onClick={() => (window.location.href = "/booking")}
                      variants={childVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PlusCircle className="mr-2" size={18} />
                      Đặt Lịch Hẹn Mới
                    </motion.button>
                  </motion.div>
                )}

                {/* Xác minh OTP để hủy */}
                <AnimatePresence>
                  {isCancelOtpSent && (
                    <motion.div
                      className="mt-10 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.h2
                        className="text-lg font-semibold text-gray-800 mb-4 text-center"
                        variants={childVariants}
                      >
                        Xác Minh OTP Để Hủy Lịch Hẹn
                      </motion.h2>
                      <motion.div
                        className="space-y-4"
                        variants={childVariants}
                      >
                        <motion.div
                          className="flex gap-3 items-center"
                          variants={childVariants}
                        >
                          <motion.input
                            type="text"
                            name="cancelOtp"
                            value={formData.cancelOtp}
                            onChange={handleInputChange}
                            className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 bg-white"
                            placeholder="Nhập mã OTP"
                            variants={childVariants}
                          />
                          <motion.button
                            onClick={verifyCancelOtpAndCancel}
                            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 w-[150px]"
                            disabled={isLoading}
                            variants={childVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isLoading ? (
                              <>
                                <Loader2
                                  className="animate-spin mr-2"
                                  size={20}
                                />
                                Đang Xử Lý...
                              </>
                            ) : (
                              "Xác Minh & Hủy"
                            )}
                          </motion.button>
                        </motion.div>
                        {errors.cancelOtp && (
                          <motion.p
                            className="text-red-600 text-sm text-center"
                            variants={childVariants}
                          >
                            {errors.cancelOtp}
                          </motion.p>
                        )}
                        <motion.button
                          onClick={resendCancelOtp}
                          className="flex items-center mx-auto text-[#06a3da] hover:text-[#0589b7] text-sm font-semibold transition-all duration-300"
                          disabled={isSendingOtp}
                          variants={childVariants}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isSendingOtp ? (
                            <>
                              <Loader2
                                className="animate-spin mr-2"
                                size={16}
                              />
                              Đang Gửi Lại...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2" size={16} />
                              Gửi Lại OTP
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </motion.div>
      </AnimatedPageWrapper>
    </Layout>
  );
};

export default PatientAppointmentManager;
