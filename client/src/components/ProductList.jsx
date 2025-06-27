import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecommendedProducts } from '../api/product';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [meta, setMeta] = useState({}); // Initialize as an empty object

  useEffect(() => {
    fetchRecommendedProducts()
      .then((res) => {
        // Log the full response to the console to inspect its structure
        console.log("API Response:", res);

        // Check if res.data exists and is an array before setting
        if (res && res.data && Array.isArray(res.data)) {
          setProducts(res.data); // Products array is typically in 'data' key
        } else {
          console.error("API response 'data' is not an array or is missing:", res);
          setProducts([]); // Ensure products is always an array
        }

        // Set meta if available, assuming it's directly in 'res.meta'
        if (res && res.meta) {
          setMeta({
            current_page: res.meta.current_page,
            last_page: res.meta.last_page,
            // Add other meta properties if needed
          });
        } else {
          console.warn("API response 'meta' is missing:", res);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API fetchRecommendedProducts:", err);
        setProducts([]); // Ensure products is reset to an empty array on error
        setMeta({}); // Reset meta on error
      });
  }, []);

  const handleViewMore = () => {
    navigate('/product'); // Navigates to a full product listing page
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigates to the product detail page
  };

  return (
    <div className="bg-[#f5f5f5] p-4">
      <h2 className="text-center text-red-600 font-semibold text-lg mb-4">GỢI Ý HÔM NAY</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
        {/* Safely map over products, it will be an empty array initially or on error */}
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow p-2 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleProductClick(product.id)}
          >
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