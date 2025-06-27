// src/seller/ManageProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Hàm để fetch sản phẩm từ API
  const fetchProducts = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem sản phẩm.');
        setLoading(false);
        return;
      }

      // Giả sử bạn đã tạo endpoint GET /api/seller/products trong Laravel
      // để lấy danh sách sản phẩm của người bán đang đăng nhập.
      const response = await axios.get('http://localhost:8000/api/seller/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data);
      setLoading(false);
    } catch (apiError) {
      console.error('Lỗi khi tải sản phẩm:', apiError.response ? apiError.response.data : apiError.message);
      setError(apiError.response?.data?.message || 'Có lỗi xảy ra khi tải sản phẩm.');
      setProducts([]); // Xóa sản phẩm nếu có lỗi
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []); // [] đảm bảo chỉ gọi một lần khi mount

  const handleEdit = (id) => {
    alert(`Chức năng Sửa sản phẩm ID: ${id}. Bạn có thể implement modal hoặc trang chỉnh sửa riêng.`);
    // TODO: Chuyển hướng đến trang chỉnh sửa: navigate(`/seller-dashboard/edit-product/${id}`);
    // Hoặc mở modal chỉnh sửa và truyền dữ liệu sản phẩm vào modal đó.
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      return;
    }
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xóa sản phẩm.');
        return;
      }

      await axios.delete(`http://localhost:8000/api/seller/products/${id}`, { // URL API destroy
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage('Xóa sản phẩm thành công!');
      // Cập nhật lại danh sách sản phẩm sau khi xóa thành công mà không cần fetch lại toàn bộ
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (apiError) {
      console.error('Lỗi khi xóa sản phẩm:', apiError.response ? apiError.response.data : apiError.message);
      setError(apiError.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm.');
    }
  };

  // Hàm xử lý chuyển đổi trạng thái (toggle status)
  const handleToggleStatus = async (productId, currentStatus) => {
    setMessage('');
    setError('');
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để cập nhật trạng thái.');
        return;
      }

      // Gửi yêu cầu PATCH/PUT để cập nhật trạng thái
      const response = await axios.put(
        `http://localhost:8000/api/seller/products/${productId}`, // Sử dụng phương thức PUT hoặc PATCH
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message || `Cập nhật trạng thái sản phẩm ID ${productId} thành ${newStatus} thành công!`);

      // Cập nhật trạng thái trong state mà không cần fetch lại toàn bộ danh sách
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? { ...product, status: newStatus } : product
        )
      );
    } catch (apiError) {
      console.error('Lỗi khi cập nhật trạng thái:', apiError.response ? apiError.response.data : apiError.message);
      setError(apiError.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center h-48">
        <p className="text-gray-600">Đang tải sản phẩm...</p>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Danh sách sản phẩm của bạn</h2>

      {message && (
        <div className="p-3 mb-4 rounded-md bg-green-100 text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 mb-4 rounded-md bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {products.length === 0 && !error ? (
        <p className="text-gray-600 text-center">Bạn chưa có sản phẩm nào. Hãy thêm sản phẩm mới!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ảnh</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tồn kho</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục ID</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b border-gray-200">{product.id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-md">No Image</div>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{product.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{formatPrice(product.price)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{product.stock}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{product.category_id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {/* Toggle Switch cho trạng thái */}
                    <label htmlFor={`toggle-status-${product.id}`} className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={`toggle-status-${product.id}`}
                          className="sr-only" // Ẩn checkbox gốc
                          checked={product.status === 'active'}
                          onChange={() => handleToggleStatus(product.id, product.status)}
                        />
                        <div className={`block w-10 h-6 rounded-full ${
                          product.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          product.status === 'active' ? 'translate-x-full' : ''
                        }`}></div>
                      </div>
                      <div className="ml-3 text-gray-700 font-medium">
                        {product.status === 'active' ? 'Active' : 'Inactive'}
                      </div>
                    </label>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Nút "Tải thêm" chỉ có ý nghĩa khi có phân trang từ API */}
      {/* <button className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Tải thêm
      </button> */}
    </section>
  );
}

export default ManageProducts;