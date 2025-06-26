import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecommendedProducts } from '../api/product';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchRecommendedProducts()
      .then((res) => {
        setProducts(res.data); // Laravel dùng key "data" cho mảng sản phẩm
        setMeta({
          current_page: res.current_page,
          last_page: res.last_page,
        });
      })
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  }, []);

  const handleViewMore = () => {
    navigate('/product'); // Bạn có thể load page tiếp theo nếu muốn load thêm tại chỗ
  };

  return (
    <div className="bg-[#f5f5f5] p-4">
      <h2 className="text-center text-red-600 font-semibold text-lg mb-4">GỢI Ý HÔM NAY</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow p-2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="text-xs text-red-500 mt-1">{product.label}</div>
            <h3 className="text-sm font-semibold mt-1 truncate">{product.name}</h3>
            <div className="text-red-600 text-base font-bold">
              ₫{Number(product.price).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">{product.sale}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleViewMore}
          className="px-6 py-2 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition"
        >
          Xem thêm
        </button>
      </div>
    </div>
  );
};

export default ProductList;
