import React, { useState, useEffect, useRef } from "react"; // Ensure React is imported
import axios from "axios";
import {
  CalendarDays,
  Pencil,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion"; // Add Framer Motion
import AnimatedPageWrapper, {
  childVariants,
} from "../Default/AnimatedPageWrapper"; // Import the wrapper and variants
import Layout from "../Default/Layout";
import { useNavigate } from "react-router-dom";

const PatientBookingForm = () => {
  const [majors, setMajors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotsMajor, setTimeSlotsMajor] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchDoctor, setSearchDoctor] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const token = sessionStorage.getItem("patientToken");
  const navigate = useNavigate();

  const hoursExist = [
    { hourName: "7h - 7h30", startHour: 7 },
    { hourName: "7h30 - 8h", startHour: 7 },
    { hourName: "8h - 8h30", startHour: 8 },
    { hourName: "8h30 - 9h", startHour: 8 },
    { hourName: "9h - 9h30", startHour: 9 },
    { hourName: "9h30 - 10h", startHour: 9 },
    { hourName: "10h - 10h30", startHour: 10 },
    { hourName: "10h30 - 11h", startHour: 10 },
    { hourName: "13h - 13h30", startHour: 13 },
    { hourName: "13h30 - 14h", startHour: 13 },
    { hourName: "14h - 14h30", startHour: 14 },
    { hourName: "14h30 - 15h", startHour: 14 },
    { hourName: "15h - 15h30", startHour: 15 },
    { hourName: "15h30 - 16h", startHour: 15 },
    { hourName: "16h - 16h30", startHour: 16 },
    { hourName: "16h30 - 17h", startHour: 16 },
  ];
  const [formData, setFormData] = useState({
    majorId: "",
    doctorId: "",
    doctorName: "",
    timeSlot: "",
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    note: "",
    otp: "",
    patientCode: "",
    token: "",
  });
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimeRemaining, setOtpTimeRemaining] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasVisited, setHasVisited] = useState(null);
  const [hasVisitedTypeBooking, setHasVisitedTypeBooking] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    verifyPatient: false,
    bookSchedule: false,
    verifyOtp: false,
    saveChanges: false,
  });

  const otpRefs = useRef([]);
  const dropdownRef = useRef(null);
  const patientId = localStorage.getItem("userId") || "anonymous";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (isOtpSent && otpTimeRemaining > 0) {
      timer = setInterval(() => {
        setOtpTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, otpTimeRemaining]);

  const handleOtpInputChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
    const otpValue = newOtpInputs.join("");
    setFormData((prev) => ({ ...prev, otp: otpValue }));
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const sendOtp = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Vui lòng nhập email!" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Email không hợp lệ!" }));
      return false;
    }

    setLoadingStates((prev) => ({ ...prev, bookSchedule: true }));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/otp/send`,
        null,
        { params: { email: formData.email } }
      );
      toast.success(response.data);
      setIsOtpSent(true);
      setOtpTimeRemaining(180);
      setCanResendOtp(false);
      return true;
    } catch (error) {
      console.error("Lỗi khi gửi mã OTP:", error);
      toast.error(error.response?.data || "Không thể gửi mã OTP!");
      return false;
    } finally {
      setLoadingStates((prev) => ({ ...prev, bookSchedule: false }));
    }
  };

  const verifyOtpAndBook = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "Vui lòng nhập đủ 6 số OTP!" }));
      return;
    }

    setLoadingStates((prev) => ({ ...prev, verifyOtp: true }));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/otp/verify`,
        null,
        { params: { email: formData.email, otp: formData.otp } }
      );
      toast.success(response.data);

      const [scheduleId, hourId] = formData.timeSlot.split("-");

      await axios
        .post(`${import.meta.env.VITE_API_URL}/api/v1/booking`, {
          scheduleId: parseInt(scheduleId),
          hourId: parseInt(hourId),
          patientId: parseInt(formData.doctorId),
          fullName: formData.fullName,
          dob: formData.dob,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          address: formData.address,
          note: formData.note,
          token: patientInfo?.token || "",
        })
        .then((response) => {
          toast.success(
            `${response.data.message} Mã khách hàng của bạn: ${response.data.token}. Vui lòng kiểm tra email để xác nhận lịch hẹn.`
          );
          resetForm();
          fetchTimeSlotsByDoctor(formData.doctorId);
          fetchTimeSlotsByMajor(formData.majorId);
        })
        .catch((error) => {
          console.error("Lỗi khi đặt lịch:", error);
          toast.error(error.response?.data || "Có lỗi xảy ra khi đặt lịch!");
        });
    } catch (error) {
      console.error("Lỗi khi xác minh mã OTP:", error);
      toast.error(error.response?.data || "Mã OTP không hợp lệ!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  const fetchMajors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/majors`
      );
      setMajors(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chuyên khoa:", error);
      toast.error("Có lỗi xảy ra khi lấy danh sách chuyên khoa!");
    }
  };

  const fetchDoctorsByMajor = async (majorId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/doctors/by-major/${majorId}`
      );
      const doctorData = response.data.data || response.data || [];
      console.log("Doctor: " + response.data);
      if (
        !Array.isArray(doctorData) ||
        !doctorData.every(
          (doctor) => doctor.id && doctor.fullName && doctor.majorId
        )
      ) {
        // toast.error("Vui lòng tải lại dữ liệu mới nhất !");
        // navigate("/booking");
        throw new Error("Dữ liệu bác sĩ không đúng định dạng!");
      }
      setDoctors(doctorData);
      setFormData((prev) => ({ ...prev, doctorId: "" }));
      setTimeSlots([]);
      setSelectedDate(new Date());
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", error);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/doctor/all`
      );
      const doctorData = response.data.data || [];
      if (
        !Array.isArray(doctorData) ||
        !doctorData.every(
          (doctor) => doctor.id && doctor.fullName && doctor.majorId
        )
      ) {
        throw new Error("Dữ liệu bác sĩ không đúng định dạng!");
      }
      setDoctors(doctorData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      toast.error(error.message || "Có lỗi xảy ra khi lấy danh sách bác sĩ!");
      setDoctors([]);
    }
  };

  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hàm kiểm tra xem khung giờ có nằm trong quá khứ hay không
  const isTimeSlotInPast = (slot) => {
    const currentTime = new Date(); // Thời gian hiện tại (11/05/2025)
    const slotDate = new Date(slot.date); // Chuyển slot.date thành đối tượng Date (2025-05-12)
    const hourInfo = hoursExist.find((hour) => hour.hourName === slot.hourName); // Sử dụng name để khớp với hoursExist
    if (!hourInfo) {
      console.log(`Không tìm thấy hourInfo cho hourName: ${slot.hourName}`); // Debug
      return true; // Nếu không tìm thấy, coi như đã qua
    }

    const slotStartHour = hourInfo.startHour;
    // const slotStartMinute = hourInfo.startMinute;
    slotDate.setHours(slotStartHour, 0, 0, 0); // Đặt giờ và phút chính xác

    console.log(`SlotDate: ${slotDate}, CurrentTime: ${currentTime}`); // Debug
    return slotDate < currentTime; // So sánh với thời gian hiện tại
  };

  const fetchTimeSlotsByDoctor = async (doctorId) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/schedule/doctor/${doctorId}/available-slots`,
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        }
      );
      console.log("Dữ liệu từ API:", response.data); // Thêm log này
      const filteredSlots = (response.data || []).filter(
        (slot) => !isTimeSlotInPast(slot)
      );
      console.log("Dữ liệu sau khi lọc:", filteredSlots); // Thêm log này
      setTimeSlots(filteredSlots);
      setFormData((prev) => ({ ...prev, timeSlot: "" }));
    } catch (error) {
      console.error("Lỗi khi lấy khung giờ khả dụng:", error);
      toast.error("Có lỗi xảy ra khi lấy khung giờ khả dụng!");
    }
  };

  const fetchTimeSlotsByMajor = async (majorId) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/schedule/major/${majorId}/available-slots`,
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        }
      );
      // Lọc các khung giờ đã qua
      const filteredSlots = (response.data || []).filter(
        (slot) => !isTimeSlotInPast(slot)
      );
      setTimeSlotsMajor(filteredSlots);
      setFormData((prev) => ({ ...prev, timeSlot: "" }));
    } catch (error) {
      console.error("Lỗi khi lấy khung giờ khả dụng:", error);
      toast.error("Có lỗi xảy ra khi lấy khung giờ khả dụng!");
    }
  };

  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getAvailableHoursForDate = (date, slots) => {
    const formattedDate = formatDateToLocal(date);
    return slots.filter((slot) => slot.date === formattedDate);
  };

  const getUniqueHoursForDate = (date) => {
    const availableSlots = getAvailableHoursForDate(date, timeSlotsMajor);
    const uniqueHoursMap = new Map();

    availableSlots.forEach((slot) => {
      if (!uniqueHoursMap.has(slot.hourName)) {
        uniqueHoursMap.set(slot.hourName, []);
      }
      uniqueHoursMap.get(slot.hourName).push(slot);
    });

    return Array.from(uniqueHoursMap, ([hourName, slots]) => ({
      hourName,
      slots,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.majorId) {
      newErrors.majorId = "Vui lòng chọn chuyên khoa!";
    }
    if (!formData.doctorId) {
      newErrors.doctorId = "Vui lòng chọn bác sĩ!";
    }
    if (!formData.timeSlot) {
      newErrors.timeSlot = "Vui lòng chọn khung giờ khám!";
    }
    if (hasVisited === false || hasVisited === null || isEditing) {
      if (!formData.fullName) {
        newErrors.fullName = "Vui lòng nhập họ tên!";
      }
      if (!formData.dob) {
        newErrors.dob = "Vui lòng nhập ngày sinh!";
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
        newErrors.dob = "Ngày sinh không hợp lệ! (Ví dụ: 1990-01-01)";
      }
      if (!formData.phone) {
        newErrors.phone = "Vui lòng nhập số điện thoại!";
      } else if (!/^(0[1-9][0-9]{8})$/.test(formData.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ! (Ví dụ: 0912345678)";
      }
      if (!formData.email) {
        newErrors.email = "Vui lòng nhập email!";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ!";
      }
      if (!formData.gender) {
        newErrors.gender = "Vui lòng chọn giới tính!";
      }
      if (!formData.address) {
        newErrors.address = "Vui lòng nhập địa chỉ!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFormUpdate = () => {
    const newErrors = {};

    if (hasVisited === false || hasVisited === null || isEditing) {
      if (!formData.fullName) {
        newErrors.fullName = "Vui lòng nhập họ tên!";
      }
      if (!formData.dob) {
        newErrors.dob = "Vui lòng nhập ngày sinh!";
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
        newErrors.dob = "Ngày sinh không hợp lệ! (Ví dụ: 1990-01-01)";
      }
      if (!formData.phone) {
        newErrors.phone = "Vui lòng nhập số điện thoại!";
      } else if (!/^(0[1-9][0-9]{8})$/.test(formData.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ! (Ví dụ: 0912345678)";
      }
      if (!formData.email) {
        newErrors.email = "Vui lòng nhập email!";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ!";
      }
      if (!formData.gender) {
        newErrors.gender = "Vui lòng chọn giới tính!";
      }
      if (!formData.address) {
        newErrors.address = "Vui lòng nhập địa chỉ!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTimeSlotSelect = (timeSlot, doctorId, doctorName) => {
    if (hasVisitedTypeBooking) {
      setFormData((prev) => ({
        ...prev,
        timeSlot,
        doctorId,
        doctorName,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        timeSlot,
      }));
    }
    setErrors((prev) => ({ ...prev, timeSlot: "", doctorId: "" }));
  };

  const handleDoctorSelect = (doctor) => {
    if (doctor) {
      const major = majors.find((major) => major.id === doctor.majorId);
      setFormData((prev) => ({
        ...prev,
        doctorId: doctor.id,
        majorId: doctor.majorId || "",
        doctorName: doctor.fullName || "",
      }));
      setSearchDoctor(doctor.fullName);
      setErrors((prev) => ({ ...prev, doctorId: "", majorId: "" }));
      setIsDropdownOpen(false);
    }
  };

  const handleSearchDoctorChange = (e) => {
    setSearchDoctor(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      timeSlot: "",
      doctorId: hasVisitedTypeBooking ? "" : prev.doctorId,
      doctorName: hasVisitedTypeBooking ? "" : prev.doctorName,
    }));
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.fullName.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  const handleBookSchedule = async () => {
    const isValid = validateForm();
    if (isValid) {
      setIsFormValid(true);
      const otpSent = await sendOtp();
      if (!otpSent) {
        setIsFormValid(false);
      }
    }
  };

  const handleResendOtp = async () => {
    const otpSent = await sendOtp();
    if (otpSent) {
      setOtpInputs(["", "", "", "", "", ""]);
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const handleCloseOtpModal = () => {
    const confirmloor = window.confirm(
      "Bạn có chắc chắn muốn hủy xác minh OTP? Thao tác này sẽ hủy quá trình đặt lịch."
    );
    if (confirmloor) {
      resetForm();
    }
  };

  const handleSaveChanges = () => {
    const isValid = validateFormUpdate();
    if (isValid) {
      setLoadingStates((prev) => ({ ...prev, saveChanges: true }));
      setTimeout(() => {
        setPatientInfo({
          fullName: formData.fullName,
          dob: formData.dob,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          address: formData.address,
          note: formData.note,
          token: formData.token,
        });
        setIsEditing(false);
        toast.success("Cập nhật thông tin cá nhân thành công!");
        setLoadingStates((prev) => ({ ...prev, saveChanges: false }));
      }, 1000);
    }
  };

  const resetForm = () => {
    setFormData({
      majorId: "",
      doctorId: "",
      doctorName: "",
      timeSlot: "",
      fullName: "",
      dob: "",
      phone: "",
      email: "",
      gender: "",
      address: "",
      note: "",
      otp: "",
      patientCode: "",
    });
    setOtpInputs(["", "", "", "", "", ""]);
    setErrors({});
    setSelectedDate(new Date());
    setIsOtpSent(false);
    setOtpTimeRemaining(0);
    setCanResendOtp(false);
    setIsFormValid(false);
    setHasVisited(null);
    setPatientInfo(null);
    setIsEditing(false);
    setHasVisitedTypeBooking(null);
    setSearchDoctor("");
    setIsDropdownOpen(false);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = formatDateToLocal(date);
      const slots = hasVisitedTypeBooking ? timeSlotsMajor : timeSlots;
      const hasAvailableSlots = slots.some(
        (slot) => slot.date === formattedDate
      );
      return hasAvailableSlots ? (
        <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
      ) : null;
    }
    return null;
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = formatDateToLocal(date);
      const slots = hasVisitedTypeBooking ? timeSlotsMajor : timeSlots;
      const hasAvailableSlots = slots.some(
        (slot) => slot.date === formattedDate
      );
      return !hasAvailableSlots || date < new Date().setHours(0, 0, 0, 0);
    }
    return false;
  };

  const handleVisitedChoice = (visited) => {
    setHasVisited(visited);
    setPatientInfo(null);
    setIsEditing(false);

    if (visited === false) {
      setFormData((prev) => ({
        ...prev,
        fullName: "",
        dob: "",
        phone: "",
        email: "",
        gender: "",
        address: "",
        note: "",
        patientCode: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, patientCode: "" }));
    }
  };

  const handleVisitedTypeBooking = (visited) => {
    setHasVisitedTypeBooking(visited);
    setFormData((prev) => ({
      ...prev,
      majorId: "",
      doctorId: "",
      doctorName: "",
      timeSlot: "",
      hourId: "",
    }));
    setTimeSlots([]);
    setTimeSlotsMajor([]);
    setSelectedDate(new Date());
    setSearchDoctor("");
    setIsDropdownOpen(false);
    if (visited === false) {
      fetchAllDoctors();
    } else {
      setDoctors([]);
    }
  };

  const handleVerifyPatientCode = async () => {
    if (!formData.patientCode) {
      setErrors((prev) => ({
        ...prev,
        patientCode: "Vui lòng nhập mã số bệnh nhân!",
      }));
      return;
    }
    const tokenIvalid = token ? token : formData.patientCode;
    setLoadingStates((prev) => ({ ...prev, verifyPatient: true }));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/by-token/${tokenIvalid}`
      );
      const patientData = response.data;

      const formattedDob = patientData.dob
        ? new Date(patientData.dob).toISOString().split("T")[0]
        : "";

      setPatientInfo({
        fullName: patientData.fullName,
        dob: formattedDob,
        phone: patientData.phone,
        email: patientData.email,
        gender: patientData.gender,
        address: patientData.address,
        note: patientData.note,
        token: patientData.token,
      });

      setFormData((prev) => ({
        ...prev,
        fullName: patientData.fullName || "",
        dob: formattedDob || "",
        phone: patientData.phone || "",
        email: patientData.email || "",
        gender: patientData.gender || "",
        address: patientData.address || "",
        note: patientData.note || "",
      }));
    } catch (error) {
      console.error("Lỗi khi xác minh mã số bệnh nhân:", error);
      toast.error(error.response?.data || "Mã số bệnh nhân không hợp lệ!");
    } finally {
      setLoadingStates((prev) => ({ ...prev, verifyPatient: false }));
    }
  };

  const minDate = new Date();

  useEffect(() => {
    fetchMajors();
  }, []);

  useEffect(() => {
    if (formData.majorId && hasVisitedTypeBooking) {
      fetchDoctorsByMajor(formData.majorId);
      fetchTimeSlotsByMajor(formData.majorId);
    }
  }, [formData.majorId]);

  useEffect(() => {
    if (formData.doctorId && !hasVisitedTypeBooking) {
      fetchTimeSlotsByDoctor(formData.doctorId);
    }
  }, [formData.doctorId]);

  const getMajorNameById = (majorId) => {
    const major = majors.find((m) => m.id === majorId);
    return major ? major.name : "Không xác định";
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
        <div className="section max-w-6xl mx-auto mt-10 p-6 sm:p-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            {/* Title Section */}
            <div className="section text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl sm:text-4xl font-bold uppercase text-gray-800 border-b-2 border-blue-500 inline-block pb-2"
              >
                Đặt lịch khám bệnh
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-2 text-gray-600 text-sm sm:text-base"
              >
                Điền thông tin để đặt lịch khám một cách dễ dàng và nhanh chóng.
              </motion.p>
            </div>

            {/* Visited Choice Section */}
            <div className="section mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center"
              >
                Bạn đã từng đặt khám tại Bệnh viện đa khoa Diệp Sinh?
              </motion.h2>
              <div className="flex gap-4 justify-center">
                {[
                  { label: "Đã từng khám", value: true },
                  { label: "Chưa từng khám", value: false },
                ].map((option, index) => (
                  <motion.button
                    key={option.label}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={childVariants}
                    onClick={() => handleVisitedChoice(option.value)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      hasVisited === option.value
                        ? "bg-[#06a3da] hover:bg-[#0589b7] text-white border-blue-500"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <hr className="mb-8 border-gray-200" />

            {/* Patient Code Verification Section */}
            {hasVisited === true && !patientInfo && (
              <div className="section mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center"
                >
                  Vui lòng nhập mã số bệnh nhân
                </motion.h2>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <motion.input
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    type="text"
                    name="patientCode"
                    value={formData.patientCode}
                    onChange={handleInputChange}
                    className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
                    placeholder="MBN: MBN3020DVH02"
                    disabled={loadingStates.verifyPatient}
                  />
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    onClick={handleVerifyPatientCode}
                    className="px-6 py-3 bg-[#06a3da] hover:bg-[#0589b7] text-white text-sm rounded-lg  transition-all duration-300 font-semibold flex items-center justify-center shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
                    style={{ width: "50%" }}
                    disabled={loadingStates.verifyPatient}
                  >
                    {loadingStates.verifyPatient ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={18} />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2" size={20} />
                        Xác nhận
                      </>
                    )}
                  </motion.button>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mx-auto text-center mt-3 text-gray-500 text-sm"
                >
                  <span className="flex items-center justify-center">
                    <AlertCircle className="mr-2" size={16} />
                    Lưu ý: Mã bệnh nhân này ở trên mỗi phiếu khám trong email
                    hoặc tin nhắn SMS.
                  </span>
                </motion.div>
                {errors.patientCode && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="text-red-600 text-xs mt-2 text-center flex items-center justify-center"
                  >
                    <AlertCircle className="mr-2" size={16} />
                    {errors.patientCode}
                  </motion.p>
                )}
              </div>
            )}

            {/* Personal Information and Booking Sections */}
            {(hasVisited === false || patientInfo) && (
              <>
                {/* Personal Information Section */}
                <div className="section space-y-8 mb-12">
                  <div className="flex items-center justify-between">
                    <motion.h4
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center"
                    >
                      <span className="bg-[#06a3da] hover:bg-[#0589b7] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        1
                      </span>
                      Thông tin cá nhân
                    </motion.h4>
                    {patientInfo && !isEditing && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-3 py-1 bg-[#06a3da] hover:bg-[#0589b7] text-white rounded-lg  transition-all duration-300 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        <Pencil className="mr-2" size={16} />
                        Chỉnh sửa
                      </motion.button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Họ tên (đầy đủ, có dấu)",
                        name: "fullName",
                        placeholder: "Vui lòng nhập họ tên",
                        type: "text",
                      },
                      {
                        label: "Ngày sinh",
                        name: "dob",
                        type: "date",
                      },
                      {
                        label: "Số điện thoại",
                        name: "phone",
                        placeholder: "Vui lòng nhập số điện thoại",
                        type: "text",
                      },
                      {
                        label: "Email",
                        name: "email",
                        placeholder: "Vui lòng nhập địa chỉ email",
                        type: "email",
                      },
                    ].map((field, index) => (
                      <motion.div
                        key={field.name}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={childVariants}
                      >
                        <label className="block font-medium mb-2 text-gray-700">
                          {field.label}: <span className="text-red-600">*</span>
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
                          disabled={loadingStates.saveChanges}
                          maxLength={60}
                        />
                        {errors[field.name] && (
                          <p className="text-red-600 text-xs mt-2 flex items-center">
                            <AlertCircle className="mr-2" size={14} />
                            {errors[field.name]}
                          </p>
                        )}
                      </motion.div>
                    ))}

                    <motion.div
                      custom={4}
                      initial="hidden"
                      animate="visible"
                      variants={childVariants}
                    >
                      <label className="block font-medium mb-2 text-gray-700">
                        Giới tính: <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
                        disabled={loadingStates.saveChanges}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-600 text-xs mt-2 flex items-center">
                          <AlertCircle className="mr-2" size={14} />
                          {errors.gender}
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      custom={5}
                      initial="hidden"
                      animate="visible"
                      variants={childVariants}
                    >
                      <label className="block font-medium mb-2 text-gray-700">
                        Địa chỉ: <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
                        placeholder="Thôn/Số nhà ... - Xã/Phường ... - Huyện/Quận/Thành Phố ... - Tỉnh..."
                        disabled={loadingStates.saveChanges}
                      />
                      {errors.address && (
                        <p className="text-red-600 text-xs mt-2 flex items-center">
                          <AlertCircle className="mr-2" size={14} />
                          {errors.address}
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      custom={6}
                      initial="hidden"
                      animate="visible"
                      variants={childVariants}
                      className="sm:col-span-2"
                    >
                      <label className="block font-medium mb-2 text-gray-700">
                        Lý do khám bệnh:
                      </label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
                        rows="3"
                        placeholder="Mô tả ngắn gọn lý do khám bệnh (nếu có)"
                        disabled={loadingStates.saveChanges}
                      />
                    </motion.div>
                    <motion.div
                      custom={6}
                      initial="hidden"
                      animate="visible"
                      variants={childVariants}
                      className="sm:col-span-2 bg-[#06a3da] text-white p-4 rounded"
                    >
                      <p className="font-bold">LƯU Ý</p>
                      <p>
                        Thông tin anh/chị cung cấp sẽ được sử dụng làm hồ sơ
                        khám bệnh, khi điền thông tin anh/chị vui lòng:
                      </p>
                      <ul>
                        <li className="ml-12 list-disc">
                          Ghi rõ họ và tên, viết hoa những chữ cái đầu tiên, ví
                          dụ: <span className="font-bold">Lê Tuấn Hưng </span>{" "}
                        </li>
                        <li className="ml-12 list-disc">
                          Điền đầy đủ, đúng và vui lòng kiểm tra lại thông tin
                          trước khi ấn{" "}
                          <span className="font-bold">"Đặt lịch"</span>{" "}
                        </li>
                      </ul>
                    </motion.div>

                    {isEditing && (
                      <motion.div
                        custom={7}
                        initial="hidden"
                        animate="visible"
                        variants={childVariants}
                        className="sm:col-span-2 flex justify-end gap-3"
                      >
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                          disabled={loadingStates.saveChanges}
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
                          disabled={loadingStates.saveChanges}
                        >
                          {loadingStates.saveChanges ? (
                            <>
                              <Loader2
                                className="mr-2 animate-spin"
                                size={18}
                              />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2" size={18} />
                              Lưu
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Booking Section */}
                <div className="section space-y-8 mb-12">
                  <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center"
                  >
                    <span className="bg-[#06a3da] hover:bg-[#0589b7] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                      2
                    </span>
                    Chọn lịch khám
                  </motion.h4>
                  {/* Chọn đã từng khám hoặc chưa */}
                  <div className="mb-8">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center"
                    >
                      Tại Diệp Sinh, bạn có thể chọn khám theo bác sĩ hoặc khám
                      theo chuyên khoa, vui lòng chọn hình thức muốn khám?
                    </motion.h2>
                    <div className="flex gap-4 justify-center">
                      {[
                        { label: "Đặt với chuyên khoa", value: true },
                        { label: "Đặt với bác sĩ", value: false },
                      ].map((option, index) => (
                        <motion.button
                          key={option.label}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          variants={childVariants}
                          onClick={() => handleVisitedTypeBooking(option.value)}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                            hasVisitedTypeBooking === option.value
                              ? "bg-[#06a3da] hover:bg-[#0589b7] text-white border-blue-500"
                              : "bg-white text-black border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {hasVisitedTypeBooking === true && (
                    <>
                      {/* fetch theo chuyên khoa */}
                      <div className="grid grid-cols-1 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="flex flex-col"
                        >
                          <label className="block font-medium mb-2 text-gray-700">
                            Chuyên khoa: <span className="text-red-600">*</span>
                          </label>
                          <select
                            name="majorId"
                            value={formData.majorId}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm h-12"
                          >
                            <option value="">Chọn chuyên khoa</option>
                            {majors.map((major) => (
                              <option key={major.id} value={major.id}>
                                {major.name}
                              </option>
                            ))}
                          </select>
                          {errors.majorId && (
                            <p className="text-red-600 text-xs mt-2 flex items-center">
                              <AlertCircle className="mr-2" size={14} />
                              {errors.majorId}
                            </p>
                          )}
                        </motion.div>
                      </div>
                      {/* Ngày và khung giờ khám */}
                      <div className="mt-6">
                        <motion.label
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="block font-medium mb-2 text-gray-700"
                        >
                          Chọn ngày và khung giờ khám{" "}
                          <span className="text-red-600">*</span>
                        </motion.label>
                        {formData.majorId ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                            >
                              <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                minDate={minDate}
                                maxDate={
                                  new Date(
                                    new Date().setDate(
                                      new Date().getDate() + 30
                                    )
                                  )
                                }
                                tileContent={tileContent}
                                tileDisabled={tileDisabled}
                                className="border rounded-lg p-4 shadow-md w-full max-w-sm"
                                locale="vi"
                                formatShortWeekday={(locale, date) =>
                                  ["T2", "T3", "T4", "T5", "T6", "T7", "CN"][
                                    date.getDay()
                                  ]
                                }
                                formatMonth={(locale, date) =>
                                  new Intl.DateTimeFormat("vi", {
                                    month: "long",
                                  }).format(date)
                                }
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.6 }}
                              className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm"
                            >
                              <h4 className="font-medium mb-3 text-gray-700">
                                Khung giờ khả dụng ngày{" "}
                                {formatTimestampToDate(selectedDate)}
                              </h4>
                              {getUniqueHoursForDate(selectedDate).length >
                              0 ? (
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                  {getUniqueHoursForDate(selectedDate).map(
                                    ({ hourName, slots }, index) => (
                                      <motion.div
                                        key={hourName}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        variants={childVariants}
                                      >
                                        <div className="font-semibold text-gray-700 mb-2">
                                          {hourName}
                                        </div>
                                        <div className="ml-4 space-y-2">
                                          {slots.map((slot, slotIndex) => {
                                            const timeSlotValue = `${slot.scheduleId}-${slot.hourId}`;
                                            return (
                                              <motion.div
                                                key={timeSlotValue}
                                                custom={slotIndex}
                                                initial="hidden"
                                                animate="visible"
                                                variants={childVariants}
                                                onClick={() =>
                                                  handleTimeSlotSelect(
                                                    timeSlotValue,
                                                    slot.doctorId,
                                                    slot.doctorName
                                                  )
                                                }
                                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 text-sm flex justify-between items-center shadow-sm ${
                                                  formData.timeSlot ===
                                                  timeSlotValue
                                                    ? "bg-blue-100 border-blue-500"
                                                    : "bg-white border-gray-200 hover:bg-gray-100"
                                                }`}
                                              >
                                                <div className="flex flex-col">
                                                  <span className="font-medium">
                                                    BS. {slot.doctorName}
                                                  </span>
                                                  <span className="text-gray-500 text-xs">
                                                    Phí khám:{" "}
                                                    {formatFee(slot.fee)} - Chưa
                                                    bao gồm chi phí chụp chiếu,
                                                    xét nghiệm
                                                  </span>
                                                </div>
                                                {formData.timeSlot ===
                                                  timeSlotValue && (
                                                  <span className="text-blue-500 text-xs font-semibold flex items-center">
                                                    <CheckCircle
                                                      className="mr-1"
                                                      size={14}
                                                    />
                                                    Đã chọn
                                                  </span>
                                                )}
                                              </motion.div>
                                            );
                                          })}
                                        </div>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">
                                  Không có khung giờ khả dụng cho ngày này.
                                </p>
                              )}
                            </motion.div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            Vui lòng chọn chuyên khoa để xem lịch.
                          </p>
                        )}
                        {errors.timeSlot && (
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="text-red-600 text-xs mt-2 flex items-center"
                          >
                            <AlertCircle className="mr-2" size={14} />
                            {errors.timeSlot}
                          </motion.p>
                        )}
                      </div>
                      {/* Bác sĩ ứng với chuyên khoa */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6"
                      >
                        <label className="block font-medium mb-2 text-gray-700">
                          Bác sĩ: <span className="text-red-600">*</span>
                        </label>
                        <div className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700 shadow-sm h-12 flex items-center">
                          {formData.doctorName || "Chưa chọn bác sĩ"}
                        </div>
                        {errors.doctorId && (
                          <p className="text-red-600 text-xs mt-2 flex items-center">
                            <AlertCircle className="mr-2" size={14} />
                            {errors.doctorId}
                          </p>
                        )}
                      </motion.div>
                    </>
                  )}

                  {hasVisitedTypeBooking === false && (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                        >
                          <label className="block font-medium mb-2 text-gray-700">
                            Chọn ngày khám{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            minDate={minDate}
                            maxDate={
                              new Date(
                                new Date().setDate(new Date().getDate() + 30)
                              )
                            }
                            tileContent={tileContent}
                            tileDisabled={tileDisabled}
                            className="border rounded-lg p-4 shadow-md w-full max-w-sm"
                            locale="vi"
                            formatShortWeekday={(locale, date) =>
                              ["T2", "T3", "T4", "T5", "T6", "T7", "CN"][
                                date.getDay()
                              ]
                            }
                            formatMonth={(locale, date) =>
                              new Intl.DateTimeFormat("vi", {
                                month: "long",
                              }).format(date)
                            }
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm"
                        >
                          <div className="mb-4" ref={dropdownRef}>
                            <label className="block font-medium mb-2 text-gray-700">
                              Chọn bác sĩ:{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={searchDoctor}
                                onChange={handleSearchDoctorChange}
                                onFocus={() => setIsDropdownOpen(true)}
                                placeholder="Nhập tên bác sĩ để tìm kiếm"
                                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm h-12"
                              />
                              <AnimatePresence>
                                {isDropdownOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                                  >
                                    {filteredDoctors?.length > 0 ? (
                                      filteredDoctors?.map((doctor, index) => (
                                        <motion.div
                                          key={doctor.id}
                                          custom={index}
                                          initial="hidden"
                                          animate="visible"
                                          variants={childVariants}
                                          onClick={() =>
                                            handleDoctorSelect(doctor)
                                          }
                                          className="p-3 hover:bg-blue-100 cursor-pointer transition-all duration-200 flex justify-between items-center"
                                        >
                                          <div className="flex flex-col">
                                            <span>{doctor.fullName}</span>
                                            <span className="text-gray-500 text-sm">
                                              Phí khám: {formatFee(doctor.fee)}{" "}
                                            </span>
                                          </div>
                                          <span className="text-gray-500 text-sm">
                                            {getMajorNameById(doctor.majorId)}
                                          </span>
                                        </motion.div>
                                      ))
                                    ) : (
                                      <div className="p-3 text-gray-500 italic">
                                        Không tìm thấy bác sĩ nào.
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            {errors.doctorId && (
                              <p className="text-red-600 text-xs mt-2 flex items-center">
                                <AlertCircle className="mr-2" size={14} />
                                {errors.doctorId}
                              </p>
                            )}
                          </div>

                          <div className="mb-4">
                            <label className="block font-medium mb-2 text-gray-700">
                              Chuyên khoa:{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <div className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700 shadow-sm h-12 flex items-center">
                              {formData.majorId
                                ? getMajorNameById(formData.majorId)
                                : "Chưa chọn chuyên khoa"}
                            </div>
                            {errors.majorId && (
                              <p className="text-red-600 text-xs mt-2 flex items-center">
                                <AlertCircle className="mr-2" size={14} />
                                {errors.majorId}
                              </p>
                            )}
                          </div>

                          <div className="mb-4">
                            <label className="block font-medium mb-2 text-gray-700">
                              Phí khám:
                            </label>
                            <div className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700 shadow-sm h-12 flex items-center">
                              {formData.doctorId
                                ? formatFee(
                                    doctors.find(
                                      (doctor) =>
                                        doctor.id === formData.doctorId
                                    )?.fee
                                  )
                                : "Chưa chọn bác sĩ"}
                            </div>
                            <span className="text-gray-500 text-xs">
                              Chưa bao gồm chi phí chụp chiếu, xét nghiệm, phí
                              đặt lịch là miễn phí
                            </span>
                          </div>

                          <div>
                            <label className="block font-medium mb-2 text-gray-700">
                              Khung giờ khả dụng ngày{" "}
                              {formatTimestampToDate(selectedDate)}{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            {formData.doctorId ? (
                              getAvailableHoursForDate(selectedDate, timeSlots)
                                .length > 0 ? (
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                  {getAvailableHoursForDate(
                                    selectedDate,
                                    timeSlots
                                  ).map((slot, index) => {
                                    const timeSlotValue = `${slot.scheduleId}-${slot.hourId}`;
                                    return (
                                      <motion.div
                                        key={timeSlotValue}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        variants={childVariants}
                                        onClick={() =>
                                          handleTimeSlotSelect(
                                            timeSlotValue,
                                            slot.doctorId,
                                            slot.doctorName
                                          )
                                        }
                                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 text-sm flex justify-between items-center shadow-sm ${
                                          formData.timeSlot === timeSlotValue
                                            ? "bg-blue-100 border-blue-500"
                                            : "bg-white border-gray-200 hover:bg-gray-100"
                                        }`}
                                      >
                                        <span className="font-medium">
                                          {slot.hourName}
                                        </span>
                                        {formData.timeSlot ===
                                          timeSlotValue && (
                                          <span className="text-blue-500 text-xs font-semibold flex items-center">
                                            <CheckCircle
                                              className="mr-1"
                                              size={14}
                                            />
                                            Đã chọn
                                          </span>
                                        )}
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">
                                  Không có khung giờ khả dụng cho ngày này.
                                </p>
                              )
                            ) : (
                              <p className="text-gray-500 italic">
                                Vui lòng chọn bác sĩ để xem lịch.
                              </p>
                            )}
                            {errors.timeSlot && (
                              <p className="text-red-600 text-xs mt-2 flex items-center">
                                <AlertCircle className="mr-2" size={14} />
                                {errors.timeSlot}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>

                {/* Form Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex justify-end gap-3 mt-8"
                >
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    disabled={loadingStates.bookSchedule}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleBookSchedule}
                    className="px-4 py-2 bg-[#06a3da] hover:bg-[#0589b7] text-white rounded-lg transition-all duration-300 font-semibold flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    disabled={isOtpSent || loadingStates.bookSchedule}
                  >
                    {loadingStates.bookSchedule ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={18} />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CalendarDays className="mr-2" size={18} />
                        Đặt lịch
                      </>
                    )}
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* OTP Modal */}
        <AnimatePresence>
          {isOtpSent && isFormValid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl w-full max-w-md p-6 sm:p-8 transform transition-all duration-300 scale-95 animate-modalOpen"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Xác minh mã OTP
                  </h2>
                  <button
                    onClick={handleCloseOtpModal}
                    className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-gray-600 text-sm mb-4 text-center"
                >
                  Mã OTP đã được gửi đến email{" "}
                  <span className="font-semibold text-blue-600">
                    {formData.email}
                  </span>
                  . Vui lòng nhập mã 6 số để xác minh.
                </motion.p>

                <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                  {otpInputs.map((digit, index) => (
                    <motion.input
                      key={index}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={childVariants}
                      type="text"
                      value={digit}
                      onChange={(e) =>
                        handleOtpInputChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el) => (otpRefs.current[index] = el)}
                      maxLength={1}
                      className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        otpTimeRemaining <= 0
                          ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : digit
                          ? "border-blue-500 text-blue-600"
                          : "border-gray-300"
                      }`}
                      disabled={
                        otpTimeRemaining <= 0 || loadingStates.verifyOtp
                      }
                    />
                  ))}
                </div>

                {otpTimeRemaining > 0 ? (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-gray-600 text-sm text-center mb-6"
                  >
                    Mã OTP còn hiệu lực trong{" "}
                    <span className="font-semibold text-blue-600">
                      {otpTimeRemaining}
                    </span>{" "}
                    giây.
                  </motion.p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mb-6"
                  >
                    <p className="text-red-600 text-sm mb-3 flex items-center justify-center">
                      <AlertCircle className="mr-2" size={16} />
                      Mã OTP đã hết hạn!
                    </p>
                    <button
                      onClick={handleResendOtp}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center justify-center mx-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
                      disabled={loadingStates.bookSchedule}
                    >
                      {loadingStates.bookSchedule ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={18} />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2" size={18} />
                          Gửi lại OTP
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {errors.otp && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-red-600 text-sm mb-4 text-center flex items-center justify-center"
                  >
                    <AlertCircle className="mr-2" size={16} />
                    {errors.otp}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={verifyOtpAndBook}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-green-400 disabled:cursor-not-allowed"
                    disabled={
                      loadingStates.verifyOtp ||
                      otpTimeRemaining <= 0 ||
                      formData.otp.length !== 6
                    }
                  >
                    {loadingStates.verifyOtp ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={18} />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2" size={18} />
                        Xác minh và đặt lịch
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <ToastContainer />
      </AnimatedPageWrapper>
    </Layout>
  );
};

export default PatientBookingForm;
