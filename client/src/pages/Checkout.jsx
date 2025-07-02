// src/pages/CheckoutPage.js
import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaMapMarkerAlt, FaTruck, FaCreditCard, FaShieldAlt, FaEdit } from "react-icons/fa";
import { HiOutlineTicket } from "react-icons/hi";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state?.selectedItemsForCheckout || []);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const groupedCartItems = useMemo(() => {
    return cart.reduce((acc, item) => {
      const shopId = item.shopId || "default_shop";
      // Assuming 'shopName' is still available directly on the item or derived from 'shop'
      const shopName = item.shopName || "Cửa hàng của tôi";
      // **CHANGE HERE: Access seller.name from the item object**
      const ownerName = item.seller?.name || "Người bán"; // Lấy tên người dùng từ item.seller.name, hoặc giá trị mặc định

      if (!acc[shopId]) {
        acc[shopId] = {
          name: shopName,
          ownerName: ownerName, // Lưu tên người dùng vào đây
          items: [],
        };
      }
      acc[shopId].items.push(item);
      return acc;
    }, {});
  }, [cart]);

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getShippingFee = () => {
    return shippingMethod === "express" ? 25000 : 0;
  };

  const getVoucherDiscount = () => {
    if (selectedVoucher === "FREESHIP") return Math.min(getShippingFee(), 15000);
    if (selectedVoucher === "DISCOUNT10") return Math.min(getSubtotal() * 0.1, 50000);
    return 0;
  };

  const getTotal = () => {
    return getSubtotal() + getShippingFee() - getVoucherDiscount();
  };

  const handlePlaceOrder = () => {
    toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Shopee.");

    const fullCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedFullCart = fullCart.filter(
      (cartItem) => !cart.some((selectedItem) => selectedItem.id === cartItem.id)
    );
    localStorage.setItem("cart", JSON.stringify(updatedFullCart));

    setCart([]);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-orange-500 font-medium text-xl">shopee</span>
            <span className="text-gray-400">|</span>
            <span className="text-lg font-medium">Thanh Toán</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <p className="text-gray-500 text-lg">Không có sản phẩm nào được chọn để thanh toán.</p>
            <button
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
              onClick={() => navigate("/cart")}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Address remains the same */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <h2 className="text-lg font-medium">Địa Chỉ Nhận Hàng</h2>
                  </div>
                  <button className="text-blue-500 hover:underline flex items-center space-x-1">
                    <FaEdit className="w-4 h-4" />
                    <span>Thay Đổi</span>
                  </button>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">Nguyen Van A</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">(+84) 123 456 789</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
                      </p>
                      <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-xs mt-2">
                        Mặc Định
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products by Shop */}
              {Object.entries(groupedCartItems).map(([shopId, shopData]) => (
                <div key={shopId} className="bg-white rounded-lg shadow-sm">
                  {/* Shop Header */}
                  <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-500">🏪</span>
                        <span className="font-medium">{shopData.name}</span>
                        {/* Hiển thị tên người dùng (chủ shop) bên cạnh tên shop */}
                        {shopData.ownerName && (
                          <span className="text-gray-500 text-sm ml-2">({shopData.ownerName})</span>
                        )}
                        <button className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">Chat</button>
                      </div>
                    </div>
                  </div>

                  {/* Product List for this Shop */}
                  <div className="divide-y">
                    {shopData.items.map((item) => (
                      <div key={item.id} className="p-4 flex items-center space-x-4">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <img
                          src={item.thumbnail || "/assets/no-image.png"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                          <p className="text-gray-500 text-sm mt-1">Phân loại hàng: Đen</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-600">₫{item.price.toLocaleString("vi-VN")}</span>
                            <span className="text-gray-600">x{item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-orange-500">
                            ₫{(item.price * item.quantity).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shop Footer - Voucher & Shipping */}
                  <div className="p-4 border-t bg-gray-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaTruck className="text-green-500" />
                        <span className="text-sm">Tùy chọn vận chuyển:</span>
                      </div>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`shipping-${shopId}`}
                            value="standard"
                            checked={shippingMethod === "standard"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="text-orange-500"
                          />
                          <span className="text-sm">Nhanh (Miễn phí)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`shipping-${shopId}`}
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="text-orange-500"
                          />
                          <span className="text-sm">Hỏa tốc (+₫25.000)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <HiOutlineTicket className="text-orange-500" />
                        <span className="text-sm">Voucher của Shop:</span>
                      </div>
                      <select
                        value={selectedVoucher || ""}
                        onChange={(e) => setSelectedVoucher(e.target.value || null)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="">Chọn voucher</option>
                        <option value="FREESHIP">Miễn phí vận chuyển</option>
                        <option value="DISCOUNT10">Giảm 10% (tối đa ₫50k)</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Lời nhắn:</span>
                      <input
                        type="text"
                        placeholder="Lưu ý cho Người bán..."
                        className="flex-1 border rounded px-3 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-4">
              {/* Payment Method remains the same */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <FaCreditCard className="text-blue-500" />
                  <span>Phương thức thanh toán</span>
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <span className="text-sm">Thanh toán khi nhận hàng</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <span className="text-sm">Thẻ Tín dụng/Ghi nợ</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <span className="text-sm">Ví MoMo</span>
                  </label>
                </div>
              </div>

              {/* Order Summary remains the same */}
              <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
                <h3 className="font-medium mb-4">Chi tiết thanh toán</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền hàng</span>
                    <span>₫{getSubtotal().toLocaleString("vi-VN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span>₫{getShippingFee().toLocaleString("vi-VN")}</span>
                  </div>
                  {getVoucherDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Voucher giảm giá</span>
                      <span>-₫{getVoucherDiscount().toLocaleString("vi-VN")}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-medium text-lg">
                    <span>Tổng thanh toán</span>
                    <span className="text-orange-500">₫{getTotal().toLocaleString("vi-VN")}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-sm transition-colors"
                >
                  Đặt Hàng
                </button>

                <div className="flex items-center justify-center space-x-1 mt-3 text-xs text-gray-500">
                  <FaShieldAlt className="text-green-500" />
                  <span>Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo</span>
                </div>
                <div className="text-center">
                  <button className="text-blue-500 hover:underline text-xs">
                    Điều khoản Shopee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;