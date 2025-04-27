import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../Default/Layout";
import AnimatedPageWrapper from "../Default/AnimatedPageWrapper";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <AnimatedPageWrapper className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto"
        >
          <motion.h1
            className="text-4xl font-bold text-red-500 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Không Có Quyền Truy Cập
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị
            viên nếu bạn nghĩ đây là lỗi.
          </motion.p>
          <motion.button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-semibold shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Quay về trang chủ
          </motion.button>
        </motion.div>
      </AnimatedPageWrapper>
    </Layout>
  );
};

export default Unauthorized;
