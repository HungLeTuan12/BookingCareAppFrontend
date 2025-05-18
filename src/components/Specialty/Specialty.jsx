import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Footer from "../Default/Footer";
import Header from "../Default/Header";
import Navigation from "../Default/Navigation";
import ScrollToTop from "../Default/ScrollToTop";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import AnimatedPageWrapper, {
  childVariants,
  imageVariants,
} from "../Default/AnimatedPageWrapper"; // Import the wrapper and variants

const Specialty = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSpecialty, setExpandedSpecialty] = useState(null);

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/majors`
      );
      const data = response.data.data || [];
      const formattedSpecialties = data.map((specialty) => ({
        icon: specialty.image || "https://via.placeholder.com/80",
        name: specialty.name,
        description: specialty.description || "Không có mô tả.",
        path: `/specialty/${specialty.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")}`,
      }));
      setSpecialties(formattedSpecialties);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chuyên khoa:", error);
      toast.error("Có lỗi xảy ra khi lấy danh sách chuyên khoa!");
      setSpecialties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const filteredSpecialties = specialties.filter((specialty) =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageClick = (index) => {
    setExpandedSpecialty(expandedSpecialty === index ? null : index);
  };

  return (
    <AnimatedPageWrapper className="w-full min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navigation />

      {/* Main Content - Banner */}
      <div className="section relative w-full h-96 flex items-center justify-center">
        <img
          src="https://tamanhhospital.vn/wp-content/uploads/2021/06/chuyen-khoa-benh-vien-tam-anh.jpg"
          alt="Event Banner"
          className="w-full h-full object-cover"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/1920x400")
          }
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Chuyên khoa tại Diệp Sinh
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto"
          >
            Khám phá các chuyên khoa hàng đầu với đội ngũ bác sĩ chuyên môn cao
            và công nghệ hiện đại.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={() => navigate("/booking")}
            className="mt-6 px-6 py-3 bg-[#06a3da] hover:bg-[#0589b7] text-white rounded-lg font-semibold transition-all duration-300 shadow-md"
          >
            Đặt lịch khám ngay
          </motion.button>
        </div>
      </div>

      {/* Search Section */}
      <div className="section text-center py-12">
        <div className="relative inline-block w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-full px-5 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#06a3da] transition-all duration-300"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[#06a3da] text-2xl sm:text-3xl font-bold mt-6"
        >
          DANH SÁCH CHUYÊN KHOA
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-16 h-1 bg-[#06a3da] mx-auto mt-3"
        />
      </div>

      {/* Specialties List */}
      <div className="section max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <p className="col-span-full text-center text-gray-600 text-lg">
            Đang tải danh sách chuyên khoa...
          </p>
        ) : filteredSpecialties.length > 0 ? (
          filteredSpecialties.map((specialty, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={childVariants}
              className="bg-white shadow-md rounded-lg p-6 text-center transform hover:shadow-lg transition-all duration-300"
            >
              <div
                onClick={() => handleImageClick(index)}
                className="cursor-pointer"
              >
                <motion.img
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={imageVariants}
                  src={specialty.icon}
                  alt={specialty.name}
                  className="mx-auto w-20 h-20 object-cover rounded-full"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/80")
                  }
                />
              </div>
              <h3
                // onClick={() => navigate(specialty.path)}
                className="text-[#06a3da] font-semibold text-lg mt-4"
              >
                {specialty.name}
              </h3>
              <p className="mt-3 text-gray-600 text-sm transition-all duration-300">
                {specialty.description}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600 text-lg">
            Không tìm thấy chuyên khoa phù hợp.
          </p>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* ScrollToTop */}
      <ScrollToTop />

      {/* Toast */}
      <ToastContainer />
    </AnimatedPageWrapper>
  );
};

export default Specialty;
