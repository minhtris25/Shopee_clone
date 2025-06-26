import React from 'react';

const SidebarProduct = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h2 className="font-semibold text-lg mb-4">BỘ LỌC TÌM KIẾM</h2>

      {/* Nơi Bán */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">Nơi Bán</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Hà Nội</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">TP. Hồ Chí Minh</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Hưng Yên</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Bắc Ninh</span>
            </label>
          </li>
          {/* Add more locations as needed */}
          <li>
            {/* Đây chỉ là nút "Thêm", bạn có thể triển khai logic mở rộng danh sách tại đây */}
            <button className="text-orange-500 text-xs mt-2">Thêm <i className="fas fa-chevron-down ml-1"></i></button>
          </li>
        </ul>
      </div>

      {/* Đơn Vị Vận Chuyển */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">Đơn Vị Vận Chuyển</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Nhanh</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Tiết kiệm</span>
            </label>
          </li>
        </ul>
      </div>

      {/* Thương Hiệu */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">Thương Hiệu</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Mucho</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">MSoul</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Teelab</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">BYCAMCAM</span>
            </label>
          </li>
          {/* Add more brands as needed */}
          <li>
            <button className="text-orange-500 text-xs mt-2">Thêm <i className="fas fa-chevron-down ml-1"></i></button>
          </li>
        </ul>
      </div>

      {/* Đánh giá (theo sao) */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">Đánh Giá</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {[5, 4, 3, 2, 1].map((starCount) => (
            <li key={starCount}>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="rating" className="form-radio text-orange-500" />
                <span className="ml-2 flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < starCount ? 'text-orange-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  {starCount < 5 && <span className="ml-1">trở lên</span>}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Dịch vụ */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">Dịch Vụ</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Freeship XTRA</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Hoàn Xu XTRA</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">NowShip</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Hàng Quốc Tế</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Giao Hàng Nhanh</span>
            </label>
          </li>
          {/* Add more services as needed */}
        </ul>
      </div>

      {/* Khuyến mãi */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">Khuyến Mãi</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Mã giảm giá</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Flash Sale</span>
            </label>
          </li>
          <li>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-orange-500 rounded" />
              <span className="ml-2">Mua 1 Tặng 1</span>
            </label>
          </li>
          {/* Add more promotions as needed */}
        </ul>
      </div>

      {/* Nút Xóa tất cả (tùy chọn) */}
      <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold mt-4">
        Xóa tất cả
      </button>
    </div>
  );
};

export default SidebarProduct;