import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaBell,
  FaQuestionCircle,
  FaShoppingCart,
} from "react-icons/fa";
import { IoMdGlobe } from "react-icons/io";

const Header = () => {
  return (
    <header className="bg-white text-white text-sm">
      {/* Top Bar */}
      <div className="bg-[#f53d2d]">
        <div className="flex justify-between items-center px-6 py-2 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link to="/seller" className="hover:underline">
              Kênh Người Bán
            </Link>
            <Link to="/become-seller" className="hover:underline">
              Trở thành Người bán Shopee
            </Link>
            <Link to="/app" className="hover:underline">
              Tải ứng dụng
            </Link>
            <span className="flex items-center space-x-1">
              <span>Kết nối</span>
              <FaFacebookF className="inline-block" />
              <FaInstagram className="inline-block" />
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="flex items-center space-x-1 hover:underline">
                <FaBell />
                <span>Thông Báo</span>
              </span>
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                ?
              </span>
            </div>
            <span className="flex items-center space-x-1 hover:underline">
              <FaQuestionCircle />
              <span>Hỗ trợ</span>
            </span>
            <span className="flex items-center space-x-1 hover:underline">
              <IoMdGlobe />
              <span>Tiếng Việt</span>
            </span>
            <Link to="/register" className="hover:underline">
              Đăng Ký
            </Link>
            <span>|</span>
            <Link to="/login" className="hover:underline">
              Đăng Nhập
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Search Bar */}
      <div className="bg-white shadow">
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          {/* Logo and Promo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img src="/Shopee.svg.png" alt="Shopee Logo" className="h-10" />
              <span className="ml-2 text-lg font-semibold text-red-600 mt-3">
                <span className="">|</span>
                Giỏ hàng
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-grow md:mx-20">
            <div className="relative">
              <input
                type="text"
                placeholder="Shopee bảo ship 0Đ - Đăng ký ngay!"
                className="w-full px-4 py-2 rounded-l-sm focus:outline-none text-gray-900 bg-white border border-gray-300"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 bg-orange-600 text-white rounded-r-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
