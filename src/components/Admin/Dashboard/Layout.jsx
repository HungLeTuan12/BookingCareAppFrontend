// components/Layout.js - Common layout for all pages
import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl text-center font-semibold">{title}</h2>
          {/* <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors">
            Logout
          </button> */}
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
