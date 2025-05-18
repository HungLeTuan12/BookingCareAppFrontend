import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X, Loader2, Image as ImageIcon } from "lucide-react";

const DoctorModal = ({ isOpen, onClose, onSuccess, doctor }) => {
  const isEditMode = !!doctor;
  const [doctorData, setDoctorData] = useState({
    fullName: "",
    userName: "",
    password: "",
    phone: "",
    email: "",
    description: "",
    trangthai: "ACTIVE",
    majorId: "",
    fee: 0, // Thêm trường fee với giá trị mặc định là 0
  });
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Điền dữ liệu khi mở modal
  useEffect(() => {
    if (doctor) {
      setDoctorData({
        fullName: doctor.fullName || "",
        userName: doctor.userName || "",
        description: doctor.description || "",
        phone: doctor.phone || "",
        email: doctor.email || "",
        trangthai: "dl",
        majorId: doctor.major?.id || "",
        fee: doctor.fee || 0, // Điền giá trị fee từ dữ liệu bác sĩ
      });
    } else {
      setDoctorData({
        fullName: "",
        userName: "",
        password: "",
        phone: "",
        email: "",
        description: "",
        trangthai: "dl",
        majorId: "",
        fee: 0, // Giá trị mặc định khi thêm mới
      });
    }
    setFile(null);
    setErrors({});
    setIsFormDirty(false);
  }, [doctor, isOpen]);

  // Lấy danh sách chuyên khoa
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/majors`)
      .then((res) => setMajors(res.data.data))
      .catch((err) => console.error("Error fetching majors:", err));
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Xử lý riêng cho trường fee để đảm bảo giá trị là số
    if (name === "fee") {
      const numericValue = value === "" ? 0 : parseFloat(value);
      if (isNaN(numericValue) || numericValue < 0) {
        setErrors((prev) => ({
          ...prev,
          fee: "Chi phí khám phải là số không âm!",
        }));
        return;
      }
      setDoctorData((prev) => ({ ...prev, fee: numericValue }));
    } else {
      setDoctorData((prev) => ({ ...prev, [name]: value }));
    }
    setIsFormDirty(true);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Kiểm tra dữ liệu đầu vào
  const validateForm = () => {
    const newErrors = {};
    if (!doctorData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống!";
    }
    if (!doctorData.userName.trim()) {
      newErrors.userName = "Tên đăng nhập không được để trống!";
    }
    if (!isEditMode && !doctorData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống!";
    }
    if (!doctorData.majorId) {
      newErrors.majorId = "Vui lòng chọn chuyên khoa!";
    }
    if (doctorData.phone && !/^\d{10,11}$/.test(doctorData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ!";
    }
    if (
      doctorData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctorData.email)
    ) {
      newErrors.email = "Email không hợp lệ!";
    }
    if (doctorData.fee < 0) {
      newErrors.fee = "Chi phí khám phải là số không âm!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const jsonString = JSON.stringify(doctorData);
      const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
      const formData = new FormData();
      formData.append("doctorDto", encodedData);
      if (file) {
        formData.append("file", file);
      }

      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/doctor/${doctor.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Chỉnh sửa thành công!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/doctor`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Thêm mới thành công!");
      }

      onSuccess();
      onClose();
      setIsFormDirty(false);
    } catch (err) {
      toast.error(err.response?.data || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setIsFormDirty(true);
  };

  // Xác nhận trước khi đóng modal nếu có thay đổi
  const handleClose = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm(
        "Bạn có thay đổi chưa lưu, có chắc chắn muốn đóng?"
      );
      if (!confirmClose) return;
    }
    onClose();
    setIsFormDirty(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <ToastContainer />
      <div className="bg-white rounded-xl w-full max-w-lg sm:max-w-2xl p-6 sm:p-8 transform transition-all duration-300 scale-95 animate-modalOpen">
        {/* Tiêu đề và nút đóng */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {isEditMode ? "Sửa thông tin bác sĩ" : "Thêm bác sĩ mới"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Họ và tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={doctorData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Tên đăng nhập */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="userName"
                value={doctorData.userName}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 ${
                  errors.userName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.userName && (
                <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
              )}
            </div>

            {/* Mật khẩu (chỉ hiển thị khi thêm mới) */}
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={doctorData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={doctorData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={doctorData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Chuyên khoa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chuyên khoa <span className="text-red-500">*</span>
              </label>
              <select
                name="majorId"
                value={doctorData.majorId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 ${
                  errors.majorId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chọn chuyên khoa</option>
                {majors.map((major) => (
                  <option key={major.id} value={major.id}>
                    {major.name}
                  </option>
                ))}
              </select>
              {errors.majorId && (
                <p className="text-red-500 text-sm mt-1">{errors.majorId}</p>
              )}
            </div>

            {/* Chi phí khám (fee) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chi phí khám (VNĐ)
              </label>
              <input
                type="number"
                name="fee"
                value={doctorData.fee}
                onChange={handleChange}
                placeholder="Nhập chi phí khám"
                min="0"
                step="1000"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 ${
                  errors.fee ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fee && (
                <p className="text-red-500 text-sm mt-1">{errors.fee}</p>
              )}
            </div>

            {/* Hình ảnh */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh đại diện
              </label>
              <div className="flex flex-col items-center">
                {doctor?.avatar && !file ? (
                  <img
                    src={doctor.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-gray-200"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/96")
                    }
                  />
                ) : file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3 border-2 border-gray-200">
                    <ImageIcon className="text-gray-400" size={40} />
                  </div>
                )}
                <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-300">
                  <ImageIcon className="mr-2" size={18} />
                  Chọn ảnh
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#06a3da] text-white rounded-lg hover:bg-[#0589b7] transition-all duration-300 font-semibold flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Đang xử lý...
                </>
              ) : isEditMode ? (
                "Lưu thay đổi"
              ) : (
                "Thêm mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal;
