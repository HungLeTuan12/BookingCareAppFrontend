import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const role = localStorage.getItem("roleId");
  const patient = localStorage.getItem("patientToken");
  const patientName = localStorage.getItem("patientName");
  const location = useLocation();
  const currentPath = location.pathname;

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const roleId = localStorage.getItem("userId");
    if (roleId) {
      setIsLoggedIn(true);
      setUserRole(roleId);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    localStorage.removeItem("userId");
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login_v2");
  };

  return (
    <div className="bg-white shadow-lg py-4 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-[#06a3da] text-2xl sm:text-3xl font-bold flex items-center cursor-pointer hover:text-[#0589b7] transition-all duration-300"
        >
          BVĐK DIỆP SINH
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 text-gray-800">
          <a
            onClick={() => navigate("/")}
            className={`relative font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer ${
              currentPath === "/"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            TRANG CHỦ
          </a>
          <a
            onClick={() => navigate("/specialty")}
            className={`relative font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer ${
              currentPath === "/specialty"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            CHUYÊN KHOA
          </a>
          <a
            onClick={() => navigate("/doctor")}
            className={`relative font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer ${
              currentPath === "/doctor"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            CHUYÊN GIA-BÁC SĨ
          </a>
          {role != 2 && (
            <a
              onClick={() => navigate("/booking")}
              className={`relative font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer ${
                currentPath === "/booking"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              ĐẶT LỊCH KHÁM
            </a>
          )}
        </nav>

        {/* Avatar or Login Button */}
        {isLoggedIn || patient ? (
          <div className="relative">
            <div
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-2 cursor-pointer border-2 border-[#06a3da] rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              <img
                src="data:image/png;base64,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"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/40")
                } // Hình mặc định nếu lỗi
              />
              {patientName && (
                <span className="text-[#06a3da] font-semibold text-sm sm:text-base">
                  Xin chào, {patientName}
                </span>
              )}
              <ChevronDown className="text-[#06a3da] w-5 h-5" />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-50 animate-fadeIn">
                {role === "1" && (
                  <a
                    onClick={() => {
                      navigate("/dashboard");
                      setShowDropdown(false);
                    }}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                  >
                    Trang quản lý
                  </a>
                )}
                {role === "2" && (
                  <a
                    onClick={() => {
                      navigate("/doctor-schedule");
                      setShowDropdown(false);
                    }}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                  >
                    Quản lý lịch khám
                  </a>
                )}
                {patientName && (
                  <a
                    onClick={() => {
                      navigate("/appointment");
                      setShowDropdown(false);
                    }}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                  >
                    Quản lý lịch hẹn
                  </a>
                )}

                <a
                  onClick={handleLogout}
                  className="block px-4 py-3 text-red-600 hover:bg-gray-100 cursor-pointer transition-all duration-200 border-t"
                >
                  Đăng xuất
                </a>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login_v2")}
            className="hidden md:block bg-[#06a3da] text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-[#0589b7] transition-all duration-300 shadow-md"
          >
            ĐĂNG NHẬP
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 bg-white shadow-lg animate-slideIn">
          <nav className="flex flex-col space-y-4 px-4 text-gray-800">
            <a
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
              className={`font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 ${
                currentPath === "/"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              TRANG CHỦ
            </a>
            <a
              onClick={() => {
                navigate("/specialty");
                setIsMenuOpen(false);
              }}
              className={`font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 ${
                currentPath === "/specialty"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              CHUYÊN KHOA
            </a>
            <a
              onClick={() => {
                navigate("/doctor");
                setIsMenuOpen(false);
              }}
              className={`font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 ${
                currentPath === "/doctor"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              CHUYÊN GIA-BÁC SĨ
            </a>
            <a
              onClick={() => {
                navigate("/facilities");
                setIsMenuOpen(false);
              }}
              className={`font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 ${
                currentPath === "/facilities"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              TIỆN NGHI
            </a>
            <a
              onClick={() => {
                navigate("/news");
                setIsMenuOpen(false);
              }}
              className={`font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 ${
                currentPath === "/news"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              TIN TỨC
            </a>
            {role === "1" && (
              <a
                onClick={() => {
                  navigate("/dashboard");
                  setIsMenuOpen(false);
                }}
                className={`font-semibold text-base py-2 px-3 rounded-lg transition-all duration-300 ${
                  currentPath === "/dashboard"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                QUẢN LÝ
              </a>
            )}
            {role != 2 && (
              <button
                onClick={() => {
                  navigate("/booking");
                  setIsMenuOpen(false);
                }}
                className="bg-[#06a3da] text-white px-4 py-2 font-semibold rounded-lg hover:bg-[#0589b7] transition-all duration-300 shadow-md text-center"
              >
                ĐẶT LỊCH KHÁM
              </button>
            )}
            {!isLoggedIn && !patient && (
              <button
                onClick={() => {
                  navigate("/login_v2");
                  setIsMenuOpen(false);
                }}
                className="bg-[#06a3da] text-white px-4 py-2 font-semibold rounded-lg hover:bg-[#0589b7] transition-all duration-300 shadow-md text-center"
              >
                ĐĂNG NHẬP
              </button>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navigation;
