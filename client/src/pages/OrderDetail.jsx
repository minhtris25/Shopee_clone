import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import ChatFloatingButton from "../components/ChatFloatingButton";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import {
  FileText,
  BaggageClaim,
  Truck,
  PackageCheck,
  Star,
  MessageSquare,
  Store,
  ChevronLeft,
  Info,
  MapPin,
} from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  const getToken = () => localStorage.getItem("access_token");
  const navigate = useNavigate();
  const handleBack = () => navigate("/order");

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'CHỜ XÁC NHẬN';
      case 'processing': return 'ĐANG XỬ LÝ';
      case 'shipped': return 'ĐANG GIAO HÀNG';
      case 'delivered': return 'ĐÃ NHẬN ĐƯỢC HÀNG';
      case 'cancelled': return 'ĐƠN HÀNG ĐÃ HỦY';
      default: return 'Không rõ trạng thái';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng (COD)';
      case 'bank_transfer':
      case 'shopeepay': return 'Chuyển khoản ngân hàng';
      case 'credit_card': return 'Thẻ tín dụng';
      default: return 'Không xác định';
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
        if (res.data.order.status === 'delivered') {
          setShowReviewPrompt(true);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate('/login');
        } else {
          setError(err.response?.data?.message || "Không thể tải đơn hàng. Vui lòng thử lại sau.");
        }
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (isCancelling) return;
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    setIsCancelling(true);
    try {
      const token = getToken();
      const res = await axios.post(`http://localhost:8000/api/orders/${order.id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setOrder(res.data.order);
      toast.success(res.data.message || 'Đơn hàng đã được hủy thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể hủy đơn hàng.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReceivedOrder = async () => {
    if (!window.confirm('Xác nhận đã nhận được đơn hàng này?')) return;
    try {
      const token = getToken();
      const res = await axios.post(`http://localhost:8000/api/orders/${order.id}/confirm-delivery`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setOrder(res.data.order);
      toast.success(res.data.message || 'Đơn hàng đã được xác nhận đã nhận!');
      setShowReviewPrompt(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xác nhận nhận hàng.");
    }
  };

  const handleRepurchase = () => {
    toast.info("Chức năng mua lại đang được phát triển!");
  };

  const getDynamicTimelineSteps = (orderStatus) => {
    if (orderStatus === 'cancelled') {
      return [
        {
          label: "Đơn Hàng Đã Đặt",
          icon: FileText,
          completed: true,
          active: false,
          time: order?.created_at ? new Date(order.created_at).toLocaleString() : ''
        },
        {
          label: "Đơn Hàng Đã Hủy",
          icon: Info,
          completed: true,
          active: true,
          time: order?.updated_at ? new Date(order.updated_at).toLocaleString() : 'Đã hủy'
        }
      ];
    }
    const steps = [
      { label: "Đã Đặt Hàng", icon: FileText, statusKey: 'pending' },
      { label: "Đang Xử Lý", icon: BaggageClaim, statusKey: 'processing' },
      { label: "Đã Giao Cho ĐVVC", icon: Truck, statusKey: 'shipped' },
      { label: "Đã Nhận Được Hàng", icon: PackageCheck, statusKey: 'delivered' },
      { label: "Đã Hoàn Thành", icon: Star, statusKey: 'delivered' }
    ];
    return steps.map(step => {
      let completed = false;
      let active = false;
      let time = '';
      if (step.statusKey === 'pending' && ['pending', 'processing', 'shipped', 'delivered'].includes(orderStatus)) {
        completed = true;
        time = order?.created_at ? new Date(order.created_at).toLocaleString() : '';
      } else if (step.statusKey === 'processing' && ['processing', 'shipped', 'delivered'].includes(orderStatus)) {
        completed = true;
      } else if (step.statusKey === 'shipped' && ['shipped', 'delivered'].includes(orderStatus)) {
        completed = true;
      } else if (step.statusKey === 'delivered' && orderStatus === 'delivered') {
        completed = true;
      }
      if (orderStatus === step.statusKey || (step.statusKey === 'delivered' && orderStatus === 'delivered')) {
        active = true;
      }
      return { ...step, completed, active, time };
    });
  };

  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!order) return <div className="text-center mt-10">Đang tải đơn hàng...</div>;

  const timelineSteps = getDynamicTimelineSteps(order.status);

  return (
    <>
      <Header />
      <ChatFloatingButton />
      <div className="bg-gray-100 min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <button onClick={handleBack} className="flex items-center text-sm text-gray-600 hover:text-orange-500 mb-4">
            <ChevronLeft size={18} className="mr-1" /> TRỞ LẠI
          </button>

          <div className="bg-white p-4 rounded-xl shadow mb-4 flex justify-between items-center">
            <div className="text-gray-700 font-medium">
              MÃ ĐƠN HÀNG: <span className="text-black">{order.order_code || order.id}</span>
            </div>
            <div className="font-semibold text-sm uppercase">
              {getStatusText(order.status) === 'ĐƠN HÀNG ĐÃ HỦY' ? (
                <span className="text-gray-500">{getStatusText(order.status)}</span>
              ) : getStatusText(order.status) === 'ĐÃ NHẬN ĐƯỢC HÀNG' ? (
                <span className="text-green-600">{getStatusText(order.status)}</span>
              ) : (
                <span className="text-orange-600">{getStatusText(order.status)}</span>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-start text-center">
            {timelineSteps.map((step, index) => (
              <div key={index} className={`flex-1 flex flex-col items-center relative ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`text-3xl p-3 rounded-full ${step.active ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}>
                  <step.icon size={24} />
                </div>
                <div className="mt-2 text-xs font-medium">{step.label}</div>
                {step.time && <div className="text-xs text-gray-500">{step.time}</div>}
                {index < timelineSteps.length - 1 && (
                  <div className={`absolute top-1/2 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 transform -translate-y-1/2 ${timelineSteps[index + 1].completed ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>
{/* Order Details */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Chi Tiết Đơn Hàng</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ giao hàng:</p>
                  <p className="font-medium">{order.shipping_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phương thức thanh toán:</p>
                  <p className="font-medium">{getPaymentMethodText(order.payment_method)}</p>
                  <p className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
                    {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Các sản phẩm:</p>
                {Array.isArray(order.items) && order.items.map((item) => (

                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div className="flex items-center">
                      <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 object-cover rounded mr-4" />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">x{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₫{(item.quantity * item.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="text-right mb-4">
                <p className="text-sm text-gray-600">Tổng tiền hàng: ₫{order.total_price ? (order.total_price - order.shipping_fee).toLocaleString() : '0'}</p>
                <p className="text-sm text-gray-600">Phí vận chuyển: ₫{order.shipping_fee.toLocaleString()}</p>
                <p className="text-lg font-bold text-orange-600">Tổng cộng: ₫{order.total_price ? order.total_price.toLocaleString() : '0'}</p>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                {/* Cancel Button */}
                {order.status === 'pending' && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Đang hủy...' : 'Hủy Đơn Hàng'}
                  </button>
                )}

                {/* Received Order Button */}
                {order.status === 'shipped' && (
                  <button
                    onClick={handleReceivedOrder}
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                  >
                    Đã Nhận Được Hàng
                  </button>
                )}

                {/* Contact Seller Button */}
                {(order.status !== "cancelled" && order.status !== "delivered") && (
                  <button className="px-4 py-2 border text-sm text-gray-700 rounded hover:bg-gray-50">
                    Liên Hệ Người Bán
                  </button>
                )}

                {/* VIEW REFUND INFO BUTTON (when cancelled) */}
                {order.status === "cancelled" && (
                  <button className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                    Xem Thông Tin Hoàn Tiền
                  </button>
                )}

                {/* COMPLETE ORDER BUTTON (when delivered and not yet prompted for review) */}
                {order.status === 'delivered' && !showReviewPrompt && (
                  <button
                    onClick={() => setShowReviewPrompt(true)}
                    className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition"
                  >
                    Hoàn Tất Đơn Hàng
                  </button>
                )}

                {/* REVIEW BUTTON (only when order is delivered and completed by user) */}
                {order.status === "delivered" && showReviewPrompt && (
                  <button className="bg-green-500 text-white text-sm px-4 py-1 rounded hover:bg-green-600">
                    Đánh giá
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      <Footer />
    </>
  );
};

export default OrderDetail;