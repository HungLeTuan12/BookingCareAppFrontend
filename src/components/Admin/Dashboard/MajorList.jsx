import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import MajorModal from "./MajorModal.jsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";

const MajorList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMajor, setSelectedMajor] = useState(null);

  // Lấy danh sách chuyên khoa
  const fetchMajors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/majors`
      );
      setMajors(response.data.data);
    } catch (error) {
      console.error("Error fetching majors:", error);
      toast.error("Không thể tải danh sách chuyên khoa!");
      setMajors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  // Xử lý thêm mới
  const handleAddClick = () => {
    setSelectedMajor(null);
    setIsModalOpen(true);
  };

  // Xử lý chỉnh sửa
  const handleEditClick = (major) => {
    setSelectedMajor(major);
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa chuyên khoa này?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/v1/major/${id}`
        );
        toast.success("Đã xóa thành công!");
        fetchMajors();
      } catch (error) {
        console.error("Error deleting major:", error);
        toast.error("Không thể xóa chuyên khoa!");
      }
    }
  };

  return (
    <Layout title="Chuyên khoa của chúng tôi">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* Tiêu đề */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Danh sách chuyên khoa
            <span className="ml-2 text-sm text-gray-500">
              ({majors.length} chuyên khoa)
            </span>
          </h2>
          <button
            className="flex items-center px-4 py-2 bg-[#06a3da] text-white rounded-lg hover:bg-[#0589b7] transition-all duration-300 font-semibold shadow-md"
            onClick={handleAddClick}
          >
            <PlusCircle className="mr-2" size={18} />
            Thêm chuyên khoa mới
          </button>
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
                    Tên chuyên khoa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ảnh chuyên khoa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {majors.length > 0 ? (
                  majors.map((major, index) => (
                    <tr
                      key={major.id}
                      className="hover:bg-gray-50 transition-all duration-300 animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                        {major.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={major.image || "https://via.placeholder.com/50"}
                          alt={major.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div
                          className="max-w-xs truncate tooltip"
                          data-tip={major.description}
                        >
                          {major.description || "Không có mô tả"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="text-[#06a3da] hover:text-[#0589b7] mr-4 transition-all duration-300"
                          onClick={() => handleEditClick(major)}
                        >
                          <Edit className="inline mr-1" size={16} />
                          Sửa
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition-all duration-300"
                          onClick={() => handleDelete(major.id)}
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
                      colSpan="4"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <p className="text-lg">Không tìm thấy chuyên khoa nào.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MajorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMajors}
        major={selectedMajor}
      />
    </Layout>
  );
};

export default MajorList;
