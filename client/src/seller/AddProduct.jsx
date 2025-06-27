// src/seller/AddProduct.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls

function AddProduct() {
  const [productData, setProductData] = useState({
    category_id: '', // Thêm trường category_id
    name: '',
    description: '',
    price: '',
    stock: '',       // Thay đổi từ 'quantity' thành 'stock'
    thumbnail: '',   // Thêm trường thumbnail (URL ảnh)
    status: 'active', // Thêm trường status với giá trị mặc định
  });

  const [message, setMessage] = useState(''); // State để hiển thị thông báo
  const [error, setError] = useState(''); // State để hiển thị lỗi

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Xóa thông báo cũ
    setError('');   // Xóa lỗi cũ

    // Client-side validation: Kiểm tra các trường bắt buộc theo API
    if (!productData.category_id || !productData.name || !productData.price || !productData.stock) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (ID Danh mục, Tên, Giá, Tồn kho).');
      return;
    }

    // Đảm bảo price và stock là số dương
    if (productData.price < 0) {
      setError('Giá sản phẩm không được âm.');
      return;
    }
    if (productData.stock < 0) {
      setError('Số lượng tồn kho không được âm.');
      return;
    }

    try {
      // Lấy token từ localStorage (giả định bạn đã lưu token sau khi đăng nhập)
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để thêm sản phẩm.');
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/seller/products', // URL API của bạn
        {
          ...productData,
          price: parseFloat(productData.price), // Đảm bảo price là số float
          stock: parseInt(productData.stock, 10), // Đảm bảo stock là số nguyên
          category_id: parseInt(productData.category_id, 10) // Đảm bảo category_id là số nguyên
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Gửi token xác thực
          }
        }
      );

      setMessage(response.data.message || 'Thêm sản phẩm thành công!');
      console.log('Sản phẩm đã được thêm:', response.data.product);

      // Reset form sau khi gửi thành công
      setProductData({
        category_id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        thumbnail: '',
        status: 'active',
      });

    } catch (apiError) {
      console.error('Lỗi khi thêm sản phẩm:', apiError.response ? apiError.response.data : apiError.message);
      setError(apiError.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm.');
      // Nếu có lỗi validation từ backend, bạn có thể xử lý chi tiết hơn ở đây
      if (apiError.response && apiError.response.data && apiError.response.data.errors) {
        const validationErrors = apiError.response.data.errors;
        let errorMessage = 'Lỗi nhập liệu: ';
        for (const key in validationErrors) {
          errorMessage += `${validationErrors[key].join(', ')} `;
        }
        setError(errorMessage.trim());
      }
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Thêm sản phẩm mới</h2>

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

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="categoryId" className="block text-gray-700 text-sm font-bold mb-2">ID Danh mục:</label>
          <input
            type="number" // category_id thường là số
            id="categoryId"
            name="category_id"
            value={productData.category_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập ID danh mục (ví dụ: 1)"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">Tên sản phẩm:</label>
          <input
            type="text"
            id="productName"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="productPrice" className="block text-gray-700 text-sm font-bold mb-2">Giá (VNĐ):</label>
          <input
            type="number"
            id="productPrice"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập giá sản phẩm (ví dụ: 499000)"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="productStock" className="block text-gray-700 text-sm font-bold mb-2">Số lượng tồn kho:</label>
          <input
            type="number"
            id="productStock"
            name="stock" // Đổi tên từ 'quantity' sang 'stock'
            value={productData.stock}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập số lượng tồn kho (ví dụ: 100)"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="productThumbnail" className="block text-gray-700 text-sm font-bold mb-2">URL ảnh đại diện (Thumbnail):</label>
          <input
            type="text" // Input type text vì API mong đợi URL
            id="productThumbnail"
            name="thumbnail"
            value={productData.thumbnail}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)"
          />
        </div>
        {productData.thumbnail && ( // Hiển thị preview nếu có URL ảnh
            <div className="mt-4 mb-4">
              <p className="block text-gray-700 text-sm font-bold mb-2">Xem trước ảnh:</p>
              <img
                src={productData.thumbnail}
                alt="Product Preview"
                className="w-32 h-32 object-cover rounded-md border border-gray-200"
              />
            </div>
          )}

        <div className="mb-4">
          <label htmlFor="productStatus" className="block text-gray-700 text-sm font-bold mb-2">Trạng thái:</label>
          <select
            id="productStatus"
            name="status"
            value={productData.status}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="productDescription" className="block text-gray-700 text-sm font-bold mb-2">Mô tả (Tùy chọn):</label>
          <textarea
            id="productDescription"
            name="description"
            rows="4"
            value={productData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Mô tả chi tiết sản phẩm"
          ></textarea>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddProduct;