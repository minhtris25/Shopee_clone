import React from 'react';

function SidebarSeller({ setActiveSection, activeSection }) {
  return (
    // Thay đổi bg-gray-800 thành bg-white và text-white thành text-gray-800 hoặc text-black
    <aside className="w-64 bg-white text-gray-800 p-4 space-y-4 flex-shrink-0 shadow-md"> {/* Thêm shadow-md để tạo sự nổi bật */}
      <div className="text-2xl font-bold mb-6 text-center text-gray-900">Seller Dashboard</div> {/* Có thể đổi màu chữ dashboard */}
      <nav>
        <ul>
          <li>
            <a
              href="#"
              className={`block py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200 ${
                activeSection === 'manageProducts' ? 'bg-orange-500 text-white' : 'text-gray-700' // Màu cam cho mục được chọn, màu xám cho mục không chọn
              }`}
              onClick={() => setActiveSection('manageProducts')}
            >
              Quản lý sản phẩm
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`block py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200 ${
                activeSection === 'addProduct' ? 'bg-orange-500 text-white' : 'text-gray-700' // Màu cam cho mục được chọn, màu xám cho mục không chọn
              }`}
              onClick={() => setActiveSection('addProduct')}
            >
              Thêm sản phẩm
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarSeller;