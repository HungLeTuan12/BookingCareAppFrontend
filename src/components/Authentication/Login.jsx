import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AnimatedPageWrapper, {
  childVariants,
} from "../Default/AnimatedPageWrapper"; // Sửa thành named import
import { motion } from "framer-motion"; // Thêm Framer Motion

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
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        formData
      );
      const { userId, email, accessToken } = response.data.data;

      localStorage.clear();
      const user = { userId, email };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);
      localStorage.setItem("token", response.data.data.accessToken);
      localStorage.setItem("roleId", response.data.data.roleId);
      localStorage.setItem("userId", response.data.data.userId);

      const decodedToken = jwtDecode(accessToken);
      const userRole = decodedToken.roles[0].replace("ROLE_", "").toLowerCase();

      toast.success("Chào mừng bạn đến với bệnh viện Diệp Sinh !");
      setSuccess(true);

      if (userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "doctor") {
        navigate("/doctor-schedule");
      } else {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại."
      );
      setError(
        err.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPageWrapper className="flex flex-row h-screen w-full">
      <ToastContainer />
      <div className="flex flex-row h-screen w-full">
        <div className="mb-8 mt-8 ml-8">
          <button onClick={() => navigate("/")} className="text-blue-500">
            <ArrowLeft size={30} />
          </button>
        </div>
        <div className="flex flex-col w-full md:w-1/2 p-8 justify-center items-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h3 className="text-blue-500 text-4xl font-bold">ĐĂNG NHẬP</h3>
              <p className="text-gray-600 mt-2">
                Vui lòng đăng nhập để thực hiện thao tác
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-600 mb-2 font-bold"
                >
                  Tên tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  maxLength={20}
                  value={formData.username}
                  placeholder="Vui lòng nhập tên tài khoản !"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-600 mb-2 font-bold"
                >
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  maxLength={20}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Vui lòng nhập mật khẩu !"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-indigo-500 text-white py-3 rounded-md transition duration-200 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-600"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FerrisWheelSpinner
                      loading={loading}
                      color="#FF7626"
                      size={20}
                    />
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <div className="h-full relative">
            <div className="h-full w-full bg-cover bg-center bg-no-repeat">
              <img
                src="src/assets/img/banner/banner.jpg"
                alt="Woman using mobile app"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedPageWrapper>
  );
};

export default Login;
