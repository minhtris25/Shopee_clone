import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddProduct() {
  const [productData, setProductData] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    // thumbnail: '', // Không cần lưu URL ảnh trực tiếp trong state nữa
    status: 'active',
  });

  const [selectedFile, setSelectedFile] = useState(null); // State mới để lưu trữ file được chọn
  const [filePreview, setFilePreview] = useState(''); // State để hiển thị ảnh preview

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/home/categories');
        setCategories(response.data.data);
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err.response ? err.response.data : err.message);
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError('');
    setMessage('');
  };

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Lấy file đầu tiên được chọn
    setSelectedFile(file); // Lưu file vào state
    setError('');
    setMessage('');

    if (file) {
      // Tạo URL tạm thời để hiển thị preview
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!productData.category_id || !productData.name || !productData.price || !productData.stock) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (Tên, Giá, Tồn kho, Danh mục).');
      return;
    }

    if (parseFloat(productData.price) < 0) {
      setError('Giá sản phẩm không được âm.');
      return;
    }
    if (parseInt(productData.stock, 10) < 0) {
      setError('Số lượng tồn kho không được âm.');
      return;
    }

    if (!selectedFile) {
        setError('Vui lòng chọn ảnh đại diện sản phẩm.');
        return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để thêm sản phẩm.');
        return;
      }

      // Tạo FormData để gửi file và các dữ liệu khác
      const formData = new FormData();
      formData.append('category_id', parseInt(productData.category_id, 10));
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', parseFloat(productData.price));
      formData.append('stock', parseInt(productData.stock, 10));
      formData.append('status', productData.status);
      formData.append('thumbnail', selectedFile); // Gắn file ảnh vào FormData

      const response = await axios.post(
        'http://localhost:8000/api/seller/products',
        formData, // Gửi FormData thay vì JSON
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Rất quan trọng khi gửi file
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || 'Thêm sản phẩm thành công!');
      console.log('Sản phẩm đã được thêm:', response.data.product);

      // Reset form và file sau khi gửi thành công
      setProductData({
        category_id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        status: 'active',
      });
      setSelectedFile(null);
      setFilePreview('');
      // Xóa giá trị input type="file" (cần truy cập DOM hoặc reset form hoàn toàn)
      document.getElementById('productThumbnail').value = '';

    } catch (apiError) {
      console.error('Lỗi khi thêm sản phẩm:', apiError.response ? apiError.response.data : apiError.message);
      setError(apiError.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm.');
      if (apiError.response && apiError.response.data && apiErrorError.response.data.errors) {
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
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập số lượng tồn kho (ví dụ: 100)"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="categoryId" className="block text-gray-700 text-sm font-bold mb-2">Danh mục:</label>
          <select
            id="categoryId"
            name="category_id"
            value={productData.category_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Thay đổi ở đây: Input type="file" */}
        <div className="mb-4">
          <label htmlFor="productThumbnail" className="block text-gray-700 text-sm font-bold mb-2">Ảnh đại diện (Thumbnail):</label>
          <input
            type="file" // Đổi type thành 'file'
            id="productThumbnail"
            name="thumbnail"
            accept="image/*" // Chỉ cho phép chọn file ảnh
            onChange={handleFileChange} // Xử lý file riêng
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required // Đảm bảo người dùng chọn ảnh
          />
        </div>
        {filePreview && ( // Hiển thị preview nếu có file được chọn
          <div className="mt-4 mb-4">
            <p className="block text-gray-700 text-sm font-bold mb-2">Xem trước ảnh:</p>
            <img
              src={filePreview}
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