import React, { useState, useEffect, useCallback } from "react";
import DoctorModal from "./DoctorModal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../Dashboard/Layout";
import {
  Search,
  Loader2,
  PlusCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DoctorList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search, setSearch] = useState("");
  const [majorId, setMajorId] = useState("");
  const [status, setStatus] = useState("dl");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [majors, setMajors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/majors`)
      .then((res) => setMajors(res.data.data))
      .catch((err) => console.error("Error fetching majors:", err));
  }, []);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/doctors`,
        {
          params: {
            page,
            size,
            majorId: majorId || undefined,
            name: search || undefined,
            status: status || undefined,
          },
        }
      );
      setDoctors(response.data.data);
      console.log("Doctor: ", response.data.data);

      setTotalPages(response.data.data[0]?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Không thể tải danh sách bác sĩ!");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, majorId, search, status]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleAddSuccess = () => {
    fetchDoctors();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bác sĩ này?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/v1/doctor/${id}`
        );
        toast.success("Xóa thành công!");
        fetchDoctors();
      } catch (error) {
        console.error("Error deleting doctor:", error);
        toast.error("Không thể xóa bác sĩ!");
      }
    }
  };

  // Hàm định dạng phí khám
  const formatFee = (fee) => {
    if (fee === 0 || fee === null || fee === undefined) {
      return "Miễn phí";
    }
    return `${fee.toLocaleString("vi-VN")}đ`;
  };

  return (
    <Layout title="Danh sách Bác sĩ">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* Tiêu đề */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Danh sách Bác sĩ
            <span className="ml-2 text-sm text-gray-500">
              ({doctors.length} bác sĩ)
            </span>
          </h2>
          <button
            className="flex items-center px-4 py-2 bg-[#06a3da] text-white rounded-lg hover:bg-[#0589b7] transition-all duration-300 font-semibold shadow-md"
            onClick={() => {
              setSelectedDoctor(null);
              setIsModalOpen(true);
            }}
          >
            <PlusCircle className="mr-2" size={18} />
            Thêm bác sĩ mới
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          <select
            value={majorId}
            onChange={(e) => setMajorId(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300"
          >
            <option value="">Chọn chuyên khoa</option>
            {majors.map((major) => (
              <option key={major.id} value={major.id}>
                {major.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300"
          >
            <option value="dl">Đang làm việc</option>
            <option value="INACTIVE">Đã nghỉ</option>
          </select>
        </div>

        {/* Tùy chọn kích thước trang */}
        <div className="flex justify-end mb-4">
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300"
          >
            <option value={5}>5 bác sĩ/trang</option>
            <option value={10}>10 bác sĩ/trang</option>
            <option value={20}>20 bác sĩ/trang</option>
          </select>
        </div>

        {/* Bảng danh sách */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-[#06a3da]" size={40} />
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avatar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chuyên khoa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phí khám
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.length > 0 ? (
                  doctors.map((doctor, index) => (
                    <tr
                      key={doctor.id}
                      className="hover:bg-gray-50 transition-all duration-300 animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={
                            doctor.avatar || "https://via.placeholder.com/50"
                          }
                          alt="Avatar"
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                        {doctor.fullName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {doctor.major?.name || "Không xác định"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            doctor.trangthai === "dl"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {doctor.trangthai === "dl"
                            ? "Đang làm việc"
                            : "Đã nghỉ"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {formatFee(doctor.fee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="text-[#06a3da] hover:text-[#0589b7] mr-4 transition-all duration-300"
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit className="inline mr-1" size={16} />
                          Sửa
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition-all duration-300"
                          onClick={() => handleDelete(doctor.id)}
                        >
                          <Trash2 className="inline mr-1" size={16} />
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6" // Cập nhật colSpan vì bảng có 6 cột
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <p className="text-lg">Không tìm thấy bác sĩ nào.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
          <p className="text-gray-600 mb-4 sm:mb-0">
            Trang {page} / {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#06a3da] text-white hover:bg-[#0589b7]"
              }`}
            >
              <ChevronLeft className="mr-1" size={18} />
              Trước
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#06a3da] text-white hover:bg-[#0589b7]"
              }`}
            >
              Sau
              <ChevronRight className="ml-1" size={18} />
            </button>
          </div>
        </div>
      </div>

      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
        doctor={selectedDoctor}
      />
    </Layout>
  );
};

export default DoctorList;
