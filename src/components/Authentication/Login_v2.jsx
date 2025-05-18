import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
// Thêm Framer Motion
import axios from "axios";
import AnimatedPageWrapper, {
  childVariants,
} from "../Default/AnimatedPageWrapper"; // Giả định bạn đã có AnimatedPageWrapper

// Variants cho hiệu ứng fade-in và slide-in
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1, // Các phần tử con sẽ xuất hiện lần lượt
    },
  },
};

export default function MedproLoginPage() {
  const navigate = useNavigate();
  const [patientInfo, setPatientInfo] = useState(null);
  const [formData, setFormData] = useState({
    token: "",
    cancelOtp: "",
    cancelToken: "",
  });
  const [errors, setErrors] = useState({});

  // Khởi tạo token từ sessionStorage hoặc localStorage
  useEffect(() => {
    const sessionToken = sessionStorage.getItem("patientToken");
    const localToken = localStorage.getItem("patientToken");
    if (sessionToken) {
      setFormData((prev) => ({ ...prev, token: sessionToken }));
      fetchAppointmentsByToken(sessionToken);
    } else if (localToken) {
      setFormData((prev) => ({ ...prev, token: localToken }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fetchAppointmentsByToken = async (token = formData.token) => {
    if (!token) {
      setErrors((prev) => ({
        ...prev,
        patientCode: "Vui lòng nhập mã số bệnh nhân!",
      }));
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/booking/by-token/${token}`
      );
      const patientData = response.data;
      localStorage.clear();
      localStorage.setItem("patientToken", token);
      sessionStorage.setItem("patientToken", token);
      // toast.success("Chào mừng bạn đến với Bệnh viện Diệp Sinh !");
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
      localStorage.setItem("patientName", patientData.fullName);

      navigate("/");
    } catch (error) {
      console.error("Lỗi khi xác minh mã số bệnh nhân:", error);
      alert("Mã số bệnh nhân không hợp lệ !");
      setFormData({ token: "" });
      // toast.error("Mã số bệnh nhân không hợp lệ!");
    }
  };

  return (
    <AnimatedPageWrapper className="flex flex-row h-screen w-full">
      {/* Back button */}
      <motion.div
        className="mb-8 ml-8 mt-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => navigate("/")}
          className="text-blue-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={30} />
        </motion.button>
      </motion.div>

      {/* Left side - Login form */}
      <motion.div
        className="flex flex-col w-full md:w-1/2 p-8 justify-center items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="w-full max-w-md" variants={childVariants}>
          {/* Logo */}
          <motion.div className="mb-8 text-center" variants={childVariants}>
            <motion.h1
              className="text-blue-500 text-4xl font-bold"
              variants={childVariants}
            >
              Diệp Sinh Hospital
            </motion.h1>
            <motion.p
              className="text-gray-700 mb-4 mt-2 text-center"
              variants={childVariants}
            >
              Vui lòng nhập mã bệnh nhân để tiếp tục
            </motion.p>
          </motion.div>

          {/* Phone input section */}
          <motion.div className="mb-8" variants={childVariants}>
            <motion.div
              className="flex border rounded-md overflow-hidden mb-4"
              variants={childVariants}
            >
              <motion.div
                className="flex items-center justify-center px-3 bg-gray-50 border-r"
                variants={childVariants}
              >
                <div className="flex items-center">
                  <div className="w-6 h-4 bg-red-500 relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <span className="text-yellow-400 text-xs">★</span>
                      </div>
                    </div>
                  </div>
                  <span className="ml-2 text-gray-600">MBN</span>
                </div>
              </motion.div>
              <motion.input
                type="text"
                name="token"
                value={formData.token}
                onChange={handleInputChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MBN: MBN3020DVH02"
                variants={childVariants}
              />
            </motion.div>
            {errors.patientCode && (
              <motion.p
                className="text-red-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.patientCode}
              </motion.p>
            )}
          </motion.div>

          {/* Continue button */}
          <motion.button
            onClick={() => fetchAppointmentsByToken()}
            className="w-full bg-blue-500 text-white py-3 rounded-md mb-6 font-medium"
            variants={childVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tiếp tục
          </motion.button>

          {/* Social login buttons */}
          <motion.div className="space-y-3" variants={childVariants}>
            <p className="text-[red] text-sm text-center">
              Nếu là bệnh nhân, vui lòng không chọn nút bên dưới.
            </p>
            <motion.button
              onClick={() => navigate("/login")}
              className="w-full bg-red-500 text-white py-3 rounded-md flex justify-center items-center font-medium"
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ĐĂNG NHẬP VỚI VAI TRÒ KHÁC
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - Image and text */}
      <motion.div
        className="hidden md:block md:w-1/2 bg-gray-100"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="h-full relative">
          <div className="h-full w-full bg-cover bg-center bg-no-repeat">
            <motion.img
              src="https://id.medpro.vn/static/media/cover-14.cdc08a1d.jpg"
              alt="Woman using mobile app"
              className="h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatedPageWrapper>
  );
}
