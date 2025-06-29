import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import ChatFloatingButton from "../components/ChatFloatingButton";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
  FileText,
  DollarSign,
  Truck,
  PackageCheck,
  Star,
  MessageSquare,
  Store,
  ChevronLeft,
  Info, // Icon cho trạng thái hủy
  MapPin, // Icon cho Theo dõi đơn
} from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const getToken = () => localStorage.getItem("access_token");
  const navigate = useNavigate();
  const handleBack = () => navigate("/order");

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'CHỜ XÁC NHẬN';
      case 'processing':
        return 'ĐANG XỬ LÝ';
      case 'shipped':
        return 'ĐANG GIAO HÀNG';
      case 'delivered':
        return 'ĐƠN HÀNG ĐÃ HOÀN THÀNH';
      case 'cancelled':
        return 'ĐƠN HÀNG ĐÃ HỦY';
      default:
        return 'Không rõ trạng thái';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng (COD)';
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng';
      case 'credit_card':
        return 'Thẻ tín dụng';
      default:
        return 'Không xác định';
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem đơn hàng.");
          return;
        }

        const res = await axios.get(`http://localhost:8000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
        if (err.response && err.response.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate('/login');
        } else if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
          toast.error(err.response.data.message);
        } else {
          setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
          toast.error("Không thể tải đơn hàng.");
        }
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác và sản phẩm sẽ được hoàn lại vào kho.')) {
      return;
    }

    setIsCancelling(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập.");
        navigate('/login');
        return;
      }

      const res = await axios.post(`http://localhost:8000/api/orders/${order.id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setOrder(res.data.order);
      toast.success(res.data.message || 'Đơn hàng đã được hủy thành công!');

    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err.response ? err.response.data : err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
      }
    } finally {
      setIsCancelling(false);
    }
  };

  // Hàm xử lý "Theo dõi Đơn" (Chỉ là placeholder, cần thêm logic thực tế)
  const handleTrackOrder = () => {
    toast.info("Chức năng theo dõi đơn hàng đang được phát triển!");
    // Logic thực tế sẽ điều hướng đến trang theo dõi vận chuyển hoặc hiển thị modal
  };

  // Hàm xử lý "Mua Lại" (Chỉ là placeholder, cần thêm logic thực tế)
  const handleRepurchase = () => {
    toast.info("Đang thêm sản phẩm vào giỏ hàng để mua lại...");
    // Logic thực tế sẽ gọi API để thêm sản phẩm vào giỏ và điều hướng đến trang giỏ hàng
  };


  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!order) return <div className="text-center mt-10">Đang tải đơn hàng...</div>;

  const calculateSubtotal = () => {
    if (!order.items) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();

  const getDynamicTimelineSteps = (orderStatus, orderData) => {
    // Nếu đơn hàng đã hủy, chỉ hiển thị "Đơn Hàng Đã Đặt" và "Đơn Hàng Đã Hủy"
    if (orderStatus === 'cancelled') {
      return [
        {
          label: "Đơn Hàng Đã Đặt",
          icon: FileText,
          completed: true,
          time: orderData.created_at ? new Date(orderData.created_at).toLocaleString() : ''
        },
        {
          label: "Đơn Hàng Đã Hủy",
          icon: Info,
          completed: true, // Luôn đánh dấu hoàn thành khi trạng thái là 'cancelled'
          time: orderData.updated_at ? new Date(orderData.updated_at).toLocaleString() : 'Đã hủy' // Sử dụng updated_at làm thời gian hủy
        },
      ];
    }

    // Nếu không phải hủy, hiển thị dòng thời gian đầy đủ
    const steps = [
      { label: "Đơn Hàng Đã Đặt", icon: FileText, statusKey: 'created_at' },
      { label: "Đã Xác Nhận Thanh Toán", icon: DollarSign, statusKey: 'payment_status' },
      { label: "Đã Giao Cho ĐVVC", icon: Truck, statusKey: 'shipped_at' },
      { label: "Đã Nhận Được Hàng", icon: PackageCheck, statusKey: 'delivered_at' },
      { label: "Đơn Hàng Đã Hoàn Thành", icon: Star, statusKey: 'completed_at' },
    ];

    const currentSteps = steps.map(step => {
      let completed = false;
      let time = '';

      if (step.statusKey === 'created_at' && orderData.created_at) {
        completed = true;
        time = new Date(orderData.created_at).toLocaleString();
      } else if (step.statusKey === 'payment_status' && orderData.payment_status === 'paid') {
        completed = true;
        time = orderData.payment?.created_at ? new Date(orderData.payment.created_at).toLocaleString() : 'Đã thanh toán';
      } else if (step.statusKey === 'shipped_at' && (orderStatus === 'shipped' || orderStatus === 'delivered')) {
        completed = true;
        time = orderData.shipped_at ? new Date(orderData.shipped_at).toLocaleString() : 'Đã giao cho ĐVVC';
      } else if (step.statusKey === 'delivered_at' && orderStatus === 'delivered') {
        completed = true;
        time = orderData.delivered_at ? new Date(orderData.delivered_at).toLocaleString() : 'Đã nhận được hàng';
      } else if (step.statusKey === 'completed_at' && orderStatus === 'delivered') {
        completed = true;
        time = orderData.completed_at ? new Date(orderData.completed_at).toLocaleString() : 'Đã hoàn thành';
      }

      // Không cần đoạn này nữa vì đã xử lý riêng trường hợp 'cancelled' ở đầu hàm
      // if (orderStatus === 'cancelled' && step.statusKey !== 'created_at') {
      //     completed = false;
      // }

      return { ...step, completed, time };
    });

    return currentSteps;
  };

  const currentTimeline = getDynamicTimelineSteps(order.status, order);

  return (
    <>
      <Header />
      <ChatFloatingButton />
      <div className="bg-gray-100 min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-6">
          {/* Nút Trở Lại */}
          <button
            onClick={handleBack}
            className="flex items-center text-sm text-gray-600 hover:text-orange-500 mb-4"
          >
            <ChevronLeft size={18} className="mr-1" />
            TRỞ LẠI
          </button>

          {/* Mã đơn hàng và trạng thái */}
          <div className="bg-white p-4 rounded-xl shadow mb-4 flex justify-between items-center">
            <div className="text-gray-700 font-medium">
              MÃ ĐƠN HÀNG: <span className="text-black">{order.order_code || order.id}</span>
            </div>
            <div className="font-semibold text-sm uppercase">
              {getStatusText(order.status) === 'ĐƠN HÀNG ĐÃ HỦY' ? (
                <span className="text-gray-500">{getStatusText(order.status)}</span>
              ) : getStatusText(order.status) === 'ĐƠN HÀNG ĐÃ HOÀN THÀNH' ? (
                <span className="text-green-600">{getStatusText(order.status)}</span>
              ) : (
                <span className="text-orange-600">{getStatusText(order.status)}</span>
              )}
            </div>
          </div>

          {/* Tiến trình */}
          <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-start">
            {currentTimeline.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center w-1/5 relative">
                <div
                  className={`rounded-full p-2 mb-1 ${
                    step.completed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <step.icon size={20} />
                </div>
                <p className="text-xs font-semibold text-gray-700">{step.label}</p>
                <p className="text-xs text-gray-500 mt-1">{step.time}</p>
                {index < currentTimeline.length - 1 && (
                  <div
                    className={`absolute top-[14px] left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 -z-10 transform -translate-x-1/2 ${
                      currentTimeline[index + 1].completed ? "bg-green-300" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Đường ngắt quãng xanh cam */}
          <div className="w-full flex flex-wrap gap-1 my-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full ${
                  i % 2 === 0 ? "bg-green-500" : "bg-orange-500"
                }`}
                style={{ width: "2cm" }}
              ></div>
            ))}
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="bg-white rounded-xl shadow p-6">
            {/* Shop */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <span className="text-red-500 border border-red-500 px-1 rounded text-xs font-bold">Yêu thích+</span>
                {order.seller?.name || "Tên Shop"}
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-orange-500 text-xs border border-orange-500 px-3 py-1 rounded hover:bg-orange-50">
                  <MessageSquare size={12} className="text-orange-500" />
                  Chat
                </button>
                <button className="flex items-center gap-1 text-gray-600 text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                  <Store size={12} />
                  Xem Shop
                </button>
              </div>
            </div>

            {/* Sản phẩm */}
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start mb-4">
                <img
                  src={item.product?.thumbnail || "https://via.placeholder.com/64"}
                  alt={item.product?.name || "Sản phẩm"}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{item.product?.name}</p>
                  <p className="text-sm text-gray-500 mt-1">x{item.quantity}</p>
                </div>
                <div className="text-right text-sm text-red-500 font-semibold min-w-[80px]">
                  ₫{(item.price || 0).toLocaleString()}
                </div>
              </div>
            ))}

            {/* Tổng kết đơn */}
            <div className="text-sm text-gray-700 space-y-2 mt-6">
              <div className="flex justify-between">
                <span>Tổng tiền hàng</span>
                <span>₫{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>₫{(order.shipping_fee || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Giảm giá phí vận chuyển</span>
                <span>-₫{(order.shipping_discount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg text-red-600 font-bold pt-2">
                <span>Thành tiền</span>
                <span>₫{(order.total_price || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Ghi chú thanh toán */}
            <div className="mt-6 p-4 bg-orange-50 text-sm text-gray-800 text-right">
              {order.payment_status === 'paid' ? (
                <span>Đơn hàng đã được thanh toán.</span>
              ) : order.payment_status === 'pending' ? (
                order.payment_method === 'cod' ? (
                  <span>Vui lòng thanh toán <span className="text-orange-600 font-semibold">₫{(order.total_price || 0).toLocaleString()}</span> khi nhận hàng.</span>
                ) : (
                  <span>Đơn hàng đang chờ xác nhận thanh toán. Vui lòng kiểm tra phương thức thanh toán hoặc hoàn tất thanh toán.</span>
                )
              ) : order.payment_status === 'unpaid' ? (
                <span>Đơn hàng chưa được thanh toán. Vui lòng hoàn tất thanh toán.</span>
              ) : (
                <span>Trạng thái thanh toán: {order.payment_status || 'Không rõ'}.</span>
              )}
            </div>

            {/* Phương thức thanh toán */}
            <div className="text-right text-sm mt-4">
              <span className="text-gray-500">Phương thức Thanh toán:</span>{" "}
              <span className="font-medium text-gray-700 ml-2">
                {getPaymentMethodText(order.payment_method)}
              </span>
            </div>

            {/* Cảm ơn + hành động */}
            <div className="flex justify-between items-center gap-3 mt-6">
              <p className="text-sm text-gray-500">Cảm ơn bạn đã mua sắm tại Shopee!</p>
              <div className="flex gap-3">
                {/* NÚT HỦY ĐƠN HÀNG */}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:bg-red-300 transition"
                  >
                    {isCancelling ? 'Đang hủy...' : 'Hủy Đơn Hàng'}
                  </button>
                )}

                {/* NÚT THEO DÕI ĐƠN */}
                {order.status === 'shipped' && (
                  <button
                    onClick={handleTrackOrder}
                    className="flex items-center gap-1 px-4 py-2 border text-sm text-orange-600 border-orange-600 rounded hover:bg-orange-50"
                  >
                    <MapPin size={16} /> Theo dõi Đơn
                  </button>
                )}

                {/* NÚT LIÊN HỆ NGƯỜI BÁN */}
                {(order.status !== "cancelled" && order.status !== "delivered") && (
                  <button className="px-4 py-2 border text-sm text-gray-700 rounded hover:bg-gray-50">
                    Liên Hệ Người Bán
                  </button>
                )}

                {/* NÚT XEM THÔNG TIN HOÀN TIỀN (khi đã hủy) */}
                {order.status === "cancelled" && (
                  <button className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                    Xem Thông Tin Hoàn Tiền
                  </button>
                )}

                {/* NÚT MUA LẠI (khi đã hủy hoặc giao thành công) */}
                {(order.status === "cancelled" || order.status === "delivered") && (
                  <button
                    onClick={handleRepurchase}
                    className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
                  >
                    Mua Lại
                  </button>
                )}

                {/* NÚT ĐÁNH GIÁ (chỉ khi đơn hàng đã hoàn thành) */}
                {order.status === "delivered" && (
                  <button className="bg-green-500 text-white text-sm px-4 py-1 rounded hover:bg-green-600">
                    Đánh giá
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetail;