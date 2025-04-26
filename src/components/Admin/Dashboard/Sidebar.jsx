import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation items configuration with improved icons and translations
  const navItems = [
    {
      path: "/dashboard",
      label: "Tổng quan",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/doctors-list",
      label: "Quản lý bác sĩ",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      path: "/major-list",
      label: "Quản lý chuyên khoa",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  // Group for user profile section at bottom
  const userMenu = [
    {
      label: "Đăng xuất",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("roleId");
        localStorage.removeItem("userId");
        sessionStorage.clear();
        localStorage.clear();
        navigate("/");
      },
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header/Logo */}
      <div>
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-xl font-bold text-indigo-900">Diệp Sinh</h1>
                <div className="flex items-center">
                  <p className="text-xs text-gray-500">Hospital</p>
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                    Trang quản lý
                  </span>
                </div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto bg-indigo-600 text-white p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          )}

          {/* Collapse button */}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-2">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`px-4 py-3 flex items-center cursor-pointer hover:bg-indigo-50 transition-colors duration-200 ${
                currentPath === item.path
                  ? "text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600 font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center justify-center">
                <div
                  className={`${
                    isCollapsed ? "mx-auto" : "mr-3"
                  } flex-shrink-0`}
                >
                  {item.icon}
                </div>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Section at Bottom */}
      <div className="mt-auto border-t border-gray-200">
        {isCollapsed && (
          <div className="p-4 flex justify-center">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full border-2 border-indigo-600"
                src="/api/placeholder/40/40"
                alt="User avatar"
              />
            </div>
          </div>
        )}

        {/* User menu items */}
        {userMenu.map((item, index) => (
          <div
            key={index}
            className="px-4 py-3 flex items-center cursor-pointer text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            onClick={item.onClick}
          >
            <div
              className={`${isCollapsed ? "mx-auto" : "mr-3"} flex-shrink-0`}
            >
              {item.icon}
            </div>
            {!isCollapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
