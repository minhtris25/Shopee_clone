import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { products } from "../data/mockData";

const ProductDetail = () => {
  const product = products[0]; // Lấy tạm 1 sản phẩm mẫu
  const [quantity, setQuantity] = useState(1);

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
              <div className="text-2xl text-red-600 font-semibold">
                ₫{product.price.toLocaleString()}
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

              {/* Nút thêm vào giỏ */}
              <button
                onClick={handleAddToCart}
                className="mt-4 w-full bg-[#F53D2D] hover:bg-[#F53D2D] text-white font-semibold py-2 rounded"
              >
                Thêm vào giỏ hàng
              </button>
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
