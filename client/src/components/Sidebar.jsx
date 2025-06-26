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

const Sidebar = () => {
  const menu = [
    { label: "Thông Báo", icon: <Bell size={16} /> },
    { label: "Tài Khoản Của Tôi", icon: <User size={16} /> },
    { label: "Đơn Mua", icon: <CreditCard size={16} />, active: true },
    { label: "Kho Voucher", icon: <Ticket size={16} /> },
    { label: "Shopee Xu", icon: <CircleDollarSign size={16} /> },
    { label: "7.7 Sale Hè Freeship", icon: <Tag size={16} />, badge: "New" },
  ];

  return (
    <div className="w-64 bg-white  h-full p-4 hidden md:block">
      {/* Thông tin user */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
          <User size={20} />
          minh_tris25
        </div>
        <button className="text-xs text-gray-500 hover:text-blue-500 flex items-center gap-1 mt-1 ml-4">
          <Pencil size={12} /> Sửa Hồ Sơ
        </button>
      </div>

      {/* Menu */}
      <ul className="space-y-3 text-sm text-gray-700">
        {menu.map((item, i) => (
          <li
            key={i}
            className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${
              item.active ? "text-orange-500 font-semibold" : ""
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
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
