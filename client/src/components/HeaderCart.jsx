import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaBell,
  FaQuestionCircle,
  FaShoppingCart,
} from "react-icons/fa";
import { IoMdGlobe } from "react-icons/io";
import { useAuth } from "../context/AuthContext";

const HeaderCart = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white text-sm">
      {/* Top Bar */}
      <div className="bg-[#f53d2d] text-white">
        <div className="flex justify-between items-center px-6 py-2 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link to="/seller" className="hover:underline">
              Kênh Người Bán
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

            {user ? (
              <div className="relative group">
                <span className="hover:underline cursor-pointer">
                  {user.name}
                </span>
                <div className="absolute hidden group-hover:block bg-white text-gray-800 shadow-md rounded-sm py-2 w-40 z-10 top-full left-1/2 -translate-x-1/2 mt-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Trang Cá Nhân
                  </Link>
                  <Link
                    to="/order"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Đơn hàng
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/register" className="hover:underline">
                  Đăng Ký
                </Link>
                <span>|</span>
                <Link to="/login" className="hover:underline">
                  Đăng Nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Middle Bar */}
      <div className="bg-white shadow">
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img src="/Shopee.svg.png" alt="Shopee Logo" className="h-10" />
              <span className="ml-2 text-lg font-semibold text-red-600 mt-3">
                <span className="">|</span>
                Giỏ hàng
              </span>
            </Link>
          </div>

          {/* Optional: search bar hoặc để trống */}
          <div className="w-full max-w-4xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(
                  `/products/search?q=${encodeURIComponent(
                    e.target.search.value
                  )}`
                );
              }}
              className="relative"
            >
              <input
                type="text"
                name="search"
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
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderCart;
