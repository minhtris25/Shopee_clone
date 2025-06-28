import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaBell,
  FaQuestionCircle,
  FaShoppingCart,
} from "react-icons/fa";
import { IoMdGlobe } from "react-icons/io";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Tính tổng số sản phẩm trong giỏ hàng
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  return (
    <header className="bg-[#f53d2d] text-white text-sm">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-2 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link to="/seller" className="hover:underline">Kênh Người Bán</Link>
          <Link to="/app" className="hover:underline">Tải ứng dụng</Link>
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
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"></span>
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
              <Link to="/profile" className="hover:underline cursor-pointer">
                {user.name}
              </Link>
              <div className="absolute hidden group-hover:block bg-white text-gray-800 shadow-md rounded-sm py-2 w-40 z-10 top-full left-1/2 -translate-x-1/2 mt-2">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Trang Cá Nhân
                </Link>
                <Link to="/order" className="block px-4 py-2 hover:bg-gray-100">
                  Đơn hàng
                </Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/register" className="hover:underline">Đăng Ký</Link>
              <span>|</span>
              <Link to="/login" className="hover:underline">Đăng Nhập</Link>
            </>
          )}
        </div>
      </div>

      {/* Middle Search Bar */}
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img src="/Shopee_logo.png" alt="Shopee Logo" className="h-10" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Shopee bảo ship 0Đ - Đăng ký ngay!"
              className="w-full px-4 py-2 pr-10 rounded-sm focus:outline-none text-gray-900 bg-white"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-3 bg-orange-600 text-white rounded-r-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Cart */}
        <button
          onClick={() => {
            if (!user) {
              navigate("/login");
            } else {
              navigate("/cart");
            }
          }}
          className="relative flex items-center"
        >
          <FaShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Bottom Categories */}
      <nav className="bg-orange-600 px-6 py-1 max-w-4xl mx-auto">
        <div className="flex space-x-4 overflow-x-auto text-xs">
          <Link to="/category/aophongdep" className="hover:underline whitespace-nowrap">Áo Phông Đẹp</Link>
          <Link to="/category/setdohottrend" className="hover:underline whitespace-nowrap">Set Đồ Hot Trend 2025</Link>
          <Link to="/category/sonbongchinhhang" className="hover:underline whitespace-nowrap">Son Bóng Chính Hãng</Link>
          <Link to="/category/ghenoidura" className="hover:underline whitespace-nowrap">Ghế Ngồi Dura</Link>
          <Link to="/category/dodaban1k" className="hover:underline whitespace-nowrap">Đồ Đá Banh 1k</Link>
          <Link to="/category/bonguke" className="hover:underline whitespace-nowrap">Bộ Ngủ Kẻ</Link>
          <Link to="/category/babyteeomeo" className="hover:underline whitespace-nowrap">Baby Tee Ôm Eo</Link>
          <Link to="/category/quanzin" className="hover:underline whitespace-nowrap">Quần Zin</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
