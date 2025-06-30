import React from "react";
import {
  Bell,
  User,
  CreditCard,
  Ticket,
  CircleDollarSign,
  Tag,
  Pencil,
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const location = useLocation(); // Initialize useLocation hook to get current path

  // Define menu items with their respective paths
  const menu = [
    { label: "Thông Báo", icon: <Bell size={16} />, path: "/notifications" },
    // Added path for "Tài Khoản Của Tôi" to enable navigation
    { label: "Tài Khoản Của Tôi", icon: <User size={16} />, path: "/profile" },
    { label: "Đơn Mua", icon: <CreditCard size={16} />, path: "/order" },
    { label: "Kho Voucher", icon: <Ticket size={16} />, path: "/vouchers" },
    { label: "Shopee Xu", icon: <CircleDollarSign size={16} />, path: "/shopee-coin" },
    { label: "7.7 Sale Hè Freeship", icon: <Tag size={16} />, badge: "New", path: "/77sale" }, // Example path for sale
  ];

  return (
    <div className="w-64 bg-white h-full p-4 hidden md:block font-inter"> {/* Added font-inter */}
      {/* User Info Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
          <User size={20} />
          minh_tris25
        </div>
        {/* 'Sửa Hồ Sơ' button, navigating to /profile */}
        <button
          onClick={() => navigate('/profile')}
          className="text-xs text-gray-500 hover:text-orange-500 flex items-center gap-1 mt-1 ml-4 transition-colors"
        >
          <Pencil size={12} /> Sửa Hồ Sơ
        </button>
      </div>

      {/* Navigation Menu */}
      <ul className="space-y-3 text-sm text-gray-700">
        {menu.map((item, i) => (
          <li
            key={i}
            // Add onClick handler to navigate to the item's path
            onClick={() => navigate(item.path)}
            // Conditionally apply styling based on the current path
            className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition-colors
              ${location.pathname === item.path ? "text-orange-500 font-semibold bg-gray-50" : ""}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
