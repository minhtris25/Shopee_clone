import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import ChatFloatingButton from "../components/ChatFloatingButton";
import { Search, Store, Truck, MessageSquare } from "lucide-react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';


const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  const performFetchOrders = async (query = "") => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem đơn hàng.");
        setLoading(false);
        return;
      }

      const params = {};
      if (query) {
        params.search = query;
      }

      const response = await axios.get("http://127.0.0.1:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: params,
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

  const debouncedFetch = useCallback(
    debounce((query) => performFetchOrders(query), 500),
    []
  );
  const handleConfirmReceived = async (orderId) => {
  const token = getAuthToken();
  if (!token) {
    toast.error("Bạn chưa đăng nhập.");
    return;
  }

  const confirm = window.confirm("Xác nhận bạn đã nhận được hàng?");
  if (!confirm) return;

  try {
    const res = await axios.post(`http://localhost:8000/api/orders/${orderId}/confirm-delivery`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    toast.success("Đã xác nhận nhận hàng.");
    // Cập nhật trạng thái trong danh sách đơn hàng
    setOrders(prev =>
      prev.map(order => order.id === orderId ? { ...order, status: 'delivered' } : order)
    );
  } catch (err) {
    toast.error("Lỗi khi xác nhận nhận hàng.");
    console.error(err);
  }
};


  useEffect(() => {
    debouncedFetch(searchQuery);

    return () => {
      debouncedFetch.cancel();
    };
  }, [searchQuery, debouncedFetch]);

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                className="bg-white mb-5 rounded-xl shadow-md cursor-pointer"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                {/* Header shop + trạng thái */}
                <div className="flex justify-between items-center px-4 py-3 bg-white">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <Store size={14} className="text-gray-600" />
                      {order.seller ? order.seller.name : 'Shop không xác định'} 
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-orange-500 font-medium text-xs border px-2 py-0.5 rounded hover:bg-orange-50">
                        <MessageSquare size={12} className="text-orange-500" />
                        Chat
                      </button>
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
                    {(() => {
                        switch (order.status) {
                            case "pending": return "CHỜ XÁC NHẬN";
                            case "processing": return "ĐANG XỬ LÝ";
                            case "shipped": return "ĐANG GIAO HÀNG";
                            case "delivered": return "Giao hàng thành công";
                            case "cancelled": return "ĐÃ HỦY";
                            default: return "Không rõ";
                        }
                    })()}
                  </div>
                </div>

                {/* Sản phẩm */}
                <div className="px-4 py-2 space-y-4">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <img
                        src={item.product ? item.product.thumbnail : 'https://via.placeholder.com/64'}
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
                  {order.status === "shipped" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ Ngăn sự kiện lan lên thẻ cha
                      handleConfirmReceived(order.id);
                    }}
                    className="bg-green-500 text-white text-sm px-4 py-1 rounded hover:bg-green-600"
                  >
                    Đã Nhận Được Hàng
                  </button>
                  )}
                  {order.status === "cancelled" || order.status === "delivered" ? (
                    <>
                      {order.status === "cancelled" && (
                          <button className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                            Xem Thông Tin Hoàn Tiền
                          </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info("Tính năng mua lại đang được phát triển.");
                        }}
                        className="bg-orange-500 text-white text-sm px-4 py-1 rounded hover:bg-orange-600"
                      >
                        Mua Lại
                      </button>

                      {order.status === "delivered" && (
                         <button className="bg-green-500 text-white text-sm px-4 py-1 rounded hover:bg-green-600">
                         Đánh giá
                       </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                        Liên Hệ Người Bán
                      </button>
                      {order.status === "pending" && (
                          <button className="bg-orange-500 text-white text-sm px-4 py-1 rounded hover:bg-orange-600">
                            Theo dõi đơn hàng
                          </button>
                      )}
                       {/* Bạn có thể thêm các nút khác cho các trạng thái 'processing' và 'shipped' tại đây nếu cần */}
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