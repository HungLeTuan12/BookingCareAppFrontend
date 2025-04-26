import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Cột 1: Thông tin bệnh viện */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#06a3da] mb-4">
            BVĐK DIỆP SINH
          </h2>
          <ul className="text-sm sm:text-base text-gray-300 space-y-3">
            <li>
              MST/ĐKKD/QĐTL: 0106699074 - Sở kế hoạch và đầu tư thành phố Hà Nội
              cấp ngày 05/06/2003
            </li>
            <li>
              Giấy phép hoạt động cơ sở khám chữa bệnh số 002960/HNO - CCHN.
              Ngày cấp: 27/11/2012
            </li>
          </ul>
        </div>

        {/* Cột 2: Giới thiệu về chúng tôi */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#06a3da] mb-4">
            Giới thiệu về chúng tôi
          </h2>
          <ul className="text-sm sm:text-base space-y-3">
            <li>
              <a
                onClick={() => navigate("/specialty")}
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Chuyên khoa
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/news")}
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Tin tức
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Tuyển dụng
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Hướng dẫn khách hàng
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Báo cáo
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Chính sách bảo mật */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#06a3da] mb-4">
            Chính sách bảo mật
          </h2>
          <ul className="text-sm sm:text-base space-y-3">
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Hướng dẫn thanh toán
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Trung tâm trợ giúp
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Giờ làm việc
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-300 hover:text-[#06a3da] cursor-pointer transition-all duration-300"
              >
                Phòng nội trú
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Follow Us */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#06a3da] mb-4">
            Follow Us
          </h2>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-all duration-300"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-all duration-300"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Dòng cuối */}
      <div className="text-center mt-8 border-t border-gray-600 pt-6">
        <p className="text-sm sm:text-base text-gray-300">
          © 2025 Bệnh viện Đa Khoa Diệp Sinh. All rights reserved.
        </p>
      </div>
    </div>
  );
}
