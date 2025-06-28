import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SidebarProduct from '../components/SidebarProduct';
import { searchProducts } from '../api/product';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery();
  const keyword = query.get('q') || '';

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 16 });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('lienQuan');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await searchProducts(keyword);

        if (res?.data?.success && Array.isArray(res.data.data)) {
          let sorted = [...res.data.data];

          if (sortBy === 'price_asc') {
            sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          } else if (sortBy === 'price_desc') {
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          } else if (sortBy === 'moiNhat') {
            sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          } else if (sortBy === 'banChay') {
            sorted.sort((a, b) => b.sold - a.sold);
          }

          setAllProducts(sorted);

          const start = (currentPage - 1) * meta.per_page;
          const end = start + meta.per_page;
          const paginated = sorted.slice(start, end);

          setProducts(paginated);
          setMeta((prev) => ({
            ...prev,
            current_page: currentPage,
            last_page: Math.ceil(sorted.length / prev.per_page),
            total: sorted.length,
          }));
        } else {
          setProducts([]);
          setMeta((prev) => ({
            ...prev,
            current_page: 1,
            last_page: 1,
            total: 0,
          }));
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải kết quả tìm kiếm.');
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchData();
    }
  }, [keyword, currentPage, sortBy]);

  const totalPages = meta.last_page;

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      const start = (pageNumber - 1) * meta.per_page;
      const end = start + meta.per_page;
      setProducts(allProducts.slice(start, end));
      setMeta((prev) => ({ ...prev, current_page: pageNumber }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSortChange = (criteria) => {
    setSortBy(criteria);
    setCurrentPage(1);
  };

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
              {['lienQuan', 'moiNhat', 'banChay'].map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-sm text-sm ${
                    sortBy === type
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                  onClick={() => handleSortChange(type)}
                >
                  {type === 'lienQuan'
                    ? 'Liên Quan'
                    : type === 'moiNhat'
                    ? 'Mới Nhất'
                    : 'Bán Chạy'}
                </button>
              ))}
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
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Kết quả: {meta.total}</span>
              <span className="text-orange-500">{meta.current_page}</span>
              <span className="text-gray-600">/ {totalPages}</span>
              <button
                className={`ml-2 p-1 border rounded ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className={`p-1 border rounded ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <p className="col-span-full text-center">Đang tải...</p>
            ) : products.length > 0 ? (
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
              <p className="col-span-full text-center text-gray-500">
                Không tìm thấy sản phẩm nào phù hợp.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                className={`px-3 py-1 border rounded ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default SearchResults;
