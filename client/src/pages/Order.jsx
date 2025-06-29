import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import ChatFloatingButton from "../components/ChatFloatingButton";
import { Search, Store, Truck, MessageSquare } from "lucide-react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();
        if (!token) {
          setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem đơn hàng.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        
        setOrders(response.data.orders.data);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Hàm xử lý khi nhấp vào một đơn hàng
  const handleOrderClick = (orderId) => {
    navigate(`/order-detail/${orderId}`); // Chuyển hướng đến trang chi tiết đơn hàng
  };

  return (
    <>
      <Header />
      <ChatFloatingButton />
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />

        <div className="flex-1 px-3 py-4">
          <h1 className="text-xl font-semibold mb-4">Đơn Mua</h1>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {loading && <p className="text-center text-gray-600">Đang tải đơn hàng...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && orders.length === 0 && (
            <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>
          )}

          {!loading && !error && orders.length > 0 && (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white mb-5 rounded-xl shadow-md cursor-pointer" // Thêm cursor-pointer để người dùng biết có thể click
                onClick={() => handleOrderClick(order.id)} // Thêm onClick handler
              >
                {/* Header shop + trạng thái */}
                <div className="flex justify-between items-center px-4 py-3 bg-white">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <Store size={14} className="text-gray-600" />
                      {order.shop ? order.shop.name : 'Shop không xác định'}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Nút Chat */}
                      <button className="flex items-center gap-1 text-orange-500 font-medium text-xs border px-2 py-0.5 rounded hover:bg-orange-50">
                        <MessageSquare size={12} className="text-orange-500" />
                        Chat
                      </button>
                      {/* Nút Xem Shop */}
                      <button className="flex items-center gap-1 border border-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded hover:bg-gray-50 transition">
                        <Store size={14} />
                        Xem Shop
                      </button>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      order.status === "cancelled"
                        ? "text-gray-500"
                        : order.status === "delivered"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                  >
                    {order.status !== "cancelled" && (
                      <Truck
                        size={14}
                        className={`${
                          order.status === "delivered" ? "text-green-500" : "text-yellow-500"
                        }`}
                      />
                    )}
                    {order.status === "cancelled"
                      ? "ĐÃ HỦY"
                      : order.status === "delivered"
                      ? "Giao hàng thành công"
                      : "ĐANG XỬ LÝ"}
                  </div>
                </div>

                {/* Sản phẩm */}
                <div className="px-4 py-2 space-y-4">
                  {order.items && order.items.map((item, index) => ( // Đã sửa từ order_items thành items
                    <div key={index} className="flex gap-3">
                      <img
                        src={item.product ? item.product.thumbnail : ''} // Đổi image_url thành thumbnail (giả định theo Product.php)
                        alt={item.product ? item.product.name : 'Sản phẩm'}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                      <div className="flex-1 flex flex-col justify-between text-sm">
                        <div>
                          <div className="text-gray-800 font-medium">
                            {item.product ? item.product.name : 'Sản phẩm không rõ'}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          x{item.quantity}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-red-500 font-semibold">
                          ₫{(item.price || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tổng tiền */}
                <div className="flex justify-end px-4 py-3 bg-gray-50 text-sm">
                  <div className="text-gray-700 mr-2">Thành tiền:</div>
                  <div className="text-red-500 font-bold text-lg">
                    ₫{(order.total_price || 0).toLocaleString()}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end px-4 py-3 gap-2 bg-white">
                  {order.status === "cancelled" ? (
                    <>
                      <button className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                        Xem Thông Tin Hoàn Tiền
                      </button>
                      <button className="bg-orange-500 text-white text-sm px-4 py-1 rounded hover:bg-orange-600">
                        Mua Lại
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                        Liên Hệ Người Bán
                      </button>
                      {order.status === "delivered" && (
                         <button className="bg-green-500 text-white text-sm px-4 py-1 rounded hover:bg-green-600">
                         Đánh giá
                       </button>
                      )}
                      <button className="bg-orange-500 text-white text-sm px-4 py-1 rounded hover:bg-orange-600">
                        Mua Lại
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Order;