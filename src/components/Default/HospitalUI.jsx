import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import Header from "./Header";
import AppointmentRegistrationProcess from "./AppointmentRegistrationProcess";
import { motion } from "framer-motion";
import AnimatedPageWrapper, {
  childVariants,
} from "../Default/AnimatedPageWrapper";

const HospitalUI = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const specialtyIcons = {
    "CK Tim Mạch": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        <circle cx="12" cy="7" r="4" fill="#E8EEF9" stroke="#2563EB"></circle>
        <path d="M12 7v7M9 10h6"></path>
      </svg>
    ),
    "CK Phụ Sản": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12 2a5 5 0 0 1 5 5c0 2-3 8-5 8s-5-6-5-8a5 5 0 0 1 5-5z"
          fill="#2563EB"
        ></path>
        <path d="M9 11v5a3 3 0 0 0 6 0v-5"></path>
      </svg>
    ),
    "CK Da Liễu": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" fill="#FFD7C9"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    ),
    "CK Nhi": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="6" fill="#FFE0B2"></circle>
        <path d="M12 14v7"></path>
        <path d="M9 17h6"></path>
        <path d="M9 9h.01M15 9h.01"></path>
        <path d="M10 12a2 2 0 0 0 4 0"></path>
      </svg>
    ),
    "CK Thần Kinh": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="8" fill="#E8EEF9"></circle>
        <path d="M8 12s1 3 4 3 4-3 4-3" fill="#B39DDB" stroke="#2563EB"></path>
        <path d="M8 12s1-3 4-3 4 3 4 3" fill="#B39DDB" stroke="#2563EB"></path>
      </svg>
    ),
    "CK Tiêu Hóa": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M6 9a6 6 0 0 1 12 0v7a3 3 0 0 1-6 0v-4a1 1 0 0 1 2 0v5"
          fill="#E8EEF9"
        ></path>
        <path d="M9 17a4 4 0 0 1 4 4"></path>
      </svg>
    ),
    default: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20"></path>
        <path d="M2 12h20"></path>
      </svg>
    ),
  };

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/majors`
        );
        const data = response.data.data.map((major) => ({
          title: major.name,
          icon: major.image,
        }));
        setSpecialties(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi fetch chuyên khoa:", error);
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  const SpecialtyCard = ({ icon, title, index }) => {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        animate="visible"
        variants={childVariants}
        className="flex flex-col items-center p-8 rounded-lg shadow-md bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        onClick={() => navigate("/specialty")}
      >
        <div className="bg-blue-100 rounded-full w-28 h-28 flex items-center justify-center mb-3 transform hover:scale-105 transition-all duration-300">
          <img src={icon} alt={title} />
        </div>
        <span className="text-base font-semibold text-gray-800 text-center">
          {title}
        </span>
      </motion.div>
    );
  };

  const SpecialtySkeleton = ({ index }) => (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={childVariants}
      className="flex flex-col items-center p-4 rounded-lg shadow-md bg-white animate-pulse"
    >
      <div className="bg-gray-200 rounded-full w-28 h-28 mb-3"></div>
      <div className="h-5 bg-gray-200 rounded w-20"></div>
    </motion.div>
  );

  return (
    <AnimatedPageWrapper className="w-full min-h-screen bg-gray-100">
      <Header />
      <Navigation />
      <div className="section relative w-full h-screen flex items-center justify-center">
        <img
          src="https://png.pngtree.com/background/20211215/original/pngtree-doctor-medical-health-smart-technology-banner-background-picture-image_1497812.jpg"
          alt="Event Banner"
          className="w-full h-full object-cover"
          
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
        <div className="absolute text-center text-white px-4 py-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-6xl font-bold mb-4 drop-shadow-lg tracking-wide"
          >
            Chào mừng đến với Diệp Sinh
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-2xl max-w-xl mx-auto bg-black/30 px-6 py-3 rounded-lg drop-shadow-md leading-relaxed"
          >
            Chăm sóc sức khỏe của bạn với đội ngũ chuyên gia hàng đầu và công
            nghệ hiện đại.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={() => navigate("/doctor")}
            className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Tìm bác sĩ ngay
          </motion.button>
        </div>
        {/* Ba nút ở góc dưới bên trái để che phần địa chỉ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 flex flex-wrap gap-4"
        >
          {/* Nút Đặt lịch ngay */}
          <motion.button
            onClick={() => navigate("/booking")}
            className="px-6 py-3 bg-[#06a3da] hover:bg-[#0589b7] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Đặt lịch ngay
          </motion.button>
          {/* Nút Chuyên khoa */}
          <motion.button
            onClick={() => navigate("/specialty")}
            className="px-6 py-3 bg-[#06a3da] hover:bg-[#0589b7] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a5 5 0 0 1 5 5c0 2-3 8-5 8s-5-6-5-8a5 5 0 0 1 5-5z"></path>
              <path d="M9 11v5a3 3 0 0 0 6 0v-5"></path>
            </svg>
            Chuyên khoa
          </motion.button>
          {/* Nút Bác sĩ */}
          <motion.button
            onClick={() => navigate("/doctor")}
            className="px-6 py-3 bg-[#06a3da] hover:bg-[#0589b7] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Bác sĩ
          </motion.button>
        </motion.div>
      </div>
      <div className="section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-left mb-12 mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
            Tại sao chọn Diệp Sinh Hospital?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl text-center ml-auto mr-auto">
            Là hệ thống bệnh viện tư nhân ở miền Bắc, với hơn 20 năm kinh nghiệm
            hoạt động trong lĩnh vực chăm sóc sức khỏe – sắc đẹp, bệnh viện Hồng
            Ngọc luôn chi trong mạng đến cho khách hàng những trải nghiệm hoàn
            hảo nhất
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              ),
              title: "Đội ngũ bác sĩ chuyên môn cao",
              description:
                "Đội ngũ bác sĩ, chuyên gia tại Diệp Sinh giàu kinh nghiệm, có tham niên công tác tại các bệnh viện lớn như...",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a5 5 0 0 1 5 5c0 2-3 8-5 8s-5-6-5-8a5 5 0 0 1 5-5z"></path>
                  <path d="M9 11v5a3 3 0 0 0 6 0v-5"></path>
                </svg>
              ),
              title: "Dịch vụ y tế hoàn hảo",
              description:
                "Thương hiệu Bệnh viện Da khoa Diệp Sinh nổi bật với dịch vụ y tế hoàn hảo từ tổng thể đến chi tiết như...",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9a6 6 0 0 1 12 0v7a3 3 0 0 1-6 0v-4a1 1 0 0 1 2 0v5"></path>
                  <path d="M9 17a4 4 0 0 1 4 4"></path>
                </svg>
              ),
              title: "Trang thiết bị hiện đại, dẫn đầu tiên bộ của y học",
              description:
                "Toàn bộ máy móc, trang thiết bị tại các bệnh viện, được nhập khẩu từ các nước tiên tiến, công nghệ cao, có...",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={childVariants}
              className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Chuyên khoa
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Chỉ cần duyệt qua danh sách rộng lớn của chúng tôi các bác sĩ đáng
            tin cậy, lên lịch cho cuộc hẹn của bạn không rắc rối.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
          {loading ? (
            Array(6)
              .fill()
              .map((_, index) => (
                <SpecialtySkeleton key={index} index={index} />
              ))
          ) : specialties.length > 0 ? (
            specialties.map((specialty, index) => (
              <SpecialtyCard
                key={index}
                icon={specialty.icon}
                title={specialty.title}
                index={index}
              />
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">
              Không tìm thấy chuyên khoa.
            </p>
          )}
        </div>
      </div>
      <div className="section bg-white py-16">
        <AppointmentRegistrationProcess />
      </div>
      <div className="section py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Giá trị khác biệt của Diệp Sinh
          </h1>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              icon: "🩺",
              text: "Chuyên gia đầu ngành - bác sĩ giỏi - chuyên viên giàu kinh nghiệm",
            },
            { icon: "🏥", text: "Trang thiết bị hiện đại bậc nhất" },
            { icon: "💊", text: "Hiệu quả điều trị cao, thành tựu nổi bật" },
            {
              icon: "📜",
              text: "Quy trình toàn diện, khoa học, chuyên nghiệp",
            },
            { icon: "💰", text: "Dịch vụ cao cấp, chi phí hợp lý" },
          ].map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={childVariants}
              className="bg-white p-6 rounded-lg flex flex-col items-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-5xl mb-4">{item.icon}</span>
              <p className="text-center text-base font-semibold text-gray-800">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="section py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Chuyên gia đầu ngành - bác sĩ giỏi - chuyên viên giàu kinh nghiệm
        </h1>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { count: "24", label: "Giáo sư - P. Giáo sư" },
            { count: "171", label: "Tiến sĩ - Bác sĩ CKII" },
            { count: "490", label: "Thạc sĩ - Bác sĩ CKI" },
            { count: "786", label: "Bác sĩ" },
            { count: "155", label: "Kỹ thuật viên" },
            { count: "803", label: "Điều dưỡng" },
          ].map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={childVariants}
              className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <p className="text-4xl font-bold text-blue-600">{item.count}</p>
              <p className="text-sm text-gray-600 mt-2">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
};

export default HospitalUI;
