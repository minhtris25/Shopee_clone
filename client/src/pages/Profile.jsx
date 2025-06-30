import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Search, Store, Truck, MessageSquare } from "lucide-react";
import axios from "axios"; // Although not used for mock data, kept as per original
import { useNavigate } from 'react-router-dom'; // Although not used for mock data, kept as per original
import debounce from 'lodash.debounce'; // Although not used for mock data, kept as per original
import { toast } from 'react-toastify'; // Make sure you have react-toastify setup in your app

// Import your mock data - Renamed 'Profile' to 'mockProfileData' to resolve naming conflict
import { Profile as mockProfileData } from '../data/mockData';

const Profile = () => {
  // Initialize state with data from mockProfileData (your updated mock data export)
  const [username, setUsername] = useState(mockProfileData.username);
  const [name, setName] = useState(mockProfileData.name);
  const [email, setEmail] = useState(mockProfileData.email);
  const [phone, setPhone] = useState(mockProfileData.phone);
  const [gender, setGender] = useState(mockProfileData.gender);
  const [birthDay, setBirthDay] = useState(mockProfileData.birthDay);
  const [birthMonth, setBirthMonth] = useState(mockProfileData.birthMonth);
  const [birthYear, setBirthYear] = useState(mockProfileData.birthYear);
  const [avatar, setAvatar] = useState(mockProfileData.avatar);

  /**
   * Handles the change event for the avatar file input.
   * Reads the selected image file and sets it as the avatar preview.
   * @param {Event} e - The change event object.
   */
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result); // Set the avatar to the Data URL of the selected image
      };
      reader.readAsDataURL(e.target.files[0]); // Read the file as a Data URL
    }
  };

  /**
   * Handles the save action for the profile.
   * In a real application, this would send updated data to a backend.
   * For this mock example, it just logs the data and shows a toast notification.
   */
  const handleSave = () => {
    // In a real application, you would send this data to a backend (e.g., using axios)
    const updatedProfile = {
      username,
      name,
      email,
      phone,
      gender,
      birthDay,
      birthMonth,
      birthYear,
      avatar,
    };
    console.log("Saving profile:", updatedProfile);
    toast.success("Profile saved successfully!"); // Display a success toast notification
    // You might want to update your mock data or a global state here if needed
  };

  // Calculate current year for birth year dropdown
  const currentYear = new Date().getFullYear();
  // Generate an array of years for the dropdown (e.g., last 100 years)
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  /**
   * Calculates the number of days in a given month for a specific year.
   * @param {string} month - The month number (1-12).
   * @param {string} year - The year.
   * @returns {number} The number of days in that month.
   */
  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

  return (
    <>
      {/* Header component */}
      <Header />
      <div className="min-h-screen bg-gray-100 flex font-inter"> {/* Added font-inter */}
        {/* Sidebar component */}
        <Sidebar />

        {/* Main content area for the profile page */}
        <div className="flex-1 px-3 py-4 md:px-8 md:py-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Profile page title and subtitle */}
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">
              Hồ Sơ Của Tôi
              <p className="text-sm font-normal text-gray-500 mt-1">
                Quản lý thông tin hồ sơ để bảo mật tài khoản
              </p>
            </h2>

            {/* Main content layout: flex container for two columns */}
            <div className="flex flex-col md:flex-row items-start md:space-x-12">
              {/* Left Column: Form Fields */}
              <div className="flex-1 w-full md:w-auto">
                {/* Username field (read-only) */}
                <div className="mb-4 flex flex-col md:flex-row items-start md:items-center">
                  <label className="w-full md:w-32 text-left md:text-right text-gray-600 text-sm mb-1 md:mb-0 mr-4">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={username}
                    readOnly
                    className="flex-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none"
                    aria-label="Username"
                  />
                </div>

                {/* Username change info text */}
                <div className="mb-4 flex flex-col md:flex-row items-start md:items-center">
                  <label className="w-full md:w-32 text-left md:text-right text-gray-600 text-sm mb-1 md:mb-0 mr-4"></label> {/* Empty label for alignment */}
                  <p className="text-sm text-gray-500 flex-1 w-full">
                    Tên đăng nhập chỉ có thể thay đổi một lần.
                  </p>
                </div>

                {/* Name input field */}
                <div className="mb-4 flex flex-col md:flex-row items-start md:items-center">
                  <label htmlFor="name" className="w-full md:w-32 text-left md:text-right text-gray-600 text-sm mb-1 md:mb-0 mr-4">Tên</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    aria-label="Name"
                  />
                </div>

                {/* Email field with 'Thay Đổi' button */}
                <div className="mb-4 flex flex-col md:flex-row items-start md:items-center">
                  <label htmlFor="email" className="w-full md:w-32 text-left md:text-right text-gray-600 text-sm mb-1 md:mb-0 mr-4">Email</label>
                  <div className="flex-1 w-full flex items-center">
                    <input
                      type="text"
                      id="email"
                      value={email}
                      readOnly
                      className="border border-gray-300 rounded-l px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 flex-grow focus:outline-none"
                      aria-label="Email address"
                    />
                    <button className="bg-white border-t border-b border-r border-gray-300 rounded-r text-orange-500 px-4 py-2 hover:bg-gray-50 text-sm transition-colors">
                      Thay Đổi
                    </button>
                  </div>
                </div>

                {/* Phone field with 'Thay Đổi' button */}
                <div className="mb-4 flex flex-col md:flex-row items-start md:items-center">
                  <label htmlFor="phone" className="w-full md:w-32 text-left md:text-right text-gray-600 text-sm mb-1 md:mb-0 mr-4">Số điện thoại</label>
                  <div className="flex-1 w-full flex items-center">
                    <input
                      type="text"
                      id="phone"
                      value={phone}
                      readOnly
                      className="border border-gray-300 rounded-l px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 flex-grow focus:outline-none"
                      aria-label="Phone number"
                    />
                    <button className="bg-white border-t border-b border-r border-gray-300 rounded-r text-orange-500 px-4 py-2 hover:bg-gray-50 text-sm transition-colors">
                      Thay Đổi
                    </button>
                  </div>
                </div>

                {/* Gender radio buttons */}
                <div className="mb-4 flex flex-col md:flex-row items-start md:items-center">
                  <label className="w-full md:w-32 text-left md:text-right text-gray-600 text-sm mb-1 md:mb-0 mr-4">Giới tính</label>
                  <div className="flex-1 w-full flex items-center space-x-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        name="gender"
                        value="Nam"
                        checked={gender === "Nam"}
                        onChange={() => setGender("Nam")}
                      />
                      <span className="ml-2 text-sm text-gray-700">Nam</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        name="gender"
                        value="Nữ"
                        checked={gender === "Nữ"}
                        onChange={() => setGender("Nữ")}
                      />
                      <span className="ml-2 text-sm text-gray-700">Nữ</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        name="gender"
                        value="Khác"
                        checked={gender === "Khác"}
                        onChange={() => setGender("Khác")}
                      />
                      <span className="ml-2 text-sm text-gray-700">Khác</span>
                    </label>
                  </div>
                </div>

                {/* Birth date selectors */}
                <div className="mb-6 flex flex-col md:flex-row items-start md:items-center">
                  <label className="w-full md:w-32 text-left md:text-right text-gray-600 text-sm mb-1 md:mb-0 mr-4">Ngày sinh</label>
                  <div className="flex-1 w-full flex space-x-2">
                    <select
                      className="border border-gray-300 rounded px-3 py-2 flex-1 text-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      aria-label="Birth day"
                    >
                      {/* Dynamically generate days based on selected month and year */}
                      {Array.from({ length: daysInMonth(birthMonth, birthYear) }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <select
                      className="border border-gray-300 rounded px-3 py-2 flex-1 text-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      aria-label="Birth month"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      className="border border-gray-300 rounded px-3 py-2 flex-1 text-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      aria-label="Birth year"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end md:justify-start mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-orange-500 text-white px-8 py-2 rounded-sm hover:bg-orange-600 transition-colors shadow-md"
                  >
                    Lưu
                  </button>
                </div>
              </div>

              {/* Right Column: Avatar Upload Section */}
              <div className="w-full md:w-64 flex flex-col items-center mt-8 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 md:pl-12">
                {/* Avatar display */}
                <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center mb-4">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    // Fallback for broken images if any
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/e0e0e0/ffffff?text=Avatar"; }}
                  />
                </div>
                {/* Hidden file input for avatar upload */}
                <input
                  type="file"
                  id="avatarUpload"
                  className="hidden"
                  accept="image/jpeg,image/png"
                  onChange={handleAvatarChange}
                />
                {/* Custom label/button to trigger file input */}
                <label
                  htmlFor="avatarUpload"
                  className="cursor-pointer border border-gray-300 text-gray-700 px-6 py-2 rounded-sm hover:bg-gray-50 transition-colors text-sm shadow-sm"
                >
                  Chọn Ảnh
                </label>
                {/* File size and format information */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Dung lượng file tối đa 1 MB <br />
                  Định dạng: JPEG, PNG
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer component */}
      <Footer />
    </>
  );
};

export default Profile;
    