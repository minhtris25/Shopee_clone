import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { vouchers } from "../data/mockData";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaTruck, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:8000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setLoading(false);
      });
  }, [id]);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // 1. Kiểm tra đăng nhập
    if (!user) {
      navigate("/login");
      return;
    }

    // 2. Lấy giỏ hàng hiện tại
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // 3. Tìm xem sản phẩm đã có trong giỏ chưa
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      // Nếu đã có, tăng số lượng
      cart[existingIndex].quantity += quantity;
    } else {
      // Nếu chưa có, thêm mới
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: quantity,
        thumbnail: product.thumbnail,
      });
    }

    // 4. Cập nhật localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // 5. Thông báo
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const fakeRating = 4.5;
  const fakeReviewCount = 1200;

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-20">Đang tải sản phẩm...</div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="text-center py-20 text-red-500">
          Không tìm thấy sản phẩm
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-6 bg-white mt-6 rounded shadow">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
            <div className="md:w-1/2">
              <img
                src={product.thumbnail || "/assets/no-image.png"}
                alt={product.name}
                className="w-full h-auto object-cover rounded"
              />
            </div>
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-xl font-bold text-gray-800">
                {product.name}
              </h1>
              <div className="flex items-center text-sm text-gray-600 space-x-2">
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < Math.floor(fakeRating) ? (
                      <AiFillStar key={i} />
                    ) : (
                      <AiOutlineStar key={i} />
                    )
                  )}
                </div>
                <span>
                  {fakeRating} | {fakeReviewCount.toLocaleString()} đánh giá
                </span>
                <span className="text-gray-400">•</span>
                <span>Đã bán {product.sold || 0}</span>
              </div>
              <div className="text-2xl text-red-600 font-semibold">
                ₫{Number(product.price).toLocaleString("vi-VN")}
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-32 text-gray-500">Voucher Của Shop</span>
                <div className="flex flex-wrap gap-2">
                  {vouchers.slice(0, 4).map((voucher) => (
                    <span
                      key={voucher.id}
                      className="bg-red-100 text-red-500 px-2 py-1 rounded text-xs"
                    >
                      {voucher.label}
                    </span>
                  ))}
                  <span className="text-red-600 text-xs cursor-pointer">
                    Xem tất cả ▾
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-2 mt-4 text-sm text-gray-700">
                <span className="w-32 text-gray-500">Vận Chuyển</span>
                <div>
                  <p className="flex items-center gap-1">
                    <FaTruck className="text-green-500" />
                    Nhận từ <strong>28 Th06 - 1 Th07</strong>, phí giao{" "}
                    <strong>₫0</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tặng Voucher ₫15.000 nếu đơn giao sau thời gian trên.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 mt-2 text-sm text-gray-700">
                <span className="w-32 text-gray-500">An Tâm Mua Sắm</span>
                <div className="flex items-start gap-2">
                  <FaShieldAlt className="text-red-500 mt-1" />
                  <p>
                    Trả hàng miễn phí 15 ngày · Chính hãng 100% · Miễn phí vận
                    chuyển · Bảo vệ người mua
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm">Số lượng:</span>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  +
                </button>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border border-[#F53D2D] text-[#F53D2D] hover:bg-[#fff5f2] font-semibold py-2 rounded"
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={() => alert("Chuyển đến trang thanh toán")}
                  className="flex-1 bg-[#F53D2D] hover:bg-[#e33326] text-white font-semibold py-2 rounded"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="max-w-6xl mx-auto px-4 py-6 bg-white mt-6 rounded shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Chi tiết sản phẩm
          </h2>
          <div className="text-sm text-gray-700">
            <p>
              <strong>Danh mục:</strong> Chưa phân loại
            </p>
            <p>
              <strong>Số lượng trong kho:</strong> {product.stock || 0}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mt-4 mb-2">Mô tả sản phẩm</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description || "Không có mô tả sản phẩm."}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
