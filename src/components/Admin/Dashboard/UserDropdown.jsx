import { User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md"
      >
        <User />
        <span className="text-gray-700">User</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
          <button
            onClick={() => navigate("/profile")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Quản lý thông tin
          </button>
          <button
            onClick={() => navigate("/logout")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
