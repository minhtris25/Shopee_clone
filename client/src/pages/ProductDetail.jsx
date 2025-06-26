import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { products, vouchers } from "../data/mockData";
import { AiFillStar, AiOutlineStar } from "react-icons/ai"; // Cần cài react-icons
import { FaTruck, FaShieldAlt } from "react-icons/fa";

const ProductDetail = () => {
  const product = products[0]; // Lấy tạm 1 sản phẩm mẫu
  const [quantity, setQuantity] = useState(1);

  // Dữ liệu đánh giá ảo
  const fakeRating = 4.5;
  const fakeReviewCount = 1200;
  const fakeSoldCount = 2500;

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-6 bg-white mt-6 rounded shadow">
          {/* PHẦN TRÊN */}
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
            {/* Hình ảnh sản phẩm */}
            <div className="md:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded"
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-xl font-bold text-gray-800">{product.name}</h1>

              {/* Đánh giá ảo */}
              <div className="flex items-center text-sm text-gray-600 space-x-2">
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < Math.floor(fakeRating) ? (
                      <AiFillStar key={i} />
                    ) : (
                      <AiOutlineStar key={i} />
                    )
                  )}
                </div>
                <span>{fakeRating} | {fakeReviewCount.toLocaleString()} đánh giá</span>
                <span className="text-gray-400">•</span>
                <span>Đã bán {fakeSoldCount.toLocaleString()}</span>
              </div>

              <div className="text-2xl text-red-600 font-semibold">
                ₫{product.price.toLocaleString()}
              </div>

              {/* Voucher */}
              <div className="flex items-center space-x-2">
                <span className="w-32 text-gray-500">Voucher Của Shop</span>
                <div className="flex flex-wrap gap-2">
                  {vouchers.slice(0, 4).map((voucher) => (
                    <span
                      key={voucher.id}
                      className="bg-red-100 text-red-500 px-2 py-1 rounded text-xs"
                    >
                      {voucher.label}
                    </span>
                  ))}
                  <span className="text-red-600 text-xs cursor-pointer">Xem tất cả ▾</span>
                </div>
              </div>

              {/* Vận chuyển */}
              <div className="flex items-start space-x-2 mt-4 text-sm text-gray-700">
                <span className="w-32 text-gray-500">Vận Chuyển</span>
                <div>
                  <p className="flex items-center gap-1">
                    <FaTruck className="text-green-500" />
                    Nhận từ <strong>28 Th06 - 1 Th07</strong>, phí giao <strong>₫0</strong>
                    <span className="ml-1 text-blue-500 cursor-pointer">›</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tặng Voucher ₫15.000 nếu đơn giao sau thời gian trên.
                  </p>
                </div>
              </div>

              {/* An Tâm Mua Sắm */}
              <div className="flex items-start space-x-2 mt-2 text-sm text-gray-700">
                <span className="w-32 text-gray-500">An Tâm Mua Sắm</span>
                <div className="flex items-start gap-2">
                  <FaShieldAlt className="text-red-500 mt-1" />
                  <p>
                    Trả hàng miễn phí 15 ngày · Chính hãng 100% · Miễn phí vận chuyển · Bảo vệ người mua
                  </p>
                </div>
              </div>

              {/* Chọn số lượng */}
              <div className="flex items-center space-x-4">
                <span className="text-sm">Số lượng:</span>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  +
                </button>
              </div>

              {/* Nút thêm vào giỏ và mua ngay */}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border border-[#F53D2D] text-[#F53D2D] hover:bg-[#fff5f2] font-semibold py-2 rounded"
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={() => alert("Chuyển đến trang thanh toán")}
                  className="flex-1 bg-[#F53D2D] hover:bg-[#e33326] text-white font-semibold py-2 rounded"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN DƯỚI: Chi tiết & Gợi ý */}
        <div className="max-w-6xl mx-auto px-4 py-6 bg-white mt-6 rounded shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Chi tiết sản phẩm</h2>
          <div className="text-sm text-gray-700">
            <p><strong>Danh mục:</strong> {product.category || "Thời trang"}</p>
            <p><strong>Số lượng trong kho:</strong> {product.stock || 100}</p>
          </div>

          <div>
            <h3 className="font-semibold mt-4 mb-2">Mô tả sản phẩm</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description || "Đây là mô tả chi tiết của sản phẩm. Có thể cập nhật mô tả tại file mockData.js"}
            </p>
          </div>
        </div>

        {/* GỢI Ý SẢN PHẨM */}
        <div className="max-w-6xl mx-auto px-4 py-6 bg-white mt-6 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm gợi ý</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.slice(1, 7).map((item) => (
              <div key={item.id} className="bg-white rounded shadow p-2">
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded" />
                <div className="text-sm font-semibold mt-1 truncate">{item.name}</div>
                <div className="text-red-600 font-bold text-sm">₫{item.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
