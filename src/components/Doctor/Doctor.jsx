import React, { useCallback, useEffect, useState } from "react"; // Add React import
import Footer from "../Default/Footer";
import Header from "../Default/Header";
import Navigation from "../Default/Navigation";
import ScrollToTop from "../Default/ScrollToTop";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, X, Info } from "lucide-react";
import { motion } from "framer-motion"; // Add Framer Motion
import AnimatedPageWrapper, {
  childVariants,
  imageVariants,
} from "../Default/AnimatedPageWrapper"; // Import the wrapper and variants
import Layout from "../Default/Layout";

const Doctor = () => {
  const [activeSpecialty, setActiveSpecialty] = useState(null);
  const [majorId, setMajorId] = useState("");
  const [majors, setMajors] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [status, setStatus] = useState("dl");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState({ doctors: false, majors: false });
  const [totalPages, setTotalPages] = useState(1);
  const [doctorCountPerMajor, setDoctorCountPerMajor] = useState({});
  const navigate = useNavigate();

  // Fetch all majors and count doctors per major
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        setLoading((prev) => ({ ...prev, majors: true }));
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/majors`
        );
        const majorsData = res.data.data || [];
        setMajors(majorsData);

        // Fetch doctor count for each major
        const counts = {};
        for (const major of majorsData) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/doctors`,
            {
              params: { majorId: major.id, size: 1000 },
            }
          );
          counts[major.id] = response.data.data.length || 0;
        }
        setDoctorCountPerMajor(counts);
      } catch (err) {
        console.error("Error fetching majors:", err);
      } finally {
        setLoading((prev) => ({ ...prev, majors: false }));
      }
    };
    fetchMajors();
  }, []);

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, doctors: true }));
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
      setDoctors(response.data.data || []);
      setTotalPages(response.data.data[0]?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading((prev) => ({ ...prev, doctors: false }));
    }
  }, [page, size, majorId, search, status]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Hàm xử lý chung khi chọn chuyên khoa
  const handleSpecialtySelect = (majorId, majorName) => {
    setMajorId(majorId);
    setActiveSpecialty(majorName);
    setPage(1); // Reset về trang 1 khi thay đổi chuyên khoa
  };

  // Hàm xóa bộ lọc
  const handleDeleteFilter = () => {
    setMajorId("");
    setSearch("");
    setStatus("dl");
    setActiveSpecialty(null);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Skeleton Loading Component
  const SkeletonCard = ({ index }) => (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={childVariants}
      className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse"
    >
      <div className="aspect-w-1 aspect-h-1 bg-gray-200 h-64"></div>
      <div className="p-5">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </motion.div>
  );

  return (
    <Layout>
      <AnimatedPageWrapper className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        <div className="section max-w-8xl mx-auto mt-10 p-6 sm:p-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
            {/* Tiêu đề trang */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl sm:text-4xl font-bold uppercase text-gray-800 border-b-4 border-blue-600 inline-block pb-2"
              >
                Tìm Kiếm Bác Sĩ
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-2 text-gray-600 text-sm sm:text-base"
              >
                Khám phá đội ngũ bác sĩ chuyên môn cao tại Diệp Sinh.
              </motion.p>
            </div>

            {/* Bộ lọc */}
            <div className="section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-5 bg-gray-50 rounded-lg shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tìm theo tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên bác sĩ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn chuyên khoa
                </label>
                {loading.majors ? (
                  <div className="flex items-center justify-center p-3">
                    <Loader2 className="animate-spin text-blue-600" size={20} />
                  </div>
                ) : (
                  <select
                    value={majorId}
                    onChange={(e) => {
                      const selectedMajorId = e.target.value;
                      const selectedMajor = majors.find(
                        (major) => major.id.toString() === selectedMajorId
                      );
                      handleSpecialtySelect(
                        selectedMajorId,
                        selectedMajor ? selectedMajor.name : null
                      );
                    }}
                    className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <option value="">Tất cả chuyên khoa</option>
                    {majors.map((major) => (
                      <option key={major.id} value={major.id}>
                        {major.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <option value="dl">Đang làm việc</option>
                  <option value="INACTIVE">Đã nghỉ</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleDeleteFilter}
                  className="w-full bg-[#06a3da] hover:bg-[#0589b7] text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm flex items-center justify-center"
                >
                  <X className="mr-2" size={18} />
                  Xóa bộ lọc
                </button>
              </div>
            </div>

            <div className="section flex flex-col lg:flex-row gap-6">
              {/* Sidebar với bộ lọc chuyên khoa */}
              <div className="w-full lg:w-1/4 sticky top-20 h-fit">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleSpecialtySelect("", null)}
                    className={`p-4 rounded-lg border text-left font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                      activeSpecialty === null
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                    } focus:outline-none focus:ring-0`}
                  >
                    Tất cả chuyên khoa{" "}
                    {doctors.length > 0 && `(${doctors.length})`}
                  </button>
                  {loading.majors ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2
                        className="animate-spin text-blue-600"
                        size={24}
                      />
                      <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                  ) : (
                    majors.map((major, index) => (
                      <motion.button
                        key={major.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={childVariants}
                        className={`p-4 rounded-lg border text-left font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                          activeSpecialty === major.name
                            ? "bg-blue-50 text-blue-600 border-blue-600"
                            : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                        } focus:outline-none focus:ring-0`}
                        onClick={() =>
                          handleSpecialtySelect(major.id, major.name)
                        }
                      >
                        {major.name} ({doctorCountPerMajor[major.id] || 0})
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              {/* Danh sách bác sĩ */}
              <div className="section w-full lg:w-3/4">
                {doctors.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-gray-600 mb-4"
                  >
                    Tìm thấy{" "}
                    <span className="font-semibold">{doctors.length}</span> bác
                    sĩ
                  </motion.p>
                )}
                {loading.doctors ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                      <SkeletonCard key={index} index={index} />
                    ))}
                  </div>
                ) : doctors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {doctors.map((doctor, index) => (
                      <motion.div
                        key={doctor.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={childVariants}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        onClick={() => navigate(`/doctor/${doctor.id}`)}
                      >
                        <div className="aspect-w-1 aspect-h-1 bg-blue-50">
                          <motion.img
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={imageVariants}
                            src={doctor.avatar}
                            alt={doctor.fullName}
                            className="object-cover w-full h-64 cursor-pointer transition-transform duration-300 hover:scale-105"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/150")
                            }
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center mb-3 relative group">
                            <div
                              className={`h-3 w-3 rounded-full mr-2 ${
                                doctor.trangthai !== ""
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span
                              className={`text-sm font-medium ${
                                doctor.trangthai !== ""
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {doctor.trangthai !== "" ? "Sẵn sàng" : "Bận"}
                            </span>
                            <div className="absolute left-0 top-6 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                              {doctor.trangthai !== ""
                                ? "Bác sĩ đang sẵn sàng nhận lịch khám."
                                : "Bác sĩ hiện không nhận lịch khám."}
                            </div>
                          </div>
                          <h3 className="font-semibold text-lg text-gray-800 truncate">
                            {doctor.fullName}
                          </h3>
                          <p className="text-gray-600 text-sm truncate">
                            {doctor.major.name}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">
                      Chưa có thông tin bác sĩ nào được cập nhật!
                    </p>
                  </div>
                )}

                {/* Phân trang */}
                {doctors.length > 0 && (
                  <div className="section flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        page === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#06a3da] hover:bg-[#0589b7] text-white"
                      }`}
                    >
                      Trước
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <motion.button
                          key={pageNumber}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          variants={childVariants}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                            page === pageNumber
                              ? "bg-[#06a3da] hover:bg-[#0589b7] text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          {pageNumber}
                        </motion.button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        page === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#06a3da] hover:bg-[#0589b7] text-white"
                      }`}
                    >
                      Sau
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedPageWrapper>
    </Layout>
  );
};

export default Doctor;
