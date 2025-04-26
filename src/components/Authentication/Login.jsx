import { useState } from "react";
import Header from "../Default/Header";
import Navigation from "../Default/Navigation";
import Footer from "../Default/Footer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import { ArrowLeft } from "lucide-react";

import axios from "axios";

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
    // Clear any previous error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        formData
      );
      toast.success("Chào mừng bạn đến với bệnh viện Diệp Sinh !");
      setSuccess(true);
      localStorage.clear();
      localStorage.setItem("token", response.data.data.accessToken);
      localStorage.setItem("roleId", response.data.data.roleId);
      localStorage.setItem("userId", response.data.data.userId);

      if (response.data.data.roleId === 1) {
        navigate("/dashboard");
      } else {
        // Optional: Redirect to login page after successful registration
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
    <div className="w-full min-h-screen bg-white">
      <ToastContainer />
      <div className="flex flex-row h-screen w-full">
        <div className="mb-8 mt-8 ml-8">
          <button onClick={() => navigate("/")} className="text-blue-500">
            <ArrowLeft size={30} />
          </button>
        </div>
        <div className="flex flex-col w-full md:w-1/2 p-8 justify-center items-center">
          {/* Logo */}
          <div className="w-full max-w-md">
            {/* Back button */}

            <div className="mb-8 text-center">
              <h3 className="text-blue-500 text-4xl font-bold">ĐĂNG NHẬP</h3>
              <p className="text-gray-500 mt-2">
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
                  loading ? (
                    <FerrisWheelSpinner loading={loading} color="#FF7626" />
                  ) : (
                    "hover:bg-indigo-600"
                  )
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

        {/* Right side - Image and text */}
        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <div className="h-full relative">
            {/* Placeholder for the woman with phone image */}
            <div className="h-full w-full bg-cover bg-center bg-no-repeat">
              <img
                src="src\assets\img\banner\banner.jpg"
                alt="Woman using mobile app"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
