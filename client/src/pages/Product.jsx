// src/pages/ProductListingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SidebarProduct from '../components/SidebarProduct';
import { fetchRecommendedProducts } from '../api/product';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]); // Lưu toàn bộ sản phẩm khi API trả về mảng

  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 16,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('lienQuan');

  // Gọi API khi currentPage hoặc sortBy thay đổi
  useEffect(() => {
    setLoading(true);
    setError(null);

    const apiParams = {
      page: currentPage,
      sort_by: sortBy,
      per_page: meta.per_page,
    };

    console.log('API Params sent:', apiParams);

    fetchRecommendedProducts(apiParams)
      .then((res) => {
        if (res && res.data) {
          // API trả về dữ liệu phân trang
          setProducts(res.data);
          setMeta({
            current_page: res.current_page || 1,
            last_page: res.last_page || 1,
            total: res.total || 0,
            per_page: res.per_page || 16,
          });
          setAllProducts([]); // Không cần lưu toàn bộ sản phẩm
        } else if (Array.isArray(res)) {
          // API trả về mảng, xử lý sắp xếp và phân trang phía client
          let sortedProducts = [...res];
          if (sortBy === 'price_asc') {
            sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          } else if (sortBy === 'price_desc') {
            sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(b.price));
          } else if (sortBy === 'moiNhat') {
            sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          } else if (sortBy === 'banChay') {
            sortedProducts.sort((a, b) => b.sold - a.sold);
          }
          const start = (currentPage - 1) * meta.per_page;
          const end = start + meta.per_page;
          const paginatedProducts = sortedProducts.slice(start, end);
          setAllProducts(sortedProducts); // Lưu toàn bộ sản phẩm
          setProducts(paginatedProducts);
          setMeta((prevMeta) => ({
            current_page: currentPage,
            last_page: Math.ceil(sortedProducts.length / prevMeta.per_page),
            total: sortedProducts.length,
            per_page: prevMeta.per_page,
          }));
        } else {
          console.warn('Cấu trúc dữ liệu API không như mong đợi:', res);
          setProducts([]);
          setMeta((prevMeta) => ({
            current_page: 1,
            last_page: 1,
            total: 0,
            per_page: prevMeta.per_page,
          }));
          setAllProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
        setProducts([]);
        setMeta((prevMeta) => ({
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: prevMeta.per_page,
        }));
        setAllProducts([]);
      });
  }, [currentPage, sortBy]);

  const totalPages = meta.last_page;

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= meta.last_page) {
      if (allProducts.length > 0) {
        // Phân trang phía client nếu có allProducts
        const start = (pageNumber - 1) * meta.per_page;
        const end = start + meta.per_page;
        setProducts(allProducts.slice(start, end));
        setCurrentPage(pageNumber);
        setMeta((prevMeta) => ({
          ...prevMeta,
          current_page: pageNumber,
        }));
      } else {
        // Gọi API nếu không có allProducts (phân trang phía server)
        setCurrentPage(pageNumber);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSortChange = (criteria) => {
    setSortBy(criteria);
    setCurrentPage(1);
    if (allProducts.length > 0) {
      // Sắp xếp lại allProducts nếu có
      let sortedProducts = [...allProducts];
      if (criteria === 'price_asc') {
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (criteria === 'price_desc') {
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (criteria === 'moiNhat') {
        sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (criteria === 'banChay') {
        sortedProducts.sort((a, b) => b.sold - a.sold);
      }
      const start = 0;
      const end = meta.per_page;
      setAllProducts(sortedProducts);
      setProducts(sortedProducts.slice(start, end));
      setMeta((prevMeta) => ({
        ...prevMeta,
        current_page: 1,
        last_page: Math.ceil(sortedProducts.length / prevMeta.per_page),
        total: sortedProducts.length,
      }));
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 flex justify-center items-center h-96">
          <p>Đang tải sản phẩm...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 flex justify-center items-center h-96 text-red-500">
          <p>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 flex">
        <div className="w-1/5 pr-4">
          <SidebarProduct />
        </div>
        <div className="w-4/5">
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Sắp xếp theo</span>
              <button
                className={`px-4 py-2 rounded-sm text-sm ${
                  sortBy === 'lienQuan' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() => handleSortChange('lienQuan')}
              >
                Liên Quan
              </button>
              <button
                className={`px-4 py-2 rounded-sm text-sm ${
                  sortBy === 'moiNhat' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() => handleSortChange('moiNhat')}
              >
                Mới Nhất
              </button>
              <button
                className={`px-4 py-2 rounded-sm text-sm ${
                  sortBy === 'banChay' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() => handleSortChange('banChay')}
              >
                Bán Chạy
              </button>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-sm text-sm cursor-pointer"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="lienQuan">Liên Quan</option>
                  <option value="moiNhat">Mới Nhất</option>
                  <option value="banChay">Bán Chạy</option>
                  <option value="price_asc">Giá: Từ thấp đến cao</option>
                  <option value="price_desc">Giá: Từ cao đến thấp</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Tổng: {meta.total} sản phẩm</span>
              <span className="text-orange-500">{meta.current_page}</span>
              <span className="text-gray-600">/</span>
              <span className="text-gray-600">{totalPages}</span>
              <button
                className={`ml-2 p-1 border rounded ${
                  meta.current_page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'
                }`}
                onClick={() => handlePageChange(meta.current_page - 1)}
                disabled={meta.current_page === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className={`p-1 border rounded ${
                  meta.current_page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'
                }`}
                onClick={() => handlePageChange(meta.current_page + 1)}
                disabled={meta.current_page === totalPages}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-white shadow p-2">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.thumbnail} alt={product.name} className="w-full h-40 object-cover" />
                  </Link>
                  <h3 className="text-sm font-semibold mt-1 truncate">{product.name}</h3>
                  <div className="text-red-600 text-base font-bold">
                    ₫{Number(product.price).toLocaleString('vi-VN')}
                  </div>
                  <div className="text-xs text-gray-500">{product.sold} đã bán</div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
            )}
          </div>

          {meta.last_page > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                className={`px-3 py-1 border rounded ${
                  meta.current_page === 1 ? 'text-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(meta.current_page - 1)}
                disabled={meta.current_page === 1}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    meta.current_page === i + 1 ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={`px-3 py-1 border rounded ${
                  meta.current_page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(meta.current_page + 1)}
                disabled={meta.current_page === totalPages}
              >
                Tiếp
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductListingPage;