import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../Default/Layout";
import AnimatedPageWrapper from "../Default/AnimatedPageWrapper";
import {
  Search,
  AlertTriangle,
  Home,
  Calendar,
  Users,
  Send,
} from "lucide-react";

// Variants cho hiệu ứng lắc nhẹ
const shakeVariants = {
  animate: {
    rotate: [0, 5, -5, 5, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

// Variants cho các phần tử con
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const NotFound = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Giả lập tìm kiếm bằng cách điều hướng đến một trang tìm kiếm (nếu có)
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleReportError = () => {
    // Giả lập báo lỗi (có thể gửi email hoặc mở form báo lỗi)
    window.location.href =
      "mailto:support@diepsinhhospital.com?subject=Phản hồi lỗi 404";
  };

  return (
    <Layout>
      <AnimatedPageWrapper className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative text-center p-10 bg-white rounded-2xl shadow-2xl max-w-lg mx-auto my-12"
        >
          {/* Hình ảnh minh họa hoặc số 404 động */}
          <motion.div
            variants={shakeVariants}
            animate="animate"
            className="flex justify-center mb-6"
          >
            <AlertTriangle className="text-red-500 w-24 h-24" />
          </motion.div>
          <motion.h1
            className="text-7xl font-extrabold text-red-500 mb-4 tracking-tight"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            404
          </motion.h1>
          <motion.h2
            className="text-2xl font-semibold text-gray-800 mb-3"
            variants={childVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            Trang Không Tồn Tại
          </motion.h2>
          <motion.p
            className="text-gray-600 text-base mb-8 leading-relaxed"
            variants={childVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Hãy
            thử tìm kiếm hoặc quay lại các trang chính.
          </motion.p>

          {/* Thanh tìm kiếm */}
          <motion.form
            onSubmit={handleSearch}
            className="flex items-center justify-center mb-8"
            variants={childVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <motion.button
              type="submit"
              className="ml-3 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-semibold shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tìm
            </motion.button>
          </motion.form>

          {/* Các liên kết nhanh */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            variants={childVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <motion.a
              href="/"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="text-blue-600 mb-2" size={24} />
              <span className="text-blue-600 font-medium text-sm">
                Trang Chủ
              </span>
            </motion.a>
            <motion.a
              href="/booking"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="text-blue-600 mb-2" size={24} />
              <span className="text-blue-600 font-medium text-sm">
                Đặt Lịch
              </span>
            </motion.a>
            <motion.a
              href="/doctor"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="text-blue-600 mb-2" size={24} />
              <span className="text-blue-600 font-medium text-sm">Bác Sĩ</span>
            </motion.a>
          </motion.div>

          {/* Nút báo lỗi và quay về trang chủ */}
          <motion.div
            className="flex justify-center gap-4"
            variants={childVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={handleReportError}
              className="flex items-center px-5 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="mr-2" size={18} />
              Báo Lỗi
            </motion.button>
            <motion.button
              onClick={() => navigate("/")}
              className="flex items-center px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-semibold shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="mr-2" size={18} />
              Quay Về Trang Chủ
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatedPageWrapper>
    </Layout>
  );
};

export default NotFound;
