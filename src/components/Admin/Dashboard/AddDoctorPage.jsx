// pages/AddDoctorPage.js
import React, { useState } from "react";
import Layout from "./Layout";

const AddDoctorPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    degree: "",
    password: "",
    address1: "",
    address2: "",
    experience: "1 Year",
    fees: "",
    about: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your API call or data processing logic here
  };

  return (
    <Layout title="Add Doctor">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="Degree"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Set Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Address 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                placeholder="Address 1"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            {/* Address 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 opacity-0">
                Address 2
              </label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                placeholder="Address 2"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Fees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fees
              </label>
              <input
                type="text"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                placeholder="Doctor fees"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* About Doctor */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Doctor
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="write about doctor"
              rows="6"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Add doctor
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddDoctorPage;
