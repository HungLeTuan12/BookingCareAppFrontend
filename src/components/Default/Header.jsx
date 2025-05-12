import { Clock, Mail, Phone } from "lucide-react";

const Header = () => {
  return (
    <div className="bg-[#06a3da] text-white py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        {/* Giờ mở cửa */}
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span className="text-sm sm:text-base font-medium">
            Giờ mở cửa: Thứ hai - Chủ nhật: 7:00 - 17:00
          </span>
        </div>

        {/* Email và Số điện thoại */}
        <div className="flex space-x-4 sm:space-x-6">
          <a
            href="mailto:diepsinhhospital@gmail.com"
            className="flex items-center space-x-2 hover:text-gray-200 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            <span className="text-sm sm:text-base font-medium">
              diepsinhhospital@gmail.com
            </span>
          </a>
          <a
            href="tel:+0942873795"
            className="flex items-center space-x-2 hover:text-gray-200 transition-all duration-300"
          >
            <Phone className="w-5 h-5" />
            <span className="text-sm sm:text-base font-medium">
              +0942 873 7955
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
