import React from "react";
import { Link } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa"; // Import FaQuestionCircle cho icon hỗ trợ

const Header = () => {
  return (
    <header className="bg-white text-sm">
      <div className="bg-white shadow">
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          {/* Logo bên trái */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/Shopee.svg.png" alt="Shopee Logo" className="h-10" />
            </Link>
          </div>

          {/* Bạn cần hỗ trợ? màu cam bên phải */}
          <div className="flex items-center">
            <Link 
              to="/help" 
              className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 transition-colors duration-200"
            >
              <FaQuestionCircle />
              <span>Bạn cần hỗ trợ?</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;