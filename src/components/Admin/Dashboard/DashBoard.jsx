// pages/DashboardPage.js
import React from "react";
import Layout from "./Layout";

const Dashboard = () => {
  return (
    <Layout title="Dashboard">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Dashboard Overview</h2>
        {/* Dashboard content would go here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="font-medium text-indigo-700">Total Doctors</h3>
            <p className="text-2xl font-bold mt-2">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-medium text-green-700">Appointments Today</h3>
            <p className="text-2xl font-bold mt-2">12</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-700">New Patients</h3>
            <p className="text-2xl font-bold mt-2">5</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Dashboard;
