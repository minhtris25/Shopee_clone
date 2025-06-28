import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Component EditProduct nhận các props:
// - productId: ID của sản phẩm cần chỉnh sửa
// - onCancel: Hàm được gọi khi người dùng hủy bỏ việc chỉnh sửa
// - onSaveSuccess: Hàm được gọi khi người dùng lưu thành công sản phẩm
function EditProduct({ productId, onCancel, onSaveSuccess }) {
  // State để lưu trữ dữ liệu sản phẩm, danh mục, trạng thái tải, lỗi và thông báo
  const [productData, setProductData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm trợ giúp để xây dựng đường dẫn ảnh chính xác từ path nhận được từ API
  const getImageUrl = (thumbnailPath) => {
    if (!thumbnailPath) return 'https://placehold.co/128x128/ccc/fff?text=No+Image'; // Placeholder nếu không có ảnh
    
    // Loại bỏ '/storage/' hoặc 'storage/' nếu nó đã có sẵn ở đầu (nếu API trả về '/storage/products/...')
    // hoặc giữ nguyên nếu nó là 'products/...'
    let cleanPath = thumbnailPath.replace(/^\/?storage\//, '');
    
    // Xây dựng URL hoàn chỉnh
    return `http://localhost:8000/storage/${cleanPath}`;
  };

  // useEffect để fetch dữ liệu sản phẩm và danh mục khi component được mount hoặc productId thay đổi
  useEffect(() => {
    const fetchProductAndCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
        if (!token) {
          setError('Bạn chưa đăng nhập. Vui lòng đăng nhập.');
          setLoading(false);
          return;
        }

        // Fetch thông tin chi tiết sản phẩm dựa trên productId
        const productResponse = await axios.get(`http://localhost:8000/api/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Gửi token xác thực
          }
        });
        setProductData(productResponse.data); // Cập nhật state productData

        // Fetch danh sách danh mục
        const categoriesResponse = await axios.get('http://localhost:8000/api/home/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCategories(categoriesResponse.data.data); // Lấy phần 'data' từ phản hồi của categories API

      } catch (apiError) {
        // Xử lý lỗi khi tải dữ liệu
        console.error('Lỗi khi tải dữ liệu sản phẩm/danh mục:', apiError.response ? apiError.response.data : apiError.message);
        setError(apiError.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };

    if (productId) { // Chỉ fetch nếu có productId được truyền vào
      fetchProductAndCategories();
    }
  }, [productId]); // Re-run effect khi productId thay đổi

  // Xử lý thay đổi các trường input trong form
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // Nếu là input type="file", lưu trữ đối tượng File
      setProductData(prevData => ({
        ...prevData,
        [name]: files[0] // files[0] là File object đầu tiên được chọn
      }));
    } else {
      // Đối với các input khác, cập nhật giá trị bình thường
      setProductData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Xử lý khi submit form để cập nhật sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setIsSubmitting(true); // Bắt đầu trạng thái submit
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để cập nhật sản phẩm.');
        setIsSubmitting(false);
        return;
      }

      // Tạo FormData để gửi dữ liệu form, bao gồm cả file
      const formData = new FormData();
      for (const key in productData) {
        // Nếu là trường 'thumbnail'
        if (key === 'thumbnail') {
          // Case 1: Một tệp mới đã được chọn để tải lên (là một File object)
          if (productData[key] instanceof File) {
            formData.append(key, productData[key]);
          } 
          // Case 2: Người dùng muốn xóa ảnh hiện tại (giá trị là chuỗi rỗng hoặc null)
          else if (productData[key] === '' || productData[key] === null) {
            formData.append(key, ''); // Gửi chuỗi rỗng để backend xử lý là xóa ảnh
          }
          // Case 3: thumbnail là đường dẫn URL cũ và không có tệp mới được chọn.
          // Trong trường hợp này, KHÔNG gửi trường 'thumbnail' đi để Laravel không validate lại ảnh.
          // Laravel sẽ giữ nguyên ảnh cũ nếu trường 'thumbnail' không có trong request.
        } else {
          // Đối với tất cả các trường khác, thêm chúng vào FormData
          formData.append(key, productData[key]);
        }
      }
      
      // Laravel yêu cầu một trường _method='PUT' khi gửi FormData qua POST để giả lập PUT request
      formData.append('_method', 'PUT'); 

      // Axios sẽ tự động đặt Content-Type là 'multipart/form-data' khi gửi FormData
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Gửi request POST đến endpoint update của seller product
      const response = await axios.post(
        `http://localhost:8000/api/seller/products/${productId}`,
        formData,
        { headers }
      );

      setMessage(response.data.message || 'Cập nhật sản phẩm thành công!');
      onSaveSuccess(); // Gọi hàm callback khi lưu thành công để cập nhật danh sách sản phẩm ở component cha
    } catch (apiError) {
      // Xử lý lỗi khi cập nhật
      console.error('Lỗi khi cập nhật sản phẩm:', apiError.response ? apiError.response.data : apiError.message);
      setError(apiError.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm.');
    } finally {
      setIsSubmitting(false); // Kết thúc trạng thái submit
    }
  };

  // Hiển thị trạng thái tải ban đầu
  if (loading) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center h-48">
        <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
      </section>
    );
  }

  // Hiển thị lỗi nếu có vấn đề khi tải dữ liệu
  if (error) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="p-3 mb-4 rounded-md bg-red-100 text-red-700">
          {error}
        </div>
        <button
          onClick={onCancel} // Nút quay lại
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Quay lại
        </button>
      </section>
    );
  }

  // Hiển thị thông báo nếu không tìm thấy dữ liệu sản phẩm (sau khi tải xong và không có lỗi)
  if (!productData) {
    return (
        <section className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Không tìm thấy thông tin sản phẩm để chỉnh sửa.</p>
            <button
                onClick={onCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-4"
            >
                Quay lại
            </button>
        </section>
    );
  }

  // Render form chỉnh sửa sản phẩm
  return (
    <section className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Chỉnh sửa sản phẩm: {productData.name}</h2>

      {/* Hiển thị thông báo thành công hoặc lỗi */}
      {message && (
        <div className="p-3 mb-4 rounded-md bg-green-100 text-green-700 border border-green-200">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 mb-4 rounded-md bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tên sản phẩm */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Mô tả */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={productData.description || ''}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        {/* Giá */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
          <input
            type="number"
            id="price"
            name="price"
            value={parseFloat(productData.price) || 0} // Đảm bảo là số float
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            min="0" // Giá không âm
          />
        </div>

        {/* Tồn kho */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={parseInt(productData.stock) || 0} // Đảm bảo là số nguyên
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            min="0" // Tồn kho không âm
          />
        </div>

        {/* Ảnh Thumbnail */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
          <input
            type="file" // Sử dụng type="file" để cho phép chọn tệp ảnh
            id="thumbnail"
            name="thumbnail"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-700
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
          {productData.thumbnail && (
            <div className="mt-3 flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Ảnh hiện tại:</span>
              <img 
                src={typeof productData.thumbnail === 'string' ? getImageUrl(productData.thumbnail) : URL.createObjectURL(productData.thumbnail)} 
                alt="Current Thumbnail" 
                className="w-24 h-24 object-cover rounded-md shadow-sm border border-gray-200" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/ccc/fff?text=No+Image'; }}
              />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">Chọn tệp ảnh mới để thay đổi. Để trống nếu không muốn thay đổi ảnh.</p>
        </div>

        {/* Danh mục */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select
            id="category_id"
            name="category_id"
            value={productData.category_id || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Trạng thái */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            id="status"
            name="status"
            value={productData.status || 'inactive'}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm ngưng</option>
          </select>
        </div>

        {/* Nút Submit và Hủy */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật sản phẩm'
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditProduct;
