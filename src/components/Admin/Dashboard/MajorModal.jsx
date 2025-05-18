import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X, Loader2, Image as ImageIcon } from "lucide-react";

const MajorModal = ({ isOpen, onClose, onSuccess, major }) => {
  const isEditMode = !!major;
  const [majorData, setMajorData] = useState({
    name: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Điền dữ liệu khi mở modal
  useEffect(() => {
    if (major) {
      setMajorData({
        name: major.name || "",
        description: major.description || "",
      });
    } else {
      setMajorData({ name: "", description: "" });
    }
    setFile(null);
    setErrors({});
    setIsFormDirty(false);
  }, [major, isOpen]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMajorData((prev) => ({ ...prev, [name]: value }));
    setIsFormDirty(true);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Xử lý thay đổi file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setIsFormDirty(true);
  };

  // Kiểm tra dữ liệu đầu vào
  const validateForm = () => {
    const newErrors = {};
    if (!majorData.name.trim()) {
      newErrors.name = "Tên chuyên khoa không được để trống!";
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
      const jsonString = JSON.stringify(majorData);
      const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
      const formData = new FormData();
      formData.append("majordto", encodedData);
      if (file) {
        formData.append("file", file);
      }

      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/major/${major.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Chỉnh sửa thành công!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/major`,
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
      toast.error(err.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
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
      <div className="bg-white rounded-xl w-full max-w-md p-6 sm:p-8 transform transition-all duration-300 scale-95 animate-modalOpen">
        {/* Tiêu đề và nút đóng */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {isEditMode ? "Chỉnh sửa chuyên khoa" : "Thêm chuyên khoa mới"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tên chuyên khoa */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên chuyên khoa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={majorData.name}
              onChange={handleChange}
              placeholder="Nhập tên chuyên khoa"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Mô tả */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={majorData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chuyên khoa"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300 resize-none"
            />
          </div>

          {/* Hình ảnh */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh chuyên khoa
            </label>
            <div className="flex flex-col items-center">
              {major?.image && !file ? (
                <img
                  src={major.image}
                  alt="Major Image"
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

          {/* Nút hành động */}
          <div className="flex justify-end space-x-3">
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

export default MajorModal;
