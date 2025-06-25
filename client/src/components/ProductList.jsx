import {products} from "../data/mockData.js";

const ProductList = () => {
  return (
    <div className="bg-[#f5f5f5] p-4">
      <h2 className="text-center text-red-600 font-semibold text-lg mb-4">GỢI Ý HÔM NAY</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded shadow p-2">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
            <div className="text-xs text-red-500 mt-1">{product.label}</div>
            <h3 className="text-sm font-semibold mt-1 truncate">{product.name}</h3>
            <div className="text-red-600 text-base font-bold">₫{product.price.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{product.sale}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
