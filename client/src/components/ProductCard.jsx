import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="border border-gray-200 rounded-sm shadow-sm overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow duration-200">
      {product.isFavorite && (
        <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-br-md z-10">
          Yêu thích
        </div>
      )}
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-3">
        <p className="text-gray-500 text-xs mb-1">{product.sellerLocation}</p>
        <h3 className="text-sm font-normal text-gray-800 line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="flex items-baseline mb-2">
          {product.originalPrice && (
            <span className="text-gray-500 text-xs line-through mr-2">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
          <span className="text-orange-500 font-bold text-base">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <div className="flex items-center">
            {/* Simple star rating, you might want a more sophisticated component */}
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-orange-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-xs text-gray-600">({product.reviews})</span>
          </div>
          <span className="text-xs text-gray-600">{product.sold}</span>
        </div>
      </div>
      <div className="p-3 bg-orange-100 text-orange-500 text-center text-xs font-semibold">
        {product.discount ? `${product.discount} GIẢM` : 'Freeship XTRA'} {/* Bạn có thể tùy chỉnh label này */}
      </div>
    </div>
  );
};

export default ProductCard;